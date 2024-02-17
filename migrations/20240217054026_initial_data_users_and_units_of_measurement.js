/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
      INSERT INTO users (uuid, nickname, name, pass, updatedat)
      VALUES ('a2be8133-9f59-4afe-876c-11d322956731', '', 'system', '', NOW());
      
      INSERT INTO "unitsOfMeasurement" (uuid, name, "createBy", "createDate", "modifyBy", "modifyDate", ordering)
      VALUES 
      ('67fa3115-b75f-42af-a75b-cec78ea0cb26', 'ml', 'a2be8133-9f59-4afe-876c-11d322956731', NOW(), 'a2be8133-9f59-4afe-876c-11d322956731', NOW(), 0),
      ('2a2c308a-13b6-4d5d-b5d7-9d228fcb6a6a', 'gramas', 'a2be8133-9f59-4afe-876c-11d322956731', NOW(), 'a2be8133-9f59-4afe-876c-11d322956731', NOW(), 1),
      ('0a4dc529-2c55-44c0-8d3a-abc8ef460cbc', 'unidade', 'a2be8133-9f59-4afe-876c-11d322956731', NOW(), 'a2be8133-9f59-4afe-876c-11d322956731', NOW(), 2),
      ('9857f07f-d471-4e1c-8667-21a29cb2355d', 'cm', 'a2be8133-9f59-4afe-876c-11d322956731', NOW(), 'a2be8133-9f59-4afe-876c-11d322956731', NOW(), 3);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.raw(`
      DELETE FROM users WHERE uuid = 'a2be8133-9f59-4afe-876c-11d322956731';
      DELETE FROM "unitsOfMeasurement" WHERE "createBy" = 'a2be8133-9f59-4afe-876c-11d322956731';
    `);
};
