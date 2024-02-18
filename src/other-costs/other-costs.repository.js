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
                    'OC.modifyDate'
                )
                .leftJoin('users AS UC', 'UC.uuid', 'OC.createById')
                .leftJoin('users AS UU', 'UC.uuid', 'OC.modifyById')
                .orderBy('OC.name');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get costs")
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
                    'OC.modifyDate'
                )
                .leftJoin('users AS UC', 'UC.uuid', 'OC.createById')
                .leftJoin('users AS UU', 'UC.uuid', 'OC.modifyById')
                .where(getWhere)
                .orderBy('OC.name');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get cost")
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
                    'OC.modifyDate'
                )
                .leftJoin('users AS UC', 'UC.uuid', 'OC.createById')
                .leftJoin('users AS UU', 'UC.uuid', 'OC.modifyById')
                .where('OC.uuid', uuid)
                .orderBy('OC.name');
        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to get cost")
        }
    }

}

module.exports = OtherCostsRepository;