const InternalServerError = require('../common/errors/types/InternalServerError');
const database = require('../database');

class ProductionFeedstocksRepository {
    constructor() {
        this.database = database;
    }

    async getAll() {
        try {
            return this.database('productionFeedstocks as PF')
                .select(
                    'PF.uuid',
                    'PF.feedstockId',
                    'F.name AS feedstock',
                    'F.customMeasurementId',
                    'CM.name AS measurement',
                    this.database.raw('(("F"."price" / "F"."quantity") * "PF"."quantity") AS price'),
                    'PF.quantity',
                    'PF.productionId',
                )
                .leftJoin('feedstocks AS F', 'F.uuid', 'PF.feedstockId')
                .leftJoin('customMeasurements AS CM', 'CM.uuid', 'F.customMeasurementId')
                .orderBy('F.name');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get production feedstocks")
        }
    }

    async getOne(uuid) {
        try {
            return database('productionFeedstocks as PF')
                .select(
                    'PF.uuid',
                    'PF.feedstockId',
                    'F.name AS feedstock',
                    'F.customMeasurementId',
                    'CM.name AS measurement',
                    this.database.raw('(("F"."price" / "F"."quantity") * "PF"."quantity") AS price'),
                    'PF.quantity',
                    'PF.productionId',
                )
                .leftJoin('feedstocks AS F', 'F.uuid', 'PF.feedstockId')
                .leftJoin('customMeasurements AS CM', 'CM.uuid', 'F.customMeasurementId')
                .where('PF.uuid', uuid)
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get production feedstock");
        }
    }

    async getByRelations({ feedstockId, productionId }) {
        try {
            return database('productionFeedstocks as PF')
                .select(
                    'PF.uuid',
                    'PF.feedstockId',
                    'F.name AS feedstock',
                    'F.customMeasurementId',
                    'CM.name AS measurement',
                    this.database.raw('(("F"."price" / "F"."quantity") * "PF"."quantity") AS price'),
                    'PF.quantity',
                    'PF.productionId',
                )
                .leftJoin('feedstocks AS F', 'F.uuid', 'PF.feedstockId')
                .leftJoin('customMeasurements AS CM', 'CM.uuid', 'F.customMeasurementId')
                .where('PF.feedstockId', feedstockId)
                .where('PF.productionId', productionId)
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get production feedstock")
        }
    }

    async getByProduction({ productionId }) {
        try {
            return database('productionFeedstocks as PF')
                .select(
                    'PF.uuid',
                    'PF.feedstockId',
                    'F.name AS feedstock',
                    'F.customMeasurementId',
                    'CM.name AS measurement',
                    this.database.raw('(("F"."price" / "F"."quantity") * "PF"."quantity") AS price'),
                    'PF.quantity',
                    'PF.productionId',
                )
                .leftJoin('feedstocks AS F', 'F.uuid', 'PF.feedstockId')
                .leftJoin('customMeasurements AS CM', 'CM.uuid', 'F.customMeasurementId')
                .where('PF.productionId', productionId);
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get production feedstock")
        }
    }

    async create({ feedstockId, productionId, quantity }) {
        try {
            await this.database('productionFeedstocks')
                .insert({
                    feedstockId,
                    productionId,
                    quantity
                });

            return this.getByRelations({ feedstockId, productionId });
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to create production feedstock")
        }
    }

    async createMany(data) {
        try {
            return await this.database('productionFeedstocks')
                .insert(data)
                .then(() => true)
                .catch(() => false);
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to create production feedstocks")
        }
    }

    async update(uuid, { quantity }) {
        try {
            await database('productionFeedstocks')
                .where('uuid', uuid)
                .update({ quantity })

            return await this.getOne(uuid);
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to update production feedstock")
        }
    }

    async delete(uuid) {
        try {
            const deleted = await this.getOne(uuid);

            await database('productionFeedstocks')
                .where('uuid', uuid)
                .delete();

            return deleted;
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to delete production feedstock")
        }
    }
}

module.exports = ProductionFeedstocksRepository;