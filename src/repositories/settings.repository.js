const { db } = require('../db');
const { verifyJWT } = require('../utils/checkToken');

exports.getSettings = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const result = await db.query(`
                SELECT 
                    uuid, 
                    id,
                    description,
                    value,
                    active                    
                FROM settings
                ORDER BY id;
            `);
            const response = {
                length: result.rows.length,
                settings: result.rows
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ Error: 500, message: error.message });
    }
}

exports.getSettingById = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const { id } = req.params;
            if (id === undefined) {
                return res.status(400).send({ "error": 400, "message": "Id não enviado" })
            }
            if (String(id).replace(/[0-9]/g, "") !== "") {
                return res.status(400).send({ "error": 400, "message": "id deve ser um numero" })
            }

            const result = await db.query(`
                SELECT 
                    uuid, 
                    id,
                    description,
                    value,
                    active                    
                FROM settings
                WHERE id=${id}
                ORDER BY id;
            `);
            const response = result.rows[0]
            if (!response) {
                return res.status(404).send({ "error": 404, "message": "Parâmetro não encontrado" })
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ Error: 500, message: error.message });
    }
}

exports.postSettings = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const { id, description, value, active } = req.body;
            if ([id, description, value, active].includes(undefined)) {
                return res.status(400).send({
                    "error": 400,
                    "message": "Verifique os valores enviados",
                    fields: {
                        id: String(id),
                        description: String(description),
                        value: String(value),
                        active: String(active)
                    }
                })
            }
            if (String(id).replace(/[0-9]/g, "") !== "") {
                return res.status(400).send({
                    "error": 400,
                    "message": "id deve ser um numero",
                    fields: {
                        id: String(id).replace(/09/g, ""),
                    }
                })
            }
            const already = await db.query(`
            SELECT * FROM settings WHERE id = ${id}
            `)
            if (already.rowCount) {
                return res.status(409).send({
                    "error": 409,
                    "message": "Já existe um parâmetro com este id",
                    setting: already.rows[0],

                })
            }
            await db.query(`
                INSERT INTO settings (
                    id, description, value, active
                ) values (
                    ${id}, '${description}', '${value}', ${active}
                )
            `);
            const created = await db.query(`
            SELECT * FROM settings WHERE id = ${id}
            `)
            if (!created.rowCount) {
                return res.status(400).send({
                    "error": 400,
                    "message": "Erro ao criar parâmetro",
                })
            }
            const response = created.rows[0];
            return res.status(201).send(response);
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ Error: 500, message: error.message });
    }
}

exports.putSettings = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {
            const { id, description, value, active } = req.body;
            if ([id, value].includes(undefined)) {
                return res.status(400).send({
                    "error": 400,
                    "message": "Verifique os valores enviados",
                    fields: {
                        id: String(id),
                        value: String(value),
                    }
                })
            }
            if (String(id).replace(/[0-9]/g, "") !== "") {
                return res.status(400).send({
                    "error": 400,
                    "message": "id deve ser um numero",
                    fields: {
                        id: String(id).replace(/09/g, ""),
                    }
                })
            }
            const exists = await db.query(`
            SELECT * FROM settings WHERE id = ${id}
            `)
            if (!exists.rowCount) {
                return res.status(404).send({
                    "error": 404,
                    "message": "Parâmetro não encontrado",
                })
            }
            await db.query(`
                UPDATE settings
                SET updateat=NOW()
                    ${description ? `,description='${description}'` : ''}
                    ${value ? `,value='${value}'` : ''}
                    ${active ? `,active='${active}'` : ''}
                WHERE id=${id}
            `);
            const updated = await db.query(`
            SELECT * FROM settings WHERE id = ${id}
            `)
            if (!updated.rowCount) {
                return res.status(400).send({
                    "error": 400,
                    "message": "Erro ao atualizar parâmetro",
                })
            }
            const response = updated.rows[0];
            return res.status(200).send(response);
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ Error: 500, message: error.message });
    }
}

