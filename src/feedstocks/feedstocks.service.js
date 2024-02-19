const CustomMeasurementsRepository = require('../custom-measurements/custom-measurements.repository.js');
const FeedstocksRepository = require('../feedstocks/feedstocks.repository');
const ConflictError = require('../common/errors/types/ConflictError');
const NotFoundError = require('../common/errors/types/NotFoundError');
const BadRequestError = require('../common/errors/types/BadRequestError');

class FeedstocksService {
    constructor() {
        this.feedstockRepository = new FeedstocksRepository();
        this.customMeasurementsRepository = new CustomMeasurementsRepository();
    }

    async getAll() {
        return this.feedstockRepository.getAll();
    }

    async getOne(uuid) {
        const feedstock = await this.feedstockRepository.getOne(uuid);
        if (!feedstock) {
            throw new NotFoundError("Feedstock not found")
        }
        return feedstock;
    }

    async create(createFeedstockDto) {
        const { name, quantity, price, customMeasurementId } = createFeedstockDto;
        const alreadyExists = await this.feedstockRepository.getByName(name);
        if (alreadyExists) {
            throw new ConflictError("There is already a feedstock with this name")
        }
        const customMeasurement = await this.customMeasurementsRepository.getOne(customMeasurementId);
        if (!customMeasurement) {
            throw new NotFoundError("Custom measurement not found")
        }

        if (quantity < 0) {
            throw new BadRequestError("Quantity cannot be less than 1")
        }
        if (price < 0) {
            throw new BadRequestError("Price cannot be less than 1")
        }
        return this.feedstockRepository.create(createFeedstockDto);
    }

    async update(uuid, updateFeedstockDto) {
        const feedstock = await this.feedstockRepository.getOne(uuid);
        if (!feedstock) {
            throw new NotFoundError("Feedstock not found")
        }

        const { name, quantity, price, customMeasurementId } = updateFeedstockDto;

        const alreadyExists = await this.feedstockRepository.getByName(name);
        if (alreadyExists && alreadyExists.uuid !== uuid) {
            throw new ConflictError("There is already a feedstock with this name")
        }

        if (quantity && quantity < 0) {
            throw new BadRequestError("Quantity cannot be less than 1")
        }

        if (price && price < 0) {
            throw new BadRequestError("Price cannot be less than 1")
        }

        if (customMeasurementId) {
            const customMeasurement = await this.customMeasurementsRepository.getOne(customMeasurementId);
            if (!customMeasurement) {
                throw new NotFoundError("Custom measurement not found")
            }
        }

        return this.feedstockRepository.update(uuid, updateFeedstockDto);
    }

    async delete(uuid) {
        const feedstock = await this.feedstockRepository.getOne(uuid);
        if (!feedstock) {
            throw new NotFoundError("Feedstock not found")
        }
        return this.feedstockRepository.delete(uuid);
    }
}

module.exports = FeedstocksService;