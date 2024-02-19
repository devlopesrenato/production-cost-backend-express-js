/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .renameTable('simplemeasure', 'customMeasurements')
        .alterTable('customMeasurements', function (table) {
            table
                .renameColumn('typemeasure', 'unitsOfMeasurementId')
                .renameColumn('createby', 'createById')
                .renameColumn('createdate', 'createDate')
                .renameColumn('modifyby', 'modifyById')                
                .renameColumn('modifydate', 'modifyDate')
            table.uuid('typemeasure').alter();
            table.uuid('createby').alter();
            table.uuid('modifyby').alter();
            table.float('quantity').alter();            
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .alterTable('customMeasurements', function (table) {
            table
                .renameColumn('unitsOfMeasurementId', 'typemeasure')
                .renameColumn('createById', 'createby')
                .renameColumn('createDate', 'createdate')
                .renameColumn('modifyById', 'modifyby')
                .renameColumn('modifyDate', 'modifydate')
            table.string('unitsOfMeasurementId').alter();
            table.string('createById').alter();
            table.string('modifyById').alter();
            table.string('quantity').alter();            
        })
        .renameTable('customMeasurements', 'simplemeasure');
};
