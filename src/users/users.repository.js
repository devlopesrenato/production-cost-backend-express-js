const InternalServerError = require('../common/errors/types/InternalServerError');
const database = require('../database');

class UsersRepository {
    constructor() {
        this.database = database;
    }

    async getByNickName(nickname) {
        try {
            return database
                .select('uuid', 'nickname', 'name', 'pass', 'updatedat')
                .from('users')
                .where('nickname', nickname)
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get user")
        }
    }

    async getById(uuid) {
        try {
            return database
                .select('uuid', 'nickname', 'name', 'pass', 'updatedat')
                .from('users')
                .where('uuid', uuid)
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get user")
        }
    }

    async update(uuid, { name, newpass }) {
        try {
            const updateFields = { updatedat: database.fn.now() };

            if (name) {
                updateFields.name = name;
            }

            if (newpass) {
                updateFields.pass = newpass;
            }

            await database('users')
                .where('uuid', uuid)
                .update(updateFields)

            const updated = await this.getById(uuid);
            return {
                ...updated,
                pass: undefined
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to update user")
        }
    }
}

module.exports = UsersRepository;