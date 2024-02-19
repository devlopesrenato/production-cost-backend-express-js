const OtherCostsRepository = require('./other-costs.repository.js');
const ConflictError = require('../common/errors/types/ConflictError.js');
const NotFoundError = require('../common/errors/types/NotFoundError.js');
const BadRequestError = require('../common/errors/types/BadRequestError.js');

class OtherCostsService {
    constructor() {
        this.otherCostsRepository = new OtherCostsRepository();
    }

    async getAll() {
        return this.otherCostsRepository.getAll();
    }

    async getOne(uuid) {
        const otherCosts = await this.otherCostsRepository.getOne(uuid);
        if (!otherCosts) {
            throw new NotFoundError("OtherCost not found")
        }
        return otherCosts;
    }

    async create(createOtherCostDto) {
        const { name, quantity, price, type } = createOtherCostDto;
        const alreadyExists = await this.otherCostsRepository.getByName(name);
        if (alreadyExists) {
            throw new ConflictError("There is already a otherCosts with this name")
        }

        if (quantity < 0) {
            throw new BadRequestError("Quantity cannot be less than 1")
        }
        if (price < 0) {
            throw new BadRequestError("Price cannot be less than 1")
        }
        if (!['manual', 'distributed'].includes(type)) {
            throw new BadRequestError("The type parameter must be 'manual' or 'distributed'")
        }
        return this.otherCostsRepository.create(createOtherCostDto);
    }

    async update(uuid, updateOtherCostDto) {
        const otherCosts = await this.otherCostsRepository.getOne(uuid);
        if (!otherCosts) {
            throw new NotFoundError("OtherCost not found")
        }

        const { name, quantity, price, customMeasurementId } = updateOtherCostDto;

        const alreadyExists = await this.otherCostsRepository.getByName(name);
        if (alreadyExists && alreadyExists.uuid !== uuid) {
            throw new ConflictError("There is already a otherCosts with this name")
        }

        if (quantity && quantity < 0) {
            throw new BadRequestError("Quantity cannot be less than 1")
        }

        if (price && price < 0) {
            throw new BadRequestError("Price cannot be less than 1")
        }

        return this.otherCostsRepository.update(uuid, updateOtherCostDto);
    }

    async delete(uuid) {
        const otherCosts = await this.otherCostsRepository.getOne(uuid);
        if (!otherCosts) {
            throw new NotFoundError("OtherCost not found")
        }
        return this.otherCostsRepository.delete(uuid);
    }
}

module.exports = OtherCostsService;