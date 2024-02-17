/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('exactmeasure', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('name').notNullable().unique();
        table.string('createby').notNullable();
        table.date('createdate').notNullable();
        table.string('modifyby').notNullable();
        table.date('modifydate').notNullable();
        table.string('ordenation').notNullable().unique();
      })
      .createTable('simplemeasure', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('name').notNullable().unique();
        table.string('typemeasure').notNullable();
        table.string('quantity').notNullable();
        table.string('createby').notNullable();
        table.date('createdate').notNullable();
        table.string('modifyby').notNullable();
        table.date('modifydate').notNullable();
      })
      .createTable('feedstock', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('name').notNullable().unique();
        table.string('measurement').notNullable();
        table.string('quantity').notNullable();
        table.string('price').notNullable();
        table.string('createby').notNullable();
        table.date('createdate').notNullable();
        table.string('modifyby').notNullable();
        table.date('modifydate').notNullable();
      })
      .createTable('production', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('name').notNullable().unique();
        table.string('price').notNullable();
        table.string('categoryid').notNullable();
        table.string('createby').notNullable();
        table.date('createdate').notNullable();
        table.string('modifyby').notNullable();
        table.date('modifydate').notNullable();
      })
      .createTable('feedstockused', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('feedstockid').notNullable();
        table.string('quantity').notNullable();
        table.string('productionid').notNullable();
      })
      .createTable('wpo', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('name').notNullable().unique();
        table.string('quantity').notNullable();
        table.string('price').notNullable();
        table.string('createby').notNullable();
        table.date('createdate').notNullable();
        table.string('modifyby').notNullable();
        table.date('modifydate').notNullable();
      })
      .createTable('wpoused', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('wpoid').notNullable();
        table.string('quantity').notNullable();
        table.string('productionid').notNullable();
      })
      .createTable('users', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('nickname').notNullable().unique();
        table.string('name').notNullable();
        table.string('pass').notNullable();
        table.date('updatedat').notNullable();
      })
      .createTable('category', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('name').notNullable().unique();
        table.string('createby').notNullable();
        table.date('createdate').notNullable();
        table.string('modifyby').notNullable();
        table.date('modifydate').notNullable();
      })
      .createTable('settings', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.increments('id').primary();
        table.string('description').notNullable();
        table.string('value').notNullable();
        table.boolean('active').notNullable();
      });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('settings')
      .dropTableIfExists('category')
      .dropTableIfExists('users')
      .dropTableIfExists('wpoused')
      .dropTableIfExists('wpo')
      .dropTableIfExists('feedstockused')
      .dropTableIfExists('production')
      .dropTableIfExists('feedstock')
      .dropTableIfExists('simplemeasure')
      .dropTableIfExists('exactmeasure');
  };