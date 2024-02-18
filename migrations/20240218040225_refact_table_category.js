/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .renameTable('category', 'categories')
        .alterTable('categories', function (table) {
            table
                .renameColumn('createby', 'createById')
                .renameColumn('createdate', 'createDate')
                .renameColumn('modifyby', 'modifyById')
                .renameColumn('modifydate', 'modifyDate')                
            table.uuid('modifyby').alter();
            table.uuid('createby').alter();
        });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .alterTable('categories', function (table) {
            table
                .renameColumn('modifyDate', 'modifydate')
                .renameColumn('modifyById', 'modifyby')
                .renameColumn('createDate', 'createdate')
                .renameColumn('createById', 'createby')
        })
        .renameTable('categories', 'category');
};