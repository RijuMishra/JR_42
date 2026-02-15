const xlsx = require("xlsx");
const pool = require("./config/db");

const filePath = "./uploads/Cleaned_PCB_Master.xlsx";

async function importPCBs() {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    console.log("Column Names:", Object.keys(rows[0]));
    console.log("Rows found:", rows.length);

    for (const row of rows) {
      const pcb_part_code = row["part_code"];
      const status = row["status"];

      await pool.query(
        `
        INSERT INTO pcbs (pcb_part_code, status)
        VALUES ($1, $2)
        ON CONFLICT (pcb_part_code)
        DO UPDATE SET status = EXCLUDED.status
        `,
        [pcb_part_code, status]
      );
    }

    console.log("PCB Master imported successfully");
    process.exit();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

importPCBs();