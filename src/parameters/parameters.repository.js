const InternalServerError = require('../common/errors/types/InternalServerError');
const database = require('../database');

class ParametersRepository {
    constructor() {
        this.database = database;
    }

    async getAll() {
        try {
            return this.database('parameters as P')
                .select(
                    'P.uuid',
                    'P.id',
                    'P.description',
                    'P.value',
                    'P.type',
                    'P.active',
                )
                .orderBy('P.id');

        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get parameters")
        }
    }

    async getOne(uuid) {
        try {
            return this.database('parameters as P')
                .select(
                    'P.uuid',
                    'P.id',
                    'P.description',
                    'P.value',
                    'P.type',
                    'P.active',
                )
                .where('P.uuid', uuid)
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get parameter")
        }
    }

    async getById(id) {
        try {
            return this.database('parameters as P')
                .select(
                    'P.uuid',
                    'P.id',
                    'P.description',
                    'P.value',
                    'P.type',
                    'P.active',
                )
                .where('P.id', id)
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get parameter")
        }
    }

    async update(uuid, { value }) {
        try {
            await this.database('parameters')
                .where('uuid', uuid)
                .update({ value: String(value).trim() });

            return this.getOne(uuid);
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to update parameter")
        }
    }
}

module.exports = ParametersRepository;