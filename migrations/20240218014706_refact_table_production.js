/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .renameTable('production', 'productions')
        .alterTable('productions', function (table) {
            table
                .renameColumn('categoryid', 'categoryId')
                .renameColumn('createby', 'createById')
                .renameColumn('createdate', 'createDate')
                .renameColumn('modifyby', 'modifyById')
                .renameColumn('modifydate', 'modifyDate')
            table.uuid('modifyby').alter();
            table.uuid('createby').alter();
            table.uuid('categoryid').alter();
            table.float('quantity');
            table.float('price').alter();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
    .alterTable('productions', function (table) {
        table.dropColumn('quantity');
        table
        .renameColumn('categoryId', 'categoryid')
        .renameColumn('createById', 'createby')
        .renameColumn('createDate', 'createdate')
        .renameColumn('modifyById', 'modifyby')
        .renameColumn('modifyDate', 'modifydate')
        table.string('modifyById').alter();
        table.string('createById').alter();
        table.string('categoryId').alter();
        table.string('price').alter();
    })
    .renameTable('productions', 'production');
};
