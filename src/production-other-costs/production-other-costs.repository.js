const InternalServerError = require('../common/errors/types/InternalServerError');
const database = require('../database');

class ProductionOtherCostsRepository {
    constructor() {
        this.database = database;
    }

    async getAll() {
        try {
            return database('productionOtherCosts as POC')
                .select(
                    'POC.uuid',
                    'POC.otherCostId',
                    'OC.name AS otherCost',
                    this.database.raw('(("OC"."price" / "OC"."quantity") * "POC"."quantity") AS price'),
                    'POC.quantity',
                    'POC.productionId',
                )
                .leftJoin('otherCosts AS OC', 'OC.uuid', 'POC.otherCostId')
                .orderBy('OC.name');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get production other costs")
        }
    }

    async getOne(uuid) {
        try {
            return this.database
                .select(
                    'POC.uuid,',
                    'POC.otherCostId',
                    'OC.name AS otherCost',
                    '(CAST(OC.price AS FLOAT) / CAST(OC.quantity AS FLOAT)) * CAST(POC.quantity AS FLOAT) AS price',
                    'POC.quantity',
                    'POC.productionId',
                )
                .from('productionOtherCosts POC')
                .leftJoin('otherCosts AS OC', 'OC.uuid', 'POC.otherCostId')
                .where('POC.uuid', uuid)
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get production other cost");
        }
    }

    async getByRelations({ otherCostId, productionId }) {
        try {
            return this.database
                .select(
                    'POC.uuid,',
                    'POC.otherCostId',
                    'OC.name AS otherCost',
                    '(CAST(OC.price AS FLOAT) / CAST(OC.quantity AS FLOAT)) * CAST(POC.quantity AS FLOAT) AS price',
                    'POC.quantity',
                    'POC.productionId',
                )
                .from('productionOtherCosts POC')
                .leftJoin('otherCosts AS OC', 'OC.uuid', 'POC.otherCostId')
                .where('POC.otherCostId', otherCostId)
                .where('POC.productionId', productionId)
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get production other cost")
        }
    }

    async create({ otherCostId, productionId, quantity }) {
        try {
            await this.database('productionOtherCosts')
                .insert({
                    otherCostId,
                    productionId,
                    quantity
                });

            return this.getByRelations({ otherCostId, productionId });
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to create production other cost")
        }
    }

    async update(uuid, { quantity }) {
        try {
            await database('productionOtherCosts')
                .where('uuid', uuid)
                .update({ quantity })

            return await this.getOne(uuid);
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to update production other cost")
        }
    }

    async delete(uuid) {
        try {
            const deleted = await this.getOne(uuid);

            await database('productionOtherCosts')
                .where('uuid', uuid)
                .delete();

            return deleted;
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to delete production other cost")
        }
    }
}

module.exports = ProductionOtherCostsRepository;