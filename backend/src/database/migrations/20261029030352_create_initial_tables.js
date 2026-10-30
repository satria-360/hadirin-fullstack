exports.up = async function(knex) {
  // 1. Tabel Roles
  await knex.schema.createTable('roles', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable().unique();
  });

  // 2. Tabel Classes
  await knex.schema.createTable('classes', (table) => {
    table.increments('id').primary();
    table.string('name', 120).notNullable();
    table.string('access_code', 10).unique();
    table.integer('teacher_id').unsigned().nullable();
    table.string('invite_token', 100).nullable();
    table.datetime('invite_expires_at').nullable();
  });

  // 3. Tabel Users
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
    table.integer('class_id').unsigned().nullable().references('id').inTable('classes').onDelete('SET NULL');
    table.string('employee_code', 50).nullable();
    table.string('full_name', 150).notNullable();
    table.string('email', 150).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('phone_number', 20).defaultTo('');
    table.text('avatar_url').nullable();
    table.enum('status', ['active', 'inactive']).defaultTo('active');
    table.boolean('is_student_entry').defaultTo(false);
    table.string('picket_day', 20).defaultTo('Senin');
  });

  // 4. Tabel Picket Reports
  await knex.schema.createTable('picket_reports', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.date('picket_date').notNullable();
    table.string('area_name', 100).nullable();
    table.string('status', 50).nullable();
    table.text('notes').nullable();
    table.specificType('proof_url', 'LONGTEXT').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // 5. Tabel Picket Photos
  await knex.schema.createTable('picket_photos', (table) => {
    table.increments('id').primary();
    table.integer('picket_report_id').unsigned().notNullable().references('id').inTable('picket_reports').onDelete('CASCADE');
    table.specificType('photo_url', 'LONGTEXT').notNullable();
    table.string('caption', 100).nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('picket_photos');
  await knex.schema.dropTableIfExists('picket_reports');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('classes');
  await knex.schema.dropTableIfExists('roles');
};