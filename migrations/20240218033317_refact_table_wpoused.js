/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .renameTable('wpoused', 'productionOtherCosts')
        .alterTable('productionOtherCosts', function (table) {
            table
                .renameColumn('wpoid', 'otherCostId')
                .renameColumn('productionid', 'productionId')
            table.uuid('wpoid').alter();
            table.uuid('productionid').alter();
            table.float('quantity').alter();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .alterTable('productionOtherCosts', function (table) {
            table
                .renameColumn('otherCostId', 'wpoid')
                .renameColumn('productionId', 'productionid')
            table.string('otherCostId').alter();
            table.string('productionId').alter();
            table.string('quantity').alter();
        })
        .renameTable('productionOtherCosts', 'wpoused');
};
