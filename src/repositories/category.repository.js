
const database = require('../database');
const { verifyJWT } = require('../utils/checkToken');
const { isEmpty } = require('../utils')

exports.getCategory = async (req, res, next) => {

    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const result = await database.raw(`SELECT F.uuid, F.name, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM category F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) ORDER BY F.name;`);
            const response = {
                length: result.rows.length,
                category: result.rows
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}

exports.postCategory = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            if (isEmpty(req.body.name)) {
                return res.status(200).send({ "status": 200, "message": "Descrição não pode ser vazio" });
            } else {

                const resultDesc = await database.raw("SELECT * FROM category WHERE name='" + [req.body.name] + "'")
                if (resultDesc.rowCount > 0) {
                    return res.status(200).send({ "status": 200, "message": "Essa descrição já existe" });
                } else {

                    await database.raw("INSERT INTO category (name, createby, createdate, modifyby, modifydate) VALUES ('" + [req.body.name] + "','" + vToken.id + "','" + Date.now() + "','" + vToken.id + "','" + Date.now() + "');");
                    return res.status(201).send({ "status": 201, "message": "Dados inseridos com sucesso" });

                }
            }
        }

    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }

}

exports.updateCategory = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            if (isEmpty(req.body.name)) {
                return res.status(200).send({ "status": 200, "message": "Descrição não pode ser vazio" });
            } else {

                const findId = await database.raw("SELECT name FROM category WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
                if (findId.rowCount === 0) {
                    return res.status(200).send({ "status": 200, "message": "UUID não encontrado" });
                } else {

                    const resultDesc = await database.raw("SELECT * FROM category WHERE name='" + [req.body.name] + "' AND uuid != '" + [req.body.uuid] + "';")
                    if (resultDesc.rowCount > 0) {
                        return res.status(200).send({ "status": 200, "message": "Essa descrição já existe" });
                    } else {

                        await database.raw("UPDATE category SET name='" + [req.body.name] + "', modifyby = '" + vToken.id + "', modifydate = '" + Date.now() + "' WHERE uuid='" + [req.body.uuid] + "';")
                        return res.status(201).send({ "status": 201, "message": "Dados atualizados com sucesso" });

                    }
                }
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const findId = await database.raw("SELECT name FROM category WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
            if (findId.rowCount === 0) {
                return res.status(200).send({ "status": 200, "message": "UUID não encontrado" });
            } else {
                const resultMeasureUsed = await database.raw("SELECT * FROM production WHERE categoryid='" + [req.body.uuid] + "';")
                if (resultMeasureUsed.rowCount !== 0) {
                    return res.status(200).send({ "status": 200, "message": "Categoria sendo utilizada em Produção" });
                } else {
                    await database.raw("DELETE FROM category WHERE uuid='" + [req.body.uuid] + "';")
                    return res.status(201).send({ "status": 201, "message": "Dados excluidos com sucesso" });
                }
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}