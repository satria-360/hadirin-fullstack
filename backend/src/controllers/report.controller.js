const ExcelJS = require('exceljs');
const { db } = require('../config/database');

// Export riwayat laporan piket bulanan ke Excel
const exportPicketExcel = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pr.picket_date, u.employee_code, u.full_name, pr.area_name, pr.status, pr.notes
      FROM picket_reports pr JOIN users u ON pr.user_id = u.id ORDER BY pr.picket_date DESC
    `);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Piket');
    worksheet.columns = [
      { header: 'Tanggal', key: 'picket_date', width: 15 },
      { header: 'Kode/NIS', key: 'employee_code', width: 15 },
      { header: 'Nama Siswa', key: 'full_name', width: 25 },
      { header: 'Area Piket', key: 'area_name', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Catatan', key: 'notes', width: 30 }
    ];
    worksheet.addRows(rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Piket_Bulanan.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  exportPicketExcel
};
