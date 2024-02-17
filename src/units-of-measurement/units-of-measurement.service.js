
const UnitsOfMeasurementRepository = require('./units-of-measurement.repository');

class UnitsOfMeasurementService {
    constructor() {
        this.unitsOfMeasurementRepository = new UnitsOfMeasurementRepository();
    }

    async getAll() {
        return this.unitsOfMeasurementRepository.getAll();
    }
}

module.exports = UnitsOfMeasurementService;