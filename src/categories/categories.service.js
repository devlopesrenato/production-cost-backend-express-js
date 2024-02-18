const CategoriesRepository = require('./categories.repository');
const ConflictError = require('../common/errors/types/ConflictError');
const NotFoundError = require('../common/errors/types/NotFoundError');

class CategoriesService {
    constructor() {
        this.categoriesRepository = new CategoriesRepository();
    }

    async getAll() {
        const categories = await this.categoriesRepository.getAll();
        return categories;
    }

    async getOne(uuid) {
        const category = await this.categoriesRepository.getOne(uuid);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        return category;
    }

    async create(createCategoryDto) {
        const already = await this.categoriesRepository.getByName(createCategoryDto.name.trim());
        if (already) {
            throw new ConflictError("A category with this name already exists");
        }
        return this.categoriesRepository.create(createCategoryDto);
    }

    async update(uuid, updateCategoryDto) {
        const category = await this.categoriesRepository.getOne(uuid);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        const already = await this.categoriesRepository.getByName(updateCategoryDto.name);
        if (already && already.uuid !== uuid) {
            throw new ConflictError("Category name already exists")
        }
        return this.categoriesRepository.update(uuid, updateCategoryDto)
    }

    async delete(uuid) {
        const category = await this.categoriesRepository.getOne(uuid);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        if (category.used !== "0") {
            throw new ConflictError("Category in use");
        }
        return this.categoriesRepository.delete(uuid);
    }
}

module.exports = CategoriesService;