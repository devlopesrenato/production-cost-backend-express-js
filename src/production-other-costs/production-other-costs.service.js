const ProductionOtherCostsRepository = require('./production-other-costs.repository');
const ProductionsRepository = require('../productions/productions.repository');
const OtherCostsRepository = require('../other-costs/other-costs.repository');
const ConflictError = require('../common/errors/types/ConflictError');
const NotFoundError = require('../common/errors/types/NotFoundError');

class ProductionOtherCostsService {
    constructor() {
        this.productionOtherCostRepository = new ProductionOtherCostsRepository();
        this.productionRepository = new ProductionsRepository();
        this.otherCostsRepository = new OtherCostsRepository();
    }

    async getAll() {
        return this.productionOtherCostRepository.getAll();
    }

    async getOne(uuid) {
        const productionOtherCost = await this.productionOtherCostRepository.getOne(uuid);
        if (!productionOtherCost) {
            throw new NotFoundError("Production-OtherCost not found")
        }
        return productionOtherCost;
    }

    async create(createProductionOtherCostDto) {
        const already = await this.productionOtherCostRepository.getByRelations(createProductionOtherCostDto);
        if (already) {
            throw new ConflictError("A Production-OtherCost already exists")
        }
        const production = await this.productionRepository.getOne(createProductionOtherCostDto.productionId);
        if (!production) {
            throw new NotFoundError("Production not found")
        }
        const otherCost = await this.otherCostsRepository.getOne(createProductionOtherCostDto.otherCostId);
        if (!otherCost) {
            throw new NotFoundError("OtherCost not found")
        }
        return this.productionOtherCostRepository.create(createProductionOtherCostDto);
    }

    async update(uuid, updateProductionOtherCostDto) {
        const productionOtherCost = await this.productionOtherCostRepository.getOne(uuid);
        if (!productionOtherCost) {
            throw new NotFoundError("Production otherCost not found")
        }
        return this.productionOtherCostRepository.update(uuid, updateProductionOtherCostDto);
    }

    async delete(uuid) {
        const productionOtherCost = await this.productionOtherCostRepository.getOne(uuid);
        if (!productionOtherCost) {
            throw new NotFoundError("Production otherCost not found")
        }
        return this.productionOtherCostRepository.delete(uuid);
    }
}

module.exports = ProductionOtherCostsService;