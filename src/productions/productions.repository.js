const InternalServerError = require('../common/errors/types/InternalServerError');
const database = require('../database');

class ProductionsRepository {
    constructor() {
        this.database = database;
    }

    async getAll() {
        try {
            return this.database('productions as P')
                .select(
                    'P.uuid',
                    'P.name',
                    'P.price',
                    'P.quantity',
                    'P.categoryId',
                    { category: 'C.name' },
                    'P.createById',
                    { createBy: 'UC.name' },
                    'P.createDate',
                    'P.modifyById',
                    { modifyBy: 'UU.name' },
                    'P.modifyDate'
                )
                .leftJoin('users as UC', 'UC.uuid', 'P.createById')
                .leftJoin('users as UU', 'UU.uuid', 'P.modifyById')
                .leftJoin('categories as C', 'C.uuid', 'P.categoryId')
                .orderBy('P.name', 'asc');
        } catch (error) {
            console.log(error);
            throw new InternalServerError("Failed to get productions");
        }
    }

    async getOne(uuid) {
        try {
            return this.database('productions as P')
                .select(
                    'P.uuid',
                    'P.name',
                    'P.price',
                    'P.quantity',
                    'P.categoryId',
                    { category: 'C.name' },
                    'P.createById',
                    { createBy: 'UC.name' },
                    'P.createDate',
                    'P.modifyById',
                    { modifyBy: 'UU.name' },
                    'P.modifyDate'
                )
                .leftJoin('users as UC', 'UC.uuid', 'P.createById')
                .leftJoin('users as UU', 'UU.uuid', 'P.modifyById')
                .leftJoin('categories as C', 'C.uuid', 'P.categoryId')
                .where('P.uuid', uuid)
                .first();
        } catch (error) {
            console.log(error);
            throw new InternalServerError("Failed to get production");
        }
    }

    async getByName(name) {
        try {
            return this.database('productions as P')
                .select(
                    'P.uuid',
                    'P.name',
                    'P.price',
                    'P.quantity',
                    'P.categoryId',
                    { category: 'C.name' },
                    'P.createById',
                    { createBy: 'UC.name' },
                    'P.createDate',
                    'P.modifyById',
                    { modifyBy: 'UU.name' },
                    'P.modifyDate'
                )
                .leftJoin('users as UC', 'UC.uuid', 'P.createById')
                .leftJoin('users as UU', 'UU.uuid', 'P.modifyById')
                .leftJoin('categories as C', 'C.uuid', 'P.categoryId')
                .where('P.name', name)
                .first();
        } catch (error) {
            console.log(error);
            throw new InternalServerError("Failed to get production");
        }
    }

    async create({ name, price, quantity, categoryId, userId }) {
        try {
            await this.database('productions')
                .insert({
                    name,
                    price,
                    quantity,
                    categoryId,
                    createById: userId,
                    createDate: database.fn.now(),
                    modifyById: userId,
                    modifyDate: database.fn.now()
                })
            return this.getByName(name);
        } catch (error) {
            console.log(error);
            throw new InternalServerError("Failed to create production");
        }
    }

    async update(uuid, { name, price, quantity, categoryId, userId }) {
        try {
            await database('productions')
                .where('uuid', uuid)
                .update({
                    name,
                    price,
                    quantity,
                    categoryId,
                    modifyDate: database.fn.now(),
                    modifyById: userId
                })

            return this.getOne(uuid);
        } catch (error) {
            console.log(error);
            throw new InternalServerError("Failed to update production");
        }
    }

    async delete(uuid) {
        try {
            const deleted = await this.getOne(uuid);

            await database('productions')
                .where('uuid', uuid)
                .delete();

            await database('productionFeedstocks')
                .where('productionId', uuid)
                .delete();

            await database('productionOtherCosts')
                .where('productionId', uuid)
                .delete();

            return deleted
        } catch (error) {
            console.log(error);
            throw new InternalServerError("Failed to delete production");
        }
    }

}

module.exports = ProductionsRepository;