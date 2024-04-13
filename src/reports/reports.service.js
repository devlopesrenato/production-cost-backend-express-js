const ProductionsRepository = require('../productions/productions.repository');
const ProductionFeedstocksRepository = require("../production-feedstocks/production-feedstocks.repository");
const ProductionOtherCostsRepository = require("../production-other-costs/production-other-costs.repository");
const OtherCostsRepository = require('../other-costs/other-costs.repository');
const ParametersRepository = require('../parameters/parameters.repository');
const InternalServerError = require('../common/errors/types/InternalServerError');
const ProductionsService = require('../productions/productions.service');

class ReportsService {
    constructor() {
        this.productionsRepository = new ProductionsRepository();
        this.productionsService = new ProductionsService();
        this.productionFeedstocksRepository = new ProductionFeedstocksRepository()
        this.productionOtherCostsRepository = new ProductionOtherCostsRepository()
        this.costsRepository = new OtherCostsRepository();
        this.parametersRepository = new ParametersRepository();
    }

    async getCostPerProduction() {
        try {
            const productions = await this.productionsRepository.getAll();
            const productionFeedstocks = await this.productionFeedstocksRepository.getAll();
            const productionOtherCosts = await this.productionOtherCostsRepository.getAll();
            const costsDistributed = await this.costsRepository.getBy({ active: true, type: 'distributed' });
            const parameterMargin = await this.parametersRepository.getById(1);
            const margin = parameterMargin.value;

            const productionsResponse = []
            productions.forEach(async production => {
                const {                   
                    cost,
                    profit,
                    margin: percent,
                    marketProfit,
                    marketMargin: marketPercent
                } = this.productionsService.getProductionInfo({
                    production,
                    costsDistributed,
                    productionOtherCosts,
                    productionFeedstocks
                })

                productionsResponse.push({
                    uuid: production.uuid,
                    name: production.name,
                    cost,
                    price: production.price,
                    profit,
                    percent,
                    marketPrice: production.marketPrice,
                    marketProfit,
                    marketPercent,
                    suggestedPrice: cost * ((margin / 100) + 1),
                })
            });

            return productionsResponse;
        } catch (error) {
            console.log(error);
            throw new InternalServerError("Failed to update production");
        }
    }

}

module.exports = ReportsService;