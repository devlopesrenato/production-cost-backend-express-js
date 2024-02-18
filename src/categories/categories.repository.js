const InternalServerError = require('../common/errors/types/InternalServerError');
const database = require('../database');

class CategoriesRepository {
    constructor() {
        this.database = database;
    }

    async getAll() {
        try {
            return this.database
                .select(
                    'C.uuid',
                    'C.name',
                    'C.createById',
                    { createBy: 'U.name' },
                    'C.createDate',
                    'C.modifyById',
                    { modifyBy: 'R.name' },
                    'C.modifyDate'
                )
                .from('categories C')
                .leftJoin('users AS UC', 'UC.uuid', 'C.createById')
                .leftJoin('users AS UU', 'UU.uuid', 'C.modifyById')
                .orderBy('C.name');

        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get categories")
        }
    }

    async getOne(uuid) {
        try {
            return this.database('categories as C')
                .select(
                    'C.uuid',
                    'C.name',
                    'C.createById',
                    { createBy: 'UC.name' },
                    'C.createDate',
                    'C.modifyById',
                    { modifyBy: 'UU.name' },
                    'C.modifyDate'
                )
                .count('P.name as used')
                .leftJoin('users as UC', 'C.createById', 'UC.uuid')
                .leftJoin('users as UU', 'C.modifyById', 'UU.uuid')
                .leftJoin('productions as P', 'C.uuid', 'P.categoryId')
                .where('C.uuid', uuid)
                .groupBy('C.uuid', 'C.name', 'UC.name', 'C.createDate', 'UU.name', 'C.modifyDate')
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get category")
        }
    }

    async getByName(name) {
        try {
            return this.database('categories as C')
                .select(
                    'C.uuid',
                    'C.name',
                    'C.createById',
                    { createBy: 'UC.name' },
                    'C.createDate',
                    'C.modifyById',
                    { modifyBy: 'UU.name' },
                    'C.modifyDate'
                )
                .count('P.name as used')
                .leftJoin('users as UC', 'C.createById', 'UC.uuid')
                .leftJoin('users as UU', 'C.modifyById', 'UU.uuid')
                .leftJoin('productions as P', 'C.uuid', 'P.categoryId')
                .where('C.name', name)
                .groupBy('C.uuid', 'C.name', 'UC.name', 'C.createDate', 'UU.name', 'C.modifyDate')
                .first();
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get category")
        }
    }

    async create({ name, userId }) {
        try {
            const insertedIds = await this.database('categories')
                .insert({
                    name,
                    createById: userId,
                    createDate: database.fn.now(),
                    modifyById: userId,
                    modifyDate: database.fn.now()
                })

            return this.getOne(insertedIds[0]);
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to create category")
        }
    }

    async update(uuid, { name, userId }) {
        try {
            await database('categories')
                .where('uuid', uuid)
                .update({
                    name,
                    modifyDate: database.fn.now(),
                    modifyById: userId
                })

            return this.getOne(uuid);
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to update category")
        }
    }

    async delete(uuid) {
        try {
            const deleted = await this.getOne(uuid);

            await database('categories')
            .where('uuid', uuid)
            .delete();

            return deleted;
        } catch (err) {
            console.log(err)
            throw new InternalServerError("Failed to delete category")
        }
    }

}

module.exports = CategoriesRepository;