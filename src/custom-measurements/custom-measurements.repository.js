const InternalServerError = require('../common/errors/types/InternalServerError');
const database = require('../database');

class CustomMeasurementsRepository {
    constructor() {
        this.database = database;
    }

    async getAll() {
        try {
            return database('customMeasurements as CM')
                .select(
                    'CM.uuid',
                    'CM.name',
                    'CM.unitsOfMeasurementId',
                    'UM.name AS unitsOfMeasurement',
                    'CM.quantity',
                    'CM.createById',
                    { createBy: 'UC.name' },
                    'CM.createDate',
                    'CM.modifyById',
                    { modifyBy: 'UU.name' },
                    'CM.modifyDate',
                )
                .leftJoin('unitsOfMeasurement as UM', 'UM.uuid', 'CM.unitsOfMeasurementId')
                .leftJoin('users as UC', 'UC.uuid', 'CM.createById')
                .leftJoin('users as UU', 'UU.uuid', 'CM.modifyById')
                .orderBy('CM.name');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get custom measurements")
        }
    }

    async getOne(uuid) {
        try {
            const result = await database('customMeasurements as CM')
                .select(
                    'CM.uuid',
                    'CM.name',
                    'CM.unitsOfMeasurementId',
                    'UM.name AS unitsOfMeasurement',
                    'CM.quantity',
                    'CM.createById',
                    { createBy: 'UC.name' },
                    'CM.createDate',
                    'CM.modifyById',
                    { modifyBy: 'UU.name' },
                    'CM.modifyDate',
                    this.database.raw(`
                        (
                            SELECT COUNT("F"."uuid") 
                            FROM "feedstocks" AS "F"
                            WHERE "F"."customMeasurementId" = "CM"."uuid"
                        ) > 0 AS used
                    `)
                )
                .leftJoin('unitsOfMeasurement as UM', 'UM.uuid', 'CM.unitsOfMeasurementId')
                .leftJoin('users as UC', 'UC.uuid', 'CM.createById')
                .leftJoin('users as UU', 'UU.uuid', 'CM.modifyById')
                .where('CM.uuid', uuid)
                .first();
                
            if (result?.error) {
                console.log(result)
                throw new InternalServerError('')
            }            
            return result
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get custom measurement");
        }
    }

    async getByName(name) {
        try {
            const result = await database('customMeasurements as CM')
                .select(
                    'CM.uuid',
                    'CM.name',
                    'CM.unitsOfMeasurementId',
                    'UM.name AS unitsOfMeasurement',
                    'CM.quantity',
                    'CM.createById',
                    { createBy: 'UC.name' },
                    'CM.createDate',
                    'CM.modifyById',
                    { modifyBy: 'UU.name' },
                    'CM.modifyDate',
                    this.database.raw(`
                        (
                            SELECT COUNT("F"."uuid") 
                            FROM "feedstocks" AS "F" 
                            WHERE "F"."customMeasurementId" = "CM"."uuid"
                        ) > 0 AS used
                    `)
                )
                .leftJoin('unitsOfMeasurement as UM', 'UM.uuid', 'CM.unitsOfMeasurementId')
                .leftJoin('users as UC', 'UC.uuid', 'CM.createById')
                .leftJoin('users as UU', 'UU.uuid', 'CM.modifyById')
                .where(database.raw('UPPER("CM"."name")'), name.toUpperCase().trim())
                .first();

            if (result?.error) {
                console.log(result)
                throw new InternalServerError('')
            }
            return result
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get custom measurement");
        }
    }

    async create({ name, unitsOfMeasurementId, quantity, userId }) {
        try {
            await this.database('customMeasurements')
                .insert({
                    name: name.trim(),
                    unitsOfMeasurementId,
                    quantity,
                    createById: userId,
                    createDate: database.fn.now(),
                    modifyById: userId,
                    modifyDate: database.fn.now(),
                });

            return this.getByName(name);
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to create custom measurement")
        }
    }

    async update(uuid, { name, unitsOfMeasurementId, quantity, userId }) {
        try {
            await this.database('customMeasurements')
                .where('uuid', uuid)
                .update({
                    modifyDate: this.database.fn.now(),
                    modifyById: userId,
                    ...(name && { name: name }),
                    ...(unitsOfMeasurementId && { unitsOfMeasurementId }),
                    ...(quantity && { quantity })
                });

            return await this.getOne(uuid);
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to update custom measurement")
        }
    }

    async delete(uuid) {
        try {
            const deleted = await this.getOne(uuid);

            await database('customMeasurements')
                .where('uuid', uuid)
                .delete();

            return deleted;
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to delete custom measurement")
        }
    }
}

module.exports = CustomMeasurementsRepository;