const InternalServerError = require('../common/errors/types/InternalServerError');
const database = require('../database');

class OtherCostsRepository {
    constructor() {
        this.database = database;
    }

    async getAll() {
        try {
            return this.database('otherCosts AS OC')
                .select(
                    'OC.uuid',
                    'OC.name',
                    'OC.quantity',
                    'OC.price',
                    'OC.active',
                    'OC.type',
                    'UC.name as createBy',
                    'OC.createDate',
                    'UU.name as modifyBy',
                    'OC.modifyDate',
                )
                .leftJoin('users AS UC', 'UC.uuid', 'OC.createById')
                .leftJoin('users AS UU', 'UC.uuid', 'OC.modifyById')
                .orderBy('OC.name');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get otherCost")
        }
    }

    async getBy({ name, active, type }) {
        try {
            const getWhere = {};
            if (name) getWhere['OC.name'] = name;
            if (type) getWhere['OC.type'] = type;
            if (active) getWhere['OC.active'] = active;

            return this.database('otherCosts AS OC')
                .select(
                    'OC.uuid',
                    'OC.name',
                    'OC.quantity',
                    'OC.price',
                    'OC.active',
                    'OC.type',
                    'UC.name as createBy',
                    'OC.createDate',
                    'UU.name as modifyBy',
                    'OC.modifyDate',
                    this.database.raw('COUNT("POC"."otherCostId") AS used')
                )
                .leftJoin('productionOtherCosts as POC', 'POC.otherCostId', 'OC.uuid')
                .leftJoin('users AS UC', 'UC.uuid', 'OC.createById')
                .leftJoin('users AS UU', 'UC.uuid', 'OC.modifyById')
                .where(getWhere)
                .groupBy(
                    'OC.uuid',
                    'OC.name',
                    'OC.quantity',
                    'OC.price',
                    'OC.active',
                    'OC.type',
                    'UC.name',
                    'OC.createDate',
                    'UU.name',
                    'OC.modifyDate',
                )
                .orderBy('OC.name');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get otherCost")
        }
    }

    async getOne(uuid) {
        try {
            return this.database('otherCosts AS OC')
                .select(
                    'OC.uuid',
                    'OC.name',
                    'OC.quantity',
                    'OC.price',
                    'OC.active',
                    'OC.type',
                    'UC.name as createBy',
                    'OC.createDate',
                    'UU.name as modifyBy',
                    'OC.modifyDate',
                    this.database.raw('COUNT("POC"."otherCostId") AS used')
                )
                .leftJoin('productionOtherCosts as POC', 'POC.otherCostId', 'OC.uuid')
                .leftJoin('users AS UC', 'UC.uuid', 'OC.createById')
                .leftJoin('users AS UU', 'UC.uuid', 'OC.modifyById')
                .where('OC.uuid', uuid)
                .groupBy(
                    'OC.uuid',
                    'OC.name',
                    'OC.quantity',
                    'OC.price',
                    'OC.active',
                    'OC.type',
                    'UC.name',
                    'OC.createDate',
                    'UU.name',
                    'OC.modifyDate',
                )
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get otherCost")
        }
    }

    async getByName(name) {
        try {
            return this.database('otherCosts AS OC')
                .select(
                    'OC.uuid',
                    'OC.name',
                    'OC.quantity',
                    'OC.price',
                    'OC.active',
                    'OC.type',
                    'UC.name as createBy',
                    'OC.createDate',
                    'UU.name as modifyBy',
                    'OC.modifyDate',
                    this.database.raw('COUNT("POC"."otherCostId") AS used')
                )
                .leftJoin('productionOtherCosts as POC', 'POC.otherCostId', 'OC.uuid')
                .leftJoin('users AS UC', 'UC.uuid', 'OC.createById')
                .leftJoin('users AS UU', 'UC.uuid', 'OC.modifyById')
                .where('OC.name', name)
                .groupBy(
                    'OC.uuid',
                    'OC.name',
                    'OC.quantity',
                    'OC.price',
                    'OC.active',
                    'OC.type',
                    'UC.name',
                    'OC.createDate',
                    'UU.name',
                    'OC.modifyDate',
                )
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get otherCost")
        }
    }

    async create({ name, quantity, price, type, userId }) {
        try {
            await this.database('otherCosts').insert({
                name,                
                quantity,
                price,
                active: true,
                type,
                createById: userId,
                createDate: database.fn.now(),
                modifyById: userId,
                modifyDate: database.fn.now()
            });
            const created = await this.getByName(name);
            return created;
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to create otherCost")
        }
    }

    async update(uuid, { name, quantity, price, active, type, userId }) {
        try {
            await this.database('otherCosts')
                .where('uuid', uuid)
                .update({
                    modifyDate: this.database.fn.now(),
                    modifyById: userId,
                    ...(name && { name }),
                    ...(quantity && { quantity: quantity }),
                    ...(price && { price: price }),
                    ...(active && { active }),
                    ...(type && { type }),
                });
            const updated = await this.getOne(uuid);
            return updated;
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to update otherCost")
        }
    }

    async delete(uuid) {
        try {
            const deleted = await this.getOne(uuid);

            await database('otherCosts')
                .where('uuid', uuid)
                .delete();

            return deleted;
        } catch (err) {
            console.log(err)
            throw new InternalServerError("Failed to delete otherCost")
        }
    }
}

module.exports = OtherCostsRepository;