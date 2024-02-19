/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .renameTable('feedstock', 'feedstocks')
        .alterTable('feedstocks', function (table) {
            table
                .renameColumn('measurement', 'customMeasurementId')
                .renameColumn('createby', 'createById')
                .renameColumn('createdate', 'createDate')
                .renameColumn('modifyby', 'modifyById')
                .renameColumn('modifydate', 'modifyDate')
            table.uuid('measurement').alter();
            table.uuid('createby').alter();
            table.uuid('modifyby').alter();
            table.float('quantity').alter();
            table.float('price').alter();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .alterTable('feedstocks', function (table) {
            table
                .renameColumn('customMeasurementId', 'measurement')
                .renameColumn('createById', 'createby')
                .renameColumn('createDate', 'createdate')
                .renameColumn('modifyById', 'modifyby')
                .renameColumn('modifyDate', 'modifydate')
            table.string('customMeasurementId').alter();
            table.string('createById').alter();
            table.string('modifyById').alter();
            table.string('quantity').alter();
            table.string('price').alter();
        })
        .renameTable('feedstocks', 'feedstock');
};
