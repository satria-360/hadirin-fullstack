exports.seed = async function(knex) {
  // Hapus isi data lama jika ada
  await knex('roles').del();

  // Masukkan data dasar
  await knex('roles').insert([
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Petugas Piket' },
    { id: 3, name: 'Guru' },
    { id: 4, name: 'Murid' }
  ]);
};