/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .renameTable('feedstockused', 'productionFeedstocks')
        .alterTable('productionFeedstocks', function (table) {
            table
                .renameColumn('feedstockid', 'feedstockId')
                .renameColumn('productionid', 'productionId')
            table.uuid('feedstockid').alter();
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
        .alterTable('productionFeedstocks', function (table) {
            table
                .renameColumn('feedstockId', 'feedstockid')
                .renameColumn('productionId', 'productionid')
            table.string('feedstockId').alter();
            table.string('productionId').alter();
            table.string('quantity').alter();
        })
        .renameTable('productionFeedstocks', 'feedstockused');
};
