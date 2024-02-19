/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
        INSERT INTO parameters (id, description, value, active)
        VALUES (1, 'Profit percentage (%)', '100', true);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.raw(`      
      DELETE FROM parameters WHERE id=1;
    `);
};
