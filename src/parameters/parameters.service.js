const ParametersRepository = require('./parameters.repository');
const ConflictError = require('../common/errors/types/ConflictError');
const NotFoundError = require('../common/errors/types/NotFoundError');

class ParametersService {
    constructor() {
        this.parametersRepository = new ParametersRepository();
    }

    async getAll() {
        return this.parametersRepository.getAll();
    }

    async getOne(uuid) {
        const parameterMargin = await this.parametersRepository.getOne(uuid);
        if (!parameterMargin) {
            throw new NotFoundError("Parameter not found");
        }
        return parameterMargin
    }

    async getById(id) {
        const parameterMargin = await this.parametersRepository.getById(id);
        if (!parameterMargin) {
            throw new NotFoundError("Parameter not found");
        }
        return parameterMargin;
    }

    async update(uuid, updateParameterDto) {
        const param = await this.parametersRepository.getOne(uuid);
        if (!param) {
            throw new NotFoundError("Parameter not found");
        }
        return this.parametersRepository.update(uuid, updateParameterDto)
    }

}

module.exports = ParametersService;