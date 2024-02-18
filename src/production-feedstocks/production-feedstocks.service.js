const ProductionFeedstocksRepository = require('./production-feedstocks.repository');
const ProductionsRepository = require('../productions/productions.repository');
const FeedstocksRepository = require('../feedstocks/feedstocks.repository');
const ConflictError = require('../common/errors/types/ConflictError');
const NotFoundError = require('../common/errors/types/NotFoundError');

class ProductionFeedstocksService {
    constructor() {
        this.productionFeedstockRepository = new ProductionFeedstocksRepository();
        this.productionRepository = new ProductionsRepository();
        this.feedstockRepository = new FeedstocksRepository();
    }

    async getAll() {
        return this.productionFeedstockRepository.getAll();
    }

    async getOne(uuid) {
        const productionFeedstock = await this.productionFeedstockRepository.getOne(uuid);
        if (!productionFeedstock) {
            throw new NotFoundError("Production feedstock not found")
        }
        return productionFeedstock;
    }

    async create(updateProductionFeedstockDto) {
        const already = await this.productionFeedstockRepository.getByRelations(updateProductionFeedstockDto);
        if (already) {
            throw new ConflictError("A Production-Feedstock already exists")
        }
        const production = await this.productionRepository.getOne(updateProductionFeedstockDto.productionId);
        if (!production) {
            throw new NotFoundError("Production not found")
        }
        const feedstock = await this.feedstockRepository.getOne(updateProductionFeedstockDto.feedstockId);
        if (!feedstock) {
            throw new NotFoundError("Feedstock not found")
        }
        return this.productionFeedstockRepository.create(updateProductionFeedstockDto);
    }

    async update(uuid, updateProductionFeedstockDto) {
        const productionFeedstock = await this.productionFeedstockRepository.getOne(uuid);
        if (!productionFeedstock) {
            throw new NotFoundError("Production feedstock not found")
        }
        return this.productionFeedstockRepository.update(uuid, updateProductionFeedstockDto);
    }

    async delete(uuid) {
        const productionFeedstock = await this.productionFeedstockRepository.getOne(uuid);
        if (!productionFeedstock) {
            throw new NotFoundError("Production feedstock not found")
        }
        return this.productionFeedstockRepository.delete(uuid);
    }
}

module.exports = ProductionFeedstocksService;