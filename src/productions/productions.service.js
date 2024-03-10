const ProductionsRepository = require("./productions.repository");
const CategoriesRepository = require("../categories/categories.repository");
const ProductionFeedstocksRepository = require("../production-feedstocks/production-feedstocks.repository");
const ProductionOtherCostsRepository = require("../production-other-costs/production-other-costs.repository");
const OtherCostsRepository = require('../other-costs/other-costs.repository');
const NotFoundError = require("../common/errors/types/NotFoundError");
const ConflictError = require("../common/errors/types/ConflictError");
const InternalServerError = require("../common/errors/types/InternalServerError");

class ProductionsService {
    constructor() {
        this.productionsRepository = new ProductionsRepository();
        this.categoryRepository = new CategoriesRepository()
        this.productionFeedstocksRepository = new ProductionFeedstocksRepository()
        this.productionOtherCostsRepository = new ProductionOtherCostsRepository()
        this.costsRepository = new OtherCostsRepository();
    }

    async getAll() {
        const productions = await this.productionsRepository.getAll();
        const productionFeedstocks = await this.productionFeedstocksRepository.getAll();
        const productionOtherCosts = await this.productionOtherCostsRepository.getAll();
        const costsDistributed = await this.costsRepository.getBy({ active: true, type: 'distributed' });

        const productionsResponse = []
        productions.forEach(async production => {
            const { prodFeedstocks, prodOtherCosts, cost, profit, margin: percent }
                = this.getProductionInfo({
                    production,
                    costsDistributed,
                    productionOtherCosts,
                    productionFeedstocks
                })

            productionsResponse.push({
                ...production,
                cost,
                profit,
                percent,
                feedstockUsed: prodFeedstocks || [],
                wpoUsed: prodOtherCosts || [],
            })
        });
        return productionsResponse;
    }

    async create(createProductionDto) {
        const already = await this.productionsRepository.getByName(createProductionDto.name);
        if (already) {
            throw new ConflictError("A production with this name already exists");
        }
        const category = await this.categoryRepository.getOne(createProductionDto.categoryId);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        const created = await this.productionsRepository.create(createProductionDto)
        if (created.error) {
            throw new NotFoundError("Error creating production");
        }
        if (createProductionDto.quantity < 1) {
            throw new BadRequestError("Quantity cannot be less than 1")
        }

        return created;
    }

    async update(uuid, updateProductionDto) {
        const production = await this.productionsRepository.getOne(uuid);
        if (!production) {
            throw new NotFoundError("Production not found");
        }
        if (updateProductionDto.name) {
            const already = await this.productionsRepository.getByName(updateProductionDto.name);
            if (already && already.uuid !== uuid) {
                throw new ConflictError("A production with this name already exists");
            }
        }
        if (updateProductionDto.categoryId) {
            const category = await this.categoryRepository.getOne(updateProductionDto.categoryId);
            if (!category) {
                throw new NotFoundError("Category not found");
            }
        }
        if (updateProductionDto.quantity && updateProductionDto.quantity < 1) {
            throw new BadRequestError("Quantity cannot be less than 1")
        }

        return this.productionsRepository.update(uuid, updateProductionDto)
    }

    async duplicate(uuid, { userId, name: submittedName }) {
        const production = await this.productionsRepository.getOne(uuid);
        if (!production) {
            throw new NotFoundError("Production not found");
        }
        const { name, categoryId, price, quantity } = production;
        const newName = submittedName || await this.generateDuplicateDescription(name);
        const duplicatedProduction = await this.create({
            name: newName,
            categoryId,
            price,
            quantity,
            userId
        })
        const productionFeedstocks = await this.productionFeedstocksRepository.getByProduction({ productionId: uuid });
        if (productionFeedstocks.length) {
            const newProductionFeedstocks = productionFeedstocks.map(({
                feedstockId,
                quantity
            }) => ({
                feedstockId,
                productionId: duplicatedProduction.uuid,
                quantity,
            }));
            await this.productionFeedstocksRepository.createMany(newProductionFeedstocks);
        }

        const productionOtherCosts = await this.productionOtherCostsRepository.getByProduction({ productionId: uuid });
        if (productionOtherCosts.length) {
            const newProductionOtherCosts = productionOtherCosts.map(({
                otherCostId,
                quantity
            }) => ({
                otherCostId,
                productionId: duplicatedProduction.uuid,
                quantity,
            }));
            await this.productionOtherCostsRepository.createMany(newProductionOtherCosts);
        }

        return duplicatedProduction;

    }

    async delete(uuid) {
        const production = await this.productionsRepository.getOne(uuid);
        if (!production) {
            throw new NotFoundError("Production not found");
        }
        return this.productionsRepository.delete(uuid);
    }

    getProductionInfo({
        production,
        productionFeedstocks = [],
        productionOtherCosts = [],
        costsDistributed = []
    }) {
        try {
            const { uuid, quantity, price } = production;
            const prodFeedstocks = productionFeedstocks
                .filter(({ productionId: id }) =>
                    id === uuid
                );
            const costs = productionOtherCosts
                .filter(({ productionId: id }) =>
                    id === uuid
                );
            const prodOtherCosts = [
                ...costs,
                ...costsDistributed.map((item) => ({
                    ...item,
                    quantity,
                    price: item.price * quantity
                }))
            ];

            let totalCost = 0;
            totalCost += prodFeedstocks.reduce((acc, feeds) => acc + parseFloat(feeds.price), 0);
            totalCost += prodOtherCosts.reduce((acc, cost) => acc + parseFloat(cost.price), 0);

            const finalCost = totalCost / quantity

            const profit = parseFloat(price) - finalCost;
            const marginProd = finalCost > 0 ? (profit / finalCost) * 100 : 100;

            return {
                prodFeedstocks,
                prodOtherCosts,
                cost: finalCost,
                profit,
                margin: marginProd,
            }

        } catch (error) {
            console.log(error);
            throw new InternalServerError("Error get production info: " + error.message)
        }
    }

    async generateDuplicateDescription(description) {
        try {
            let duplicateCount = 0
            let newItemDescription = description
            const allProductions = await this.getAll()
            const isDescriptionDuplicate = (description) => {
                return allProductions.some(({ name: existingDescription }) => {
                    return existingDescription === description
                })
            }
            while (isDescriptionDuplicate(newItemDescription)) {
                duplicateCount++
                newItemDescription = `${description} (Copy ${duplicateCount})`
            }
            return newItemDescription
        } catch (error) {
            console.log("Error generating duplicate item name", error)
            throw new InternalServerError("Error generating duplicate item name")
        }
    }
}

module.exports = ProductionsService;