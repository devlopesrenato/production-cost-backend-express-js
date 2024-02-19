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
                    'UM.uuid',
                    'UM.name',
                    { createBy: 'UC.name' },
                    'UM.createDate',
                    { modifyBy: 'UU.name' },
                    'UM.modifyDate',
                    'UM.ordering'
                )
                .from('unitsOfMeasurement as UM')
                .leftJoin('users as UC', 'UM.createBy', 'UC.uuid')
                .leftJoin('users as UU', 'UM.modifyBy', 'UU.uuid')
                .orderBy('UM.ordering');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get units of measurements")
        }
    }

    async getOne(uuid) {
        try {
            return this.database
                .select(
                    'UM.uuid',
                    'UM.name',
                    { createBy: 'UC.name' },
                    'UM.createDate',
                    { modifyBy: 'UU.name' },
                    'UM.modifyDate',
                    'UM.ordering'
                )
                .from('unitsOfMeasurement as UM')
                .leftJoin('users as UC', 'UM.createBy', 'UC.uuid')
                .leftJoin('users as UU', 'UM.modifyBy', 'UU.uuid')
                .where('UM.uuid', uuid)
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get units of measurements")
        }
    }

}

module.exports = UnitsOfMeasurementRepository;