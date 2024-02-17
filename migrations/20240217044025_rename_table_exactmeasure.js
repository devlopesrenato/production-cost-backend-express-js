/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .renameTable('exactmeasure', 'unitsOfMeasurement')
        .alterTable('unitsOfMeasurement', function (table) {
            table
                .renameColumn('createby', 'createBy')
                .renameColumn('createdate', 'createDate')
                .renameColumn('modifyby', 'modifyBy')
                .renameColumn('modifydate', 'modifyDate')
                .renameColumn('ordenation', 'ordering');
            table.uuid('modifyby').alter();
            table.uuid('createby').alter();
            table.integer('ordenation').alter();
        });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .alterTable('unitsOfMeasurement', function (table) {
            table
                .renameColumn('modifyDate', 'modifydate')
                .renameColumn('modifyBy', 'modifyby')
                .renameColumn('createDate', 'createdate')
                .renameColumn('createBy', 'createby')
                .renameColumn('ordering', 'ordenation');
            table.string('ordering').alter();
        })
        .renameTable('unitsOfMeasurement', 'exactmeasure');
};