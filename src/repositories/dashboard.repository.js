const database = require('../database');
const { verifyJWT } = require('../utils/checkToken');



exports.getDashboard = async (req, res, next) => {

    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const productionsRes = await database.raw("SELECT P.uuid, P.name, P.price, U.name AS createby, P.createdate, R.name AS modifyby, P.modifydate FROM production P LEFT JOIN users U ON P.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON P.modifyby=CAST(R.uuid AS VARCHAR) WHERE CAST(P.price AS FLOAT) > 0 ORDER BY P.name;");
            const feedstockUsed = await database.raw("SELECT U.uuid, U.feedstockid, F.name AS feedstock, F.measurement AS measurementid, S.name AS measurement,  U.quantity, U.productionid FROM feedstockused U LEFT JOIN feedstock F ON CAST(U.feedstockid AS VARCHAR)=CAST(F.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) WHERE CAST(U.quantity AS FLOAT) > 0 ORDER BY F.name;");
            const wpoUsed = await database.raw("SELECT U.uuid, U.wpoid, F.name AS wpo, U.quantity, U.productionid FROM wpoused U LEFT JOIN wpo F ON CAST(U.wpoid AS VARCHAR)=CAST(F.uuid AS VARCHAR) ORDER BY F.name;");
            const wpo = await database.raw("SELECT F.uuid, F.name, F.quantity, F.price, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM wpo F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) ORDER BY F.name;")
            const feedstock = await database.raw("SELECT F.uuid, F.name, F.measurement as measurementid, S.name as measurement, F.quantity, F.price, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM feedstock F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) ORDER BY F.name;")
            const wpoDistributed = await database.raw(`
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
            const parameters = await database.raw(`
            SELECT 
                uuid, 
                id,
                description,
                value,
                active                    
            FROM settings
            WHERE id=1;
        `);
            const parameterMargin = parameters.rows[0].value;

            var feedstockUsedRes = [];

            var fdsUQtd = [];
            feedstock.rows.forEach(fs => {
                var qtdU = 0;
                feedstockUsed.rows.forEach(fsu => {
                    if (fs.uuid === fsu.feedstockid) {
                        qtdU += 1;
                    }
                })
                if (qtdU > 0) {
                    fdsUQtd.push({ "uuid": fs.uuid, "name": fs.name, "value": qtdU })
                }
            });
            var wpoUQtd = [];
            wpo.rows.forEach(wpo => {
                var qtdU = 0;
                wpoUsed.rows.forEach(wpou => {
                    if (wpo.uuid === wpou.wpoid) {
                        qtdU += 1;
                    }
                })
                if (qtdU > 0) {
                    wpoUQtd.push({ "uuid": wpo.uuid, "name": wpo.name, "value": qtdU })
                }
            });
            console.log('aqui')


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
            
            var costArr = [];
            var priceArr = [];
            var margemArr = [];
            productionsRes.rows.forEach(prod => {
                var cost = 0.0;
                feedstockUsedRes.forEach(fdUs => {
                    if (fdUs.productionid === prod.uuid) {
                        cost += fdUs.price
                    }
                })
                wpoUsedRes.forEach(wpou => {
                    if (wpou.productionid === prod.uuid) {
                        cost += wpou.price
                    }
                })
                wpoDistributed.rows.forEach(wpod => {
                    cost += wpod.price
                })
                const price = prod.price * 1
                const costs = cost
                if (cost > 0) {
                    costArr.push({ "uuid": prod.uuid, "name": prod.name, "value": costs, typevalue: "R$" })
                }
                if (price > 0) {
                    priceArr.push({ "uuid": prod.uuid, "name": prod.name, "value": price, typevalue: "R$" })
                }
                const lucro = (prod.price - cost);
                const margem = (lucro * 100) / cost;
                if (margem < parameterMargin) {
                    margemArr.push({ "uuid": prod.uuid, "name": prod.name, "value": margem, typevalue: "%" })
                }
            })

            function compare(a, b) {
                if (a.value < b.value) return 1;
                if (a.value > b.value) return -1;
                return 0;
            }
            function compareAsc(a, b) {
                if (a.value > b.value) return 1;
                if (a.value < b.value) return -1;
                return 0;
            }
            function compareDesc(a, b) {
                if (a.value < b.value) return 1;
                if (a.value > b.value) return -1;
                return 0;
            }
            const price = priceArr.sort(compare)
            const cost = costArr.sort(compareDesc)
            const margem = margemArr.sort(compareAsc)
            const feedstockUsedQtd = fdsUQtd.sort(compareDesc)
            const wpoUsedQtd = wpoUQtd.sort(compareDesc)

            const response = [
                // {
                //     name: "Top 5 produções mais caras:",
                //     data: price.slice(0, 5),
                //     typevalue: "R$"
                // },
                {
                    name: "Custos mais caros:",
                    data: cost.slice(0, 5),
                    typevalue: "R$"
                },
                {
                    name: `Produções com margem abaixo de ${parameterMargin}%:`,
                    data: margem.slice(0, 5),
                    typevalue: "%"
                },
                // {
                //     name: "Matérias-primas mais utilizadas:",
                //     data: feedstockUsedQtd.slice(0, 5),
                //     typevalue: "Quantidade"
                // },
                // {
                //     name: "Outros custos mais utilizados:",
                //     data: wpoUsedQtd.slice(0, 5),
                //     typevalue: "Quantidade"
                // },
            ]

            return res.status(200).send(response);
        }

    } catch (error) {
        console.log({ code: 500, error })
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}
