
const database = require('../database');
const { isEmpty, isZeroOrLess } = require('../utils');
const { verifyJWT } = require('../utils/checkToken');

exports.getFeedstock = async (req, res, next) => {

    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const result = await database.raw(`SELECT F.uuid, F.name, F.measurement as measurementid, S.name as measurement, F.quantity, F.price, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM feedstock F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) LEFT JOIN simplemeasure S ON CAST(F.measurement AS VARCHAR)=CAST(S.uuid AS VARCHAR) ORDER BY F.name;`);
            const response = {
                length: result.rows.length,
                feedstock: result.rows
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}

exports.postFeedstock = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            if (isEmpty(req.body.name) || isEmpty(req.body.measurement) || isEmpty(req.body.quantity) || isEmpty(req.body.price)) {
                return res.status(200).send({ "status": 200, "message": "Descrição, Medida, Quantidade e Preço não podem ser null ou vazios" });
            } else {

                if (isZeroOrLess(req.body.quantity)) {
                    return res.status(200).send({ "status": 200, "message": "A quantidade deve ser maior que 0" });
                } else {

                    if (isZeroOrLess(req.body.price)) {
                        return res.status(200).send({ "status": 200, "message": "O preço deve ser maior que 0" });
                    } else {

                        const resultDesc = await database.raw("SELECT * FROM feedstock WHERE name='" + [req.body.name] + "'")
                        if (resultDesc.rowCount > 0) {
                            return res.status(200).send({ "status": 200, "message": "Essa descrição já existe" });
                        } else {

                            const resMeasure = await database.raw(`SELECT * FROM simplemeasure WHERE CAST(uuid as VARCHAR)='${req.body.measurement}';`);
                            if (resMeasure.rowCount === 0) {
                                return res.status(200).send({ "status": 200, "message": "Medida não encontrada" });
                            } else {

                                await database.raw("INSERT INTO feedstock (name, measurement, quantity, price, createby, createdate, modifyby, modifydate) VALUES ('" + [req.body.name] + "','" + [req.body.measurement] + "','" + [req.body.quantity] + "','" + [req.body.price] + "','" + vToken.id + "','" + Date.now() + "','" + vToken.id + "','" + Date.now() + "');");
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

exports.updateFeedstock = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            if (isEmpty(req.body.name) || isEmpty(req.body.measurement) || isEmpty(req.body.quantity) || isEmpty(req.body.price)) {
                return res.status(200).send({ "status": 200, "message": "Descrição, Medida, Quantidade e Preço não podem ser null ou vazios" });
            } else {

                const findId = await database.raw("SELECT name FROM feedstock WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
                if (findId.rowCount === 0) {
                    return res.status(200).send({ "status": 200, "message": "UUID não encontrado" });
                } else {

                    if (isZeroOrLess(req.body.quantity)) {
                        return res.status(200).send({ "status": 200, "message": "A quantidade deve ser maior que 0" });
                    } else {

                        if (isZeroOrLess(req.body.price)) {
                            return res.status(200).send({ "status": 200, "message": "O preço deve ser maior que 0" });
                        } else {

                            const resultDesc = await database.raw("SELECT * FROM feedstock WHERE name='" + [req.body.name] + "' AND uuid <> '" + [req.body.uuid] + "'")
                            if (resultDesc.rowCount > 0) {
                                return res.status(200).send({ "status": 200, "message": "Essa descrição já existe" });
                            } else {

                                const resMeasure = await database.raw(`SELECT * FROM simplemeasure WHERE CAST(uuid as VARCHAR)='${req.body.measurement}';`);
                                if (resMeasure.rowCount === 0) {
                                    return res.status(200).send({ "status": 200, "message": "Medida não encontrada" });
                                } else {

                                    await database.raw("UPDATE feedstock SET name='" + [req.body.name] + "', measurement='" + [req.body.measurement] + "', quantity='" + [req.body.quantity] + "', price='" + [req.body.price] + "', modifyby = '" + vToken.id + "', modifydate = '" + Date.now() + "' WHERE uuid='" + [req.body.uuid] + "';")
                                    return res.status(201).send({ "status": 201, "message": "Dados atualizados com sucesso" });

                                }
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

exports.deleteFeedstock = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const findId = await database.raw("SELECT name FROM feedstock WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
            if (findId.rowCount === 0) {
                return res.status(200).send({ "status": 200, "message": "UUID não encontrado" });
            } else {
                const resultMeasureUsed = await database.raw("SELECT * FROM feedstockused WHERE feedstockid='" + [req.body.uuid] + "';")
                if (resultMeasureUsed.rowCount !== 0) {
                    return res.status(200).send({ "status": 200, "message": "Matéria Prima sendo utilizada por Produção" });
                } else {
                    await database.raw("DELETE FROM feedstock WHERE uuid='" + [req.body.uuid] + "';")
                    return res.status(201).send({ "status": 201, "message": "Dados excluidos com sucesso" });
                }
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}