const ProductionFeedstocksRepository = require('./production-feedstocks.repository');
const ProductionsRepository = require('../productions/productions.repository');
const FeedstocksRepository = require('../feedstocks/feedstocks.repository');
const ConflictError = require('../common/errors/types/ConflictError');
const NotFoundError = require('../common/errors/types/NotFoundError');
const BadRequestError = require('../common/errors/types/BadRequestError');

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

    async create(createProductionFeedstockDto) {
        const already = await this.productionFeedstockRepository.getByRelations(createProductionFeedstockDto);
        if (already) {
            throw new ConflictError("A Production-Feedstock already exists")
        }
        const production = await this.productionRepository.getOne(createProductionFeedstockDto.productionId);
        if (!production) {
            throw new NotFoundError("Production not found")
        }
        const feedstock = await this.feedstockRepository.getOne(createProductionFeedstockDto.feedstockId);
        if (!feedstock) {
            throw new NotFoundError("Feedstock not found")
        }

        if (createProductionFeedstockDto.quantity < 0) {
            throw new BadRequestError("Quantity cannot be less than 0")
        }

        return this.productionFeedstockRepository.create(createProductionFeedstockDto);
    }

    async update(uuid, updateProductionFeedstockDto) {
        const productionFeedstock = await this.productionFeedstockRepository.getOne(uuid);
        if (!productionFeedstock) {
            throw new NotFoundError("Production feedstock not found")
        }
        if (updateProductionFeedstockDto.quantity && updateProductionFeedstockDto.quantity < 0) {
            throw new BadRequestError("Quantity cannot be less than 0")
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