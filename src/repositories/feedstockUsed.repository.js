
const { db } = require('../db');
const { isZeroOrLess, isEmpty } = require('../utils');
const { verifyJWT } = require('../utils/checkToken');

exports.getFeedstockUsed = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const feedstockUsed = await db.query("SELECT U.uuid, U.feedstockid, F.name AS feedstock, S.name AS measurement,  U.quantity, U.productionid FROM feedstockused U LEFT JOIN feedstock F ON CAST(U.feedstockid AS VARCHAR)=CAST(F.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) ORDER BY feedstock");
            const feedstock = await db.query("SELECT F.uuid, F.name, F.measurement as measurementid, S.name as measurement, F.quantity, F.price, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM feedstock F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) ORDER BY F.name;")
            var result = [];
            feedstockUsed.rows.forEach(fsu => {
                var newPrice = 0;
                feedstock.rows.forEach(fs => {
                    if (fsu.feedstockid === fs.uuid) {
                        newPrice = (fs.price / fs.quantity) * fsu.quantity
                    }
                })
                const price = newPrice.toFixed(2)
                result.push({ "uuid": fsu.uuid, "feedstockid": fsu.feedstockid, "feedstock": fsu.feedstock, "measurementid": fsu.measurementid, "measurement": fsu.measurement, "quantity": fsu.quantity, "price": price, "productionid": fsu.productionid })
            })
            const response = {
                length: feedstockUsed.rows.length,
                feedstockused: result
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}

exports.postFeedstockUsed = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            if (isEmpty(req.body.quantity) || isEmpty(req.body.feedstockid) || isEmpty(req.body.productionid)) {
                return res.status(200).send({ "status": 200, "message": "Produção, Matéria-Prima e Quantidade não devem ser vazios." });
            } else {

                if (isZeroOrLess(req.body.quantity)) {
                    return res.status(200).send({ "status": 200, "message": "Quantidade deve ser maior que zero" });
                } else {

                    const result = await db.query("SELECT * FROM feedstockused WHERE feedstockid='" + [req.body.feedstockid] + "' AND productionid='" + [req.body.productionid] + "';");
                    if (result.rowCount > 0) {
                        return res.status(200).send({ "status": 200, "message": "Matéria-Prima já utilizada" });
                    } else {

                        const fs = await db.query(`SELECT * FROM feedstock WHERE CAST(uuid as VARCHAR)='${req.body.feedstockid}';`)
                        if (fs.rowCount === 0) {
                            return res.status(200).send({ "status": 200, "message": "Matéria-Prima não encontrada." });
                        } else {

                            const prod = await db.query(`SELECT * FROM production WHERE CAST(uuid as VARCHAR)='${req.body.productionid}';`)
                            if (prod.rowCount === 0) {
                                return res.status(200).send({ "status": 200, "message": "Produção não encontrada." });
                            } else {

                                await db.query("INSERT INTO feedstockused (feedstockid, quantity, productionid) VALUES ('" + [req.body.feedstockid] + "','" + [req.body.quantity] + "','" + [req.body.productionid] + "');");
                                db.query("UPDATE production SET modifyby = '" + vToken.id + "', modifydate = '" + Date.now() + "' WHERE uuid='" + [req.body.productionid] + "';")
                                return res.status(201).send({ "status": 201, "message": "Dados inseridos com sucesso" });

                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}

exports.updateFeedstockUsed = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            if (isZeroOrLess(req.body.quantity)) {
                return res.status(200).send({ "status": 200, "message": "Quantidade deve ser maior que zero" });
            } else {

                const findId = await db.query("SELECT feedstockid FROM feedstockused WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
                if (findId.rowCount === 0) {
                    return res.status(200).send({ "status": 200, "message": "UUID não encontrado" });
                } else {

                    await db.query("UPDATE feedstockused SET quantity='" + [req.body.quantity] + "' WHERE uuid='" + [req.body.uuid] + "';")
                    db.query("UPDATE production SET modifyby = '" + vToken.id + "', modifydate = '" + Date.now() + "' WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.productionid] + "' AS VARCHAR);")
                    return res.status(201).send({ "status": 201, "message": "Dados atualizados com sucesso" });

                }
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}

exports.deleteFeedstockUsed = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const findId = await db.query("SELECT feedstockid FROM feedstockused WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
            if (findId.rowCount === 0) {
                return res.status(200).send({ "status": 200, "message": "UUID não encontrado" });
            } else {
                await db.query("DELETE FROM feedstockused WHERE uuid='" + [req.body.uuid] + "';")
                return res.status(201).send({ "status": 201, "message": "Dados excluidos com sucesso" });
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}
