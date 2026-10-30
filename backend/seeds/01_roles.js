exports.seed = async function(knex) {
  // Upsert data dasar (aman dijalankan berulang kali).
  // Jangan pakai del() karena FK users.role_id ON DELETE CASCADE akan menghapus semua user.
  await knex('roles')
    .insert([
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Petugas Piket' },
      { id: 3, name: 'Guru' },
      { id: 4, name: 'Murid' }
    ])
    .onConflict('id')
    .merge();
};