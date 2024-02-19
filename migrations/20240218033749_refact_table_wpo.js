/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .renameTable('wpo', 'otherCosts')
        .alterTable('otherCosts', function (table) {
            table
                .renameColumn('createby', 'createById')
                .renameColumn('createdate', 'createDate')
                .renameColumn('modifyby', 'modifyById')
                .renameColumn('modifydate', 'modifyDate')
            table.uuid('createby').alter();
            table.uuid('modifyby').alter();
            table.float('quantity').alter();
            table.float('price').alter();
            table.boolean('active');
            table.string('type');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .alterTable('otherCosts', function (table) {
            table.dropColumn('type');
            table.dropColumn('active');
            table
                .renameColumn('createById', 'createby')
                .renameColumn('createDate', 'createdate')
                .renameColumn('modifyById', 'modifyby')
                .renameColumn('modifyDate', 'modifydate')
            table.string('createById').alter();
            table.string('modifyById').alter();
            table.string('quantity').alter();
            table.string('price').alter();
        })
        .renameTable('otherCosts', 'wpo');
};
