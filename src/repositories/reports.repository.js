
const { db } = require('../db');
const { verifyJWT } = require('../utils/checkToken');

exports.getCostPerProduction = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const productionsRes = await db.query("SELECT P.uuid, P.name, P.price, C.name AS Category, P.categoryid, U.name AS createby, P.createdate, R.name AS modifyby, P.modifydate FROM production P LEFT JOIN users U ON P.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON P.modifyby=CAST(R.uuid AS VARCHAR) LEFT JOIN category C ON P.categoryid=CAST(C.uuid AS VARCHAR) ORDER BY P.name;");
            const feedstockUsed = await db.query("SELECT U.uuid, U.feedstockid, F.name AS feedstock, F.measurement AS measurementid, S.name AS measurement,  U.quantity, U.productionid FROM feedstockused U LEFT JOIN feedstock F ON CAST(U.feedstockid AS VARCHAR)=CAST(F.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) ORDER BY F.name;");
            const wpoUsed = await db.query("SELECT U.uuid, U.wpoid, F.name AS wpo, U.quantity, U.productionid FROM wpoused U LEFT JOIN wpo F ON CAST(U.wpoid AS VARCHAR)=CAST(F.uuid AS VARCHAR) ORDER BY F.name;");
            const wpo = await db.query("SELECT F.uuid, F.name, F.quantity, F.price, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM wpo F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) ORDER BY F.name;")
            const feedstock = await db.query("SELECT F.uuid, F.name, F.measurement as measurementid, S.name as measurement, F.quantity, F.price, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM feedstock F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) ORDER BY F.name;")
             const wpoDistributed = await db.query(`
                SELECT 
                    F.uuid, 
                    F.name,
                    F.quantity,
                    F.price,
                    F.active,
                    U.name as createby,
                    F.createdate,
                    R.name as modifyby,
                    F.modifydate
                FROM wpo F 
                LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) 
                LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR)
                WHERE F.active=true 
                AND F.type='distributed'
                ORDER BY F.name;
            `)
            var feedstockUsedRes = [];
            feedstockUsed.rows.forEach(fsu => {
                var price;
                feedstock.rows.forEach(fs => {
                    if (fsu.feedstockid === fs.uuid) {
                        price = (fs.price / fs.quantity) * fsu.quantity
                    }
                })
                feedstockUsedRes.push({ "uuid": fsu.uuid, "feedstockid": fsu.feedstockid, "feedstock": fsu.feedstock, "measurementid": fsu.measurementid, "measurement": fsu.measurement, "quantity": fsu.quantity, "price": price, "productionid": fsu.productionid })
            })

            var wpoUsedRes = [];
            wpoUsed.rows.forEach(fsu => {
                var price;
                wpo.rows.forEach(fs => {
                    if (fsu.wpoid === fs.uuid) {
                        price = (fs.price / fs.quantity) * fsu.quantity
                    }
                })
                wpoUsedRes.push({ "uuid": fsu.uuid, "wpoid": fsu.wpoid, "wpo": fsu.wpo, "quantity": fsu.quantity, "price": price, "productionid": fsu.productionid })
            })



            var productions = [];
            productionsRes.rows.forEach(prod => {
                var feedstockUsed = [];
                var cost = 0;
                feedstockUsedRes.forEach(fdUs => {
                    if (fdUs.productionid === prod.uuid) {
                        cost += fdUs.price
                        feedstockUsed.push(fdUs)
                    }
                })
                var wpoUsed = []
                wpoUsedRes.forEach(wpou => {
                    if (wpou.productionid === prod.uuid) {
                        cost += wpou.price
                        wpoUsed.push(wpou)
                    }
                })
                wpoDistributed.rows.forEach(wpod => {
                    console.log(wpod)
                    cost += parseFloat(wpod.price)
                    wpoUsed.push({
                        uuid: wpod.uuid,
                        wpoid: wpod.uuid,
                        wpo: wpod.name,
                        price: wpod.price,
                        quantity: wpod.quantity,
                        productionid: prod.uuid,
                        type: "distributed"
                    })
                })
                const profit = prod.price - cost;
                var percent = 0;
                if (cost > 0) {
                    percent = (profit * 100) / cost
                } else {
                    percent = 100;
                }

                productions.push({ "uuid": prod.uuid, "name": prod.name, "price": prod.price, "cost": cost, "profit": profit, "percent": percent, "category": prod.category, "categoryid": prod.categoryid, "feedstockused": feedstockUsed, "wpoused": wpoUsed, "createby": prod.createby, "createdate": prod.createdate, "modifyby": prod.modifyby, "modifydate": prod.modifydate })
            })

            const response = {
                length: productions.length,
                production: productions
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ Error: 500, message: error.message });
    }
}
