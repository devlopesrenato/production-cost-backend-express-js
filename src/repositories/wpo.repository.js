
const { db } = require('../db');
const { isEmpty, isZeroOrLess } = require('../utils');
const { verifyJWT } = require('../utils/checkToken');

exports.getWPO = async (req, res, next) => {

    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const result = await db.query(`SELECT F.uuid, F.name, F.quantity, F.price, F.type, F.active, U.name as createby, F.createdate, R.name as modifyby, F.modifydate FROM wpo F LEFT JOIN users U ON F.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users R ON F.modifyby=CAST(R.uuid AS VARCHAR) ORDER BY F.name;`);
            const response = {
                length: result.rows.length,
                wpo: result.rows
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}

exports.postWPO = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        if (vToken.status === 200) {
            if (isEmpty(req.body.name) || isEmpty(req.body.quantity) || isEmpty(req.body.price)) {
                return res.status(200).send({ "status": 200, "message": "Descrição, Quantidade e Preço não podem ser null ou vazios" });
            }
            if (isZeroOrLess(req.body.quantity)) {
                return res.status(200).send({ "status": 200, "message": "A quantidade deve ser maior que 0" });
            }
            if (!["manual", "distributed"].includes(req.body.type)) {
                return res.status(200).send({ "status": 200, "message": "Tipo deve ser manual ou distribuído" });
            }

            const resultDesc = await db.query("SELECT * FROM wpo WHERE name='" + [req.body.name] + "'")
            if (resultDesc.rowCount > 0) {
                return res.status(200).send({ "status": 200, "message": "Essa descrição já existe" });
            } else {

                await db.query("INSERT INTO wpo (name, quantity, price, type, createby, createdate, modifyby, modifydate) VALUES ('" + [req.body.name] + "','" + [req.body.quantity] + "','" + [req.body.price] + "','" + [req.body.type] + "','" + vToken.id + "','" + Date.now() + "','" + vToken.id + "','" + Date.now() + "');");
                return res.status(201).send({ "status": 201, "message": "Dados inseridos com sucesso" });

            }


        }

    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }

}

exports.updateWPO = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            if (isEmpty(req.body.name) || isEmpty(req.body.quantity) || isEmpty(req.body.price)) {
                return res.status(200).send({ "status": 200, "message": "Descrição, Quantidade e Preço não podem ser null ou vazios" });
            } else {

                if (isZeroOrLess(req.body.quantity)) {
                    return res.status(200).send({ "status": 200, "message": "A quantidade deve ser maior que 0" });
                } else {

                    const findId = await db.query("SELECT name FROM wpo WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
                    if (findId.rowCount === 0) {
                        return res.status(200).send({ "status": 200, "message": "UUID não encontrado" });
                    } else {

                        const resultDesc = await db.query("SELECT * FROM wpo WHERE name='" + [req.body.name] + "' AND uuid <> '" + [req.body.uuid] + "'")
                        if (resultDesc.rowCount > 0) {
                            return res.status(200).send({ "status": 200, "message": "Essa descrição já existe" });
                        } else {

                            await db.query(`
                                UPDATE wpo 
                                SET 
                                    name='${req.body.name}', 
                                    quantity='${req.body.quantity}', 
                                    price='${req.body.price}', 
                                    active='${req.body.active}', 
                                    modifyby='${vToken.id}', 
                                    modifydate=NOW()
                                WHERE uuid='${req.body.uuid}';
                            `)
                            return res.status(201).send({ "status": 201, "message": "Dados atualizados com sucesso" });

                        }
                    }
                }
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}

exports.deleteWPO = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            const findId = await db.query("SELECT name FROM wpo WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
            if (findId.rowCount === 0) {
                return res.status(200).send({ "status": 200, "message": "UUID não encontrado" });
            } else {

                const resultMeasureUsed = await db.query("SELECT * FROM wpoused WHERE wpoid='" + [req.body.uuid] + "';")
                if (resultMeasureUsed.rowCount !== 0) {
                    return res.status(200).send({ "status": 200, "message": "Custo sendo utilizado por Produção" });
                } else {

                    await db.query("DELETE FROM wpo WHERE uuid='" + [req.body.uuid] + "';")
                    return res.status(201).send({ "status": 201, "message": "Dados excluidos com sucesso" });

                }
            }
        }
    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }
}