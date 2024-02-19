const ProductionsService = require('../productions/productions.service');
const ParametersRepository = require('../parameters/parameters.repository');
const InternalServerError = require('../common/errors/types/InternalServerError');

class DashboardService {
    constructor() {
        this.productionsService = new ProductionsService();
        this.parametersRepository = new ParametersRepository();
    }

    async getDashboard() {
        try {
            const productions = await this.productionsService.getAll();
            const parameterMargin = await this.parametersRepository.getById(1);
            const margin = Number(parameterMargin.value);

            const _prodPerCost = [...productions];
            const productionsPerCost = _prodPerCost
                .filter(({ cost }) => cost > 0)
                .sort((a, b) => b.value - a.value)
                .slice(0, 8)
                .map(({ uuid, name, price: value }) => ({ uuid, name, value }));

            const _prodBellowMargin = [...productions];
            const productionsBelowMargin = _prodBellowMargin
                .filter(({ percent }) => percent < margin)
                .sort((a, b) => b.value - a.value)
                .slice(0, 8)
                .map(({ uuid, name, percent: value }) => ({ uuid, name, value }));

            return [
                {
                    name: "Higher costs:",
                    data: productionsPerCost,
                    typeValue: "R$"
                },
                {
                    name: `Productions with a margin below ${margin}%:`,
                    data: productionsBelowMargin,
                    typeValue: "%"
                },
            ];

        } catch (error) {
            console.log(error);
            throw new InternalServerError(error.message);
        }
    }

}

module.exports = DashboardService;