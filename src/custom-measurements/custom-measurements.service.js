const CustomMeasurementsRepository = require('./custom-measurements.repository.js');
const UnitsOfMeasurementRepository = require('../units-of-measurement/units-of-measurement.repository.js');
const ConflictError = require('../common/errors/types/ConflictError.js');
const NotFoundError = require('../common/errors/types/NotFoundError.js');
const BadRequestError = require('../common/errors/types/BadRequestError.js');

class CustomMeasurementsService {
    constructor() {
        this.customMeasurementsRepository = new CustomMeasurementsRepository();
        this.unitsOfMeasurementRepository = new UnitsOfMeasurementRepository();
    }

    async getAll() {
        return this.customMeasurementsRepository.getAll();
    }

    async getOne(uuid) {
        const customMeasurements = await this.customMeasurementsRepository.getOne(uuid);
        if (!customMeasurements) {
            throw new NotFoundError("Custom measurement not found")
        }
        return customMeasurements;
    }

    async create(createCustomMeasurementDto) {
        const { name, quantity, unitsOfMeasurementId } = createCustomMeasurementDto;
        const alreadyExists = await this.customMeasurementsRepository.getByName(name);
        if (alreadyExists) {
            throw new ConflictError("There is already a custom measurement with this name")
        }
        const unitsOfMeasurement = await this.unitsOfMeasurementRepository.getOne(unitsOfMeasurementId);
        if (!unitsOfMeasurement) {
            throw new NotFoundError("Unit of measurement not found")
        }

        if (quantity < 0) {
            throw new BadRequestError("Quantity cannot be less than 1")
        }

        return this.customMeasurementsRepository.create(createCustomMeasurementDto);
    }

    async update(uuid, updateCustomMeasurementDto) {
        const customMeasurements = await this.customMeasurementsRepository.getOne(uuid);
        if (!customMeasurements) {
            throw new NotFoundError("Custom measurement not found")
        }

        const { name, unitsOfMeasurementId, quantity, } = updateCustomMeasurementDto;

        if (name) {
            const alreadyExists = await this.customMeasurementsRepository.getByName(name);
            if (alreadyExists && alreadyExists.uuid !== uuid) {
                throw new ConflictError("There is already a custom measurement with this name")
            }
        }

        if (unitsOfMeasurementId) {
            const unitsOfMeasurement = await this.unitsOfMeasurementRepository.getOne(unitsOfMeasurementId);
            if (!unitsOfMeasurement) {
                throw new NotFoundError("Unit of measurement not found")
            }
        }

        if (quantity && quantity < 0) {
            throw new BadRequestError("Quantity cannot be less than 0")
        }

        return this.customMeasurementsRepository.update(uuid, updateCustomMeasurementDto);
    }

    async delete(uuid) {
        const customMeasurements = await this.customMeasurementsRepository.getOne(uuid);
        if (!customMeasurements) {
            throw new NotFoundError("Custom measurement not found")
        }
        return this.customMeasurementsRepository.delete(uuid);
    }
}

module.exports = CustomMeasurementsService;