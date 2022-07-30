
const { db } = require('../db');
const { verifyJWT } = require('../utils/checkToken');

exports.getExactMeasure = async (req, res, next) => {
    try {
        const vToken = verifyJWT(req.headers.authorization)
        if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
        else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
        else if (vToken.status === 200) {

            const result = await db.query(`SELECT E.uuid, E.name, U.name AS createby, E.createdate, S.name AS modifyby, E.modifydate, E.ordenation FROM exactmeasure E LEFT JOIN users U ON E.createby=CAST(U.uuid AS VARCHAR) LEFT JOIN users S ON E.modifyby=CAST(S.uuid AS VARCHAR) ORDER BY ordenation;`);
            const response = {
                length: result.rows.length,
                exactmeasure: result.rows
            }

            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ 'Error': 500, 'message': error.error });
    }
}

// exports.postExactMeasure = async (req, res, next) => {
//     try {
//         const vToken = verifyJWT(req.headers.authorization)
//         if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
//         else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
//         else if (vToken.status === 200) {
//             const result = await db.query("INSERT INTO exactmeasure (name, createby, createdate, modifyby, modifydate, ordenation) VALUES ('" + [req.body.name] + "','" + vToken.id + "','" + Date.now() + "','" + vToken.id + "','" + Date.now() + "','" + [req.body.ordenation] + "');");
//             return res.status(200).send({ "status": 200, "message": "Dados inseridos com sucesso" });
//         }

//     } catch (error) {
//         return res.status(500).send({ 'Error': error.code, 'message': error.error });
//     }

// }

// exports.updateExactMeasure = async (req, res, next) => {
//     try {
//         const vToken = verifyJWT(req.headers.authorization)
//         if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
//         else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
//         else if (vToken.status === 200) {
//             const findId = await db.query("SELECT name FROM exactmeasure WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
//             if (findId.rowCount === 0) {
//                 return res.status(404).send({ "status": 404, "message": "UUID não encontrado" });
//             } else {
//                 const result = await db.query("UPDATE exactmeasure SET name = '" + [req.body.name] + "', modifyby = '" + vToken.id + "', modifydate = '" + Date.now() + "', ordenation = '" + [req.body.ordenation] + "' WHERE uuid='" + [req.body.uuid] + "';")
//                 return res.status(200).send({ "status": 200, "message": "Dados atualizados com sucesso" });
//             }
//         }
//     } catch (error) {
//         return res.status(500).send({ 'Error': error.code, 'message': error.error });
//     }
// }

// exports.deleteExactMeasure = async (req, res, next) => {
//     try {
//         const vToken = verifyJWT(req.headers.authorization)
//         if (vToken.status === 401) { return res.status(401).send({ "error": 401, "message": vToken.message }) }
//         else if (vToken.status === 500) { return res.status(500).send({ "error": 500, "message": vToken.message }) }
//         else if (vToken.status === 200) {
//             const findId = await db.query("SELECT name FROM exactmeasure WHERE CAST(uuid AS VARCHAR)=CAST('" + [req.body.uuid] + "' AS VARCHAR);")
//             if (findId.rowCount === 0) {
//                 return res.status(404).send({ "status": 404, "message": "UUID não encontrado" });
//             } else {
//                 const result = await db.query("DELETE FROM exactmeasure WHERE uuid='" + [req.body.uuid] + "';")
//                 return res.status(200).send({ "status": 200, "message": "Dados excluidos com sucesso" });
//             }
//         }
//     } catch (error) {
//         return res.status(500).send({ 'Error': error.code, 'message': error.error });
//     }
// }