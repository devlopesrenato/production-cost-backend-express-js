const InternalServerError = require('../common/errors/types/InternalServerError');
const database = require('../database');

class UnitsOfMeasurementRepository {
    constructor() {
        this.database = database;
    }

    async getAll() {
        try {
            return this.database
                .select(
                    'E.uuid',
                    'E.name',
                    { createBy: 'U.name' },
                    'E.createDate',
                    { modifyBy: 'S.name' },
                    'E.modifyDate',
                    'E.ordering'
                )
                .from('unitsOfMeasurement as E')
                .leftJoin('users as U', 'E.createBy', 'U.uuid')
                .leftJoin('users as S', 'E.modifyBy', 'S.uuid')
                .orderBy('E.ordering');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get units of measurements")
        }
    }

}

module.exports = UnitsOfMeasurementRepository;