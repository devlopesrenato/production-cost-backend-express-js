const database = require('../database');
var jwt = require('jsonwebtoken');
const { verifyJWT } = require('../utils/checkToken');
const { isEmpty } = require('../utils');

exports.getSession = async (req, res, next) => {
    try {
        const user = req.body.user
        const pass = req.body.password
        if (isEmpty(user) || isEmpty(pass)) {
            return res.status(401).send({ "status": 401, 'message': "Usuário e senha não podem ser vazios." });
        } else {
            const result = await database.raw(`SELECT name, uuid FROM users WHERE nickname = '${user}' AND pass = '${pass}';`);
            const queryRes = result.rows;
            if (queryRes.length === 0) {
                return res.status(204).send();
            } else {
                const name = queryRes[0].name;
                const id = queryRes[0].uuid;
                const secretKey = process.env.SECRET_KEY
                var token = jwt.sign({ id }, `${secretKey}`, {
                    expiresIn: 604800 // 7 dias
                });

                const dataUser = {
                    "name": name,
                    "id": id,
                    "token": token
                }
                return res.status(200).send(dataUser);
            }
        }

    } catch (error) {
        return res.status(500).send({ "status": 500, 'message': error.message });
    }
}

exports.validToken = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "status": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "status": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const user = await database.raw("SELECT name, uuid from users WHERE uuid = '" + vToken.id + "';")
            if (user.rowCount === 0) {
                return res.status(401).send({ "status": 401, "message": "Usuário inválido." });
            } else {
                // return res.status(200).send({ "status": 200, "user": "Produto inserido com sucesso" });
                return res.status(200).send({ "status": 200, "id": user.rows[0].uuid, "user": user.rows[0].name, });

            }
        }

    } catch (error) {
        return res.status(error.code).send({ "status": error.code, 'message': error.message });
    }
}

exports.updateUser = async (req, res, next) => {

    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const user = await database.raw("SELECT name from users WHERE uuid = '" + vToken.id + "';")
            if (user.rowCount === 0) {
                return res.status(200).send({ "status": 200, "message": "Usuário inválido." });
            } else {
                const result = await database.raw("SELECT * from users WHERE uuid = '" + vToken.id + "' and pass = '" + [req.body[0].pass] + "';");
                if (result.rowCount === 0) {
                    return res.status(200).send({ "status": 200, "message": "Senha ou ID incorretos." });
                } else {
                    await database.raw("UPDATE users SET name = '" + [req.body[0].name] + "', pass = '" + [req.body[0].newpass] + "' WHERE uuid = '" + vToken.id + "';");
                    return res.status(201).send({ "status": 201, "message": "Usuário alterado com sucesso", "user": req.body[0].name });
                }
            }
        }

    } catch (error) {
        return res.status(500).send({ 'Error': error.code, 'message': error.error });
    }

}
