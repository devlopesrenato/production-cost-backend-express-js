const database = require('../database');
const { isEmpty, isZeroOrLess } = require('../utils');
const { verifyJWT } = require('../utils/checkToken');

exports.getSimpleMeasure = async (req, res, next) => {

    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const result = await database.raw(`SELECT S.uuid, S.name, E.name as typemeasure, S.typemeasure as typemeasureid, S.quantity, U.name as createby, S.createdate, R.name as modifyby, S.modifydate FROM simplemeasure S INNER JOIN exactmeasure E ON S.typemeasure=CAST(E.uuid AS VARCHAR) LEFT JOIN users U ON S.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON S.modifyby=CAST(R.uuid AS VARCHAR) ORDER BY S.name;`);
            const response = {
                length: result.rows.length,
                simplemeasure: result.rows
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}

exports.postSimpleMeasure = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            if (isEmpty(req.body.name) || isEmpty(req.body.typemeasure) || isEmpty(req.body.quantity)) {
                return res.status(200).send({ "status": 200, "message": "Nome, Medida e Quantidade não devem ser vazios" });
            } else {

                if (isZeroOrLess(req.body.quantity)) {
                    return res.status(200).send({ "status": 200, "message": "Quantidade deve ser maior que zero" });
                } else {

                    const resultDesc = await database.raw("SELECT * FROM simplemeasure WHERE name='" + [req.body.name] + "'")
                    if (resultDesc.rowCount > 0) {
                        return res.status(200).send({ "status": 200, "message": "Essa descrição já existe" });
                    } else {

                        const measure = await database.raw("SELECT * FROM exactmeasure WHERE CAST(uuid as VARCHAR)='" + [req.body.typemeasure] + "'")
                        if (measure.rowCount === 0) {
                            return res.status(200).send({ "status": 200, "message": "Campo Medida vazio ou inválido" });
                        } else {

                            await database.raw("INSERT INTO simplemeasure (name, typemeasure, quantity, createby, createdate, modifyby, modifydate) VALUES ('" + [req.body.name] + "','" + [req.body.typemeasure] + "','" + [req.body.quantity] + "','" + vToken.id + "','" + Date.now() + "','" + vToken.id + "','" + Date.now() + "');");
                            return res.status(201).send({ "status": 201, "message": "Dados inseridos com sucesso" });

                        }
                    }
                }
            }
        }

    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }

}

exports.updateSimpleMeasure = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            if (isEmpty(req.body.name) || isEmpty(req.body.typemeasure) || isEmpty(req.body.quantity)) {
                return res.status(200).send({ "status": 200, "message": "Nome, Medida e Quantidade não devem ser vazios" });
            } else {

                if (isZeroOrLess(req.body.quantity)) {
                    return res.status(200).send({ "status": 200, "message": "Quantidade deve ser maior que zero" });
                } else {

                    const findId = await database.raw("SELECT name FROM simplemeasure WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
                    if (findId.rowCount === 0) {
                        return res.status(200).send({ "status": 200, "message": "UUID não encontrado" });
                    } else {

                        const verifyDouble = await database.raw("SELECT * FROM simplemeasure where uuid<>'" + [req.body.uuid] + "' and name='" + [req.body.name] + "'")
                        if (verifyDouble.rowCount > 0) {
                            return res.status(200).send({ "status": 200, "message": "Essa descrição já existe" });
                        } else {

                            const measure = await database.raw("SELECT * FROM exactmeasure WHERE CAST(uuid as VARCHAR)='" + [req.body.typemeasure] + "'")
                            if (measure.rowCount === 0) {
                                return res.status(200).send({ "status": 200, "message": "Medida não encontrada" });
                            } else {

                                await database.raw("UPDATE simplemeasure SET name = '" + [req.body.name] + "', typemeasure='" + [req.body.typemeasure] + "', quantity='" + [req.body.quantity] + "', modifyby = '" + vToken.id + "', modifydate = '" + Date.now() + "' WHERE uuid='" + [req.body.uuid] + "';")
                                return res.status(201).send({ "status": 201, "message": "Dados atualizados com sucesso" });

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

exports.deleteSimpleMeasure = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            const findId = await database.raw("SELECT name FROM simplemeasure WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
            if (findId.rowCount === 0) {
                return res.status(200).send({ "status": 200, "message": "UUID não encontrado" });
            } else {

                const resultMeasureUsed = await database.raw("SELECT * FROM feedstock WHERE measurement='" + [req.body.uuid] + "';")
                if (resultMeasureUsed.rowCount !== 0) {
                    return res.status(200).send({ "status": 200, "message": "Medida sendo utilizada por Matéria Prima" });
                } else {

                    await database.raw("DELETE FROM simplemeasure WHERE uuid='" + [req.body.uuid] + "';")
                    return res.status(201).send({ "status": 201, "message": "Dados excluidos com sucesso" });
                }
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}