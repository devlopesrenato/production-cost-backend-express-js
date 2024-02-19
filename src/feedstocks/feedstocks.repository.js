const InternalServerError = require('../common/errors/types/InternalServerError');
const database = require('../database');

class FeedstocksRepository {
    constructor() {
        this.database = database;
    }

    async getAll() {
        try {
            return this.database('feedstocks as F')
                .select(
                    'F.uuid',
                    'F.name',
                    'F.price',
                    'F.quantity',
                    'F.customMeasurementId',
                    'CM.name as customMeasurement',
                    'F.createById',
                    'UC.name as createBy',
                    'F.createDate',
                    'F.modifyById',
                    'UU.name as modifyBy',
                    'F.modifyDate',
                )
                .leftJoin('users AS UC', 'UC.uuid', 'F.createById')
                .leftJoin('users AS UU', 'UU.uuid', 'F.modifyById')
                .leftJoin('customMeasurements AS CM', 'CM.uuid', 'F.customMeasurementId')
                .orderBy('F.name');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get feedstocks")
        }
    }

    async getOne(uuid) {
        try {
            return this.database('feedstocks as F')
                .select(
                    'F.uuid',
                    'F.name',
                    'F.price',
                    'F.quantity',
                    'F.customMeasurementId',
                    'CM.name as customMeasurement',
                    'F.createById',
                    'UC.name as createBy',
                    'F.createDate',
                    'F.modifyById',
                    'UU.name as modifyBy',
                    'F.modifyDate',
                    this.database.raw('COUNT("PF"."feedstockId") AS used')
                )
                .leftJoin('users AS UC', 'UC.uuid', 'F.createById')
                .leftJoin('users AS UU', 'UU.uuid', 'F.modifyById')
                .leftJoin('customMeasurements AS CM', 'CM.uuid', 'F.customMeasurementId')
                .leftJoin('productionFeedstocks as PF', 'PF.feedstockId', 'F.uuid')
                .where('F.uuid', uuid)
                .groupBy(
                    'F.uuid',
                    'F.name',
                    'F.customMeasurementId',
                    'CM.name',
                    'F.quantity',
                    'F.price',
                    'UC.name',
                    'F.createDate',
                    'UU.name',
                    'F.modifyDate'
                )
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get feedstock")
        }
    }

    async getByName(name) {
        try {
            return this.database('feedstocks as F')
                .select(
                    'F.uuid',
                    'F.name',
                    'F.price',
                    'F.quantity',
                    'F.customMeasurementId',
                    'CM.name as customMeasurement',
                    'F.createById',
                    'UC.name as createBy',
                    'F.createDate',
                    'F.modifyById',
                    'UU.name as modifyBy',
                    'F.modifyDate',
                    this.database.raw('COUNT("PF"."feedstockId") AS used')
                )
                .leftJoin('users AS UC', 'UC.uuid', 'F.createById')
                .leftJoin('users AS UU', 'UU.uuid', 'F.modifyById')
                .leftJoin('customMeasurements AS CM', 'CM.uuid', 'F.customMeasurementId')
                .leftJoin('productionFeedstocks as PF', 'PF.feedstockId', 'F.uuid')
                .where('F.name', name)
                .groupBy(
                    'F.uuid',
                    'F.name',
                    'F.customMeasurementId',
                    'CM.name',
                    'F.quantity',
                    'F.price',
                    'UC.name',
                    'F.createDate',
                    'UU.name',
                    'F.modifyDate'
                )
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get feedstock")
        }
    }

    async create({ name, customMeasurementId, quantity, price, userId }) {
        try {
            await this.database('feedstocks').insert({
                name: name,
                customMeasurementId: customMeasurementId,
                quantity: quantity,
                price: price,
                createById: userId,
                createDate: database.fn.now(),
                modifyById: userId,
                modifyDate: database.fn.now()
            });
            const created = await this.getByName(name);
            return created;
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to create feedstock")
        }
    }

    async update(uuid, { name, customMeasurementId, quantity, price, userId }) {
        try {
            await this.database('feedstocks')
                .where('uuid', uuid)
                .update({
                    modifyDate: this.database.fn.now(),
                    modifyById: userId,
                    ...(name && { name: name }),
                    ...(customMeasurementId && { customMeasurementId }),
                    ...(quantity && { quantity: quantity }),
                    ...(price && { price: price })
                });
            const updated = await this.getOne(uuid);
            return updated;
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to update feedstock")
        }
    }

    async delete(uuid) {
        try {
            const deleted = await this.getOne(uuid);

            await database('feedstocks')
                .where('uuid', uuid)
                .delete();

            return deleted;
        } catch (err) {
            console.log(err)
            throw new InternalServerError("Failed to delete feedstock")
        }
    }

}

module.exports = FeedstocksRepository;