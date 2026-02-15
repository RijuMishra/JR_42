const xlsx = require("xlsx");
const pool = require("./config/db");
require("dotenv").config();

const filePath = "./uploads/Cleaned_Inventory_Dataset.xlsx";

async function importComponents() {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);
    console.log(Object.keys(rows[0]));
    console.log(`Found ${rows.length} rows`);

    for (const row of rows) {
      const {
        part_code,
        component,
        monthly_required_quantity,
        current_stock,
        ok,
        scrap,
        total,
        nff,
      } = row;

      await pool.query(
        `
        INSERT INTO components (
          part_code,
          component_name,
          current_stock,
          monthly_required_quantity,
          ok_count,
          scrap_count,
          total_count,
          nff_count
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (part_code)
        DO UPDATE SET
          component_name = EXCLUDED.component_name,
          current_stock = EXCLUDED.current_stock,
          monthly_required_quantity = EXCLUDED.monthly_required_quantity,
          ok_count = EXCLUDED.ok_count,
          scrap_count = EXCLUDED.scrap_count,
          total_count = EXCLUDED.total_count,
          nff_count = EXCLUDED.nff_count
        `,
        [
          part_code,
          component,
          Number(current_stock) || 0,
          Number(monthly_required_quantity) || 0,
          Number(ok) || 0,
          Number(scrap) || 0,
          Number(total) || 0,
          Number(nff) || 0,
        ]
      );
    }

    console.log("Import completed successfully");
    process.exit();
  } catch (error) {
    console.error("Import failed:", error.message);
    process.exit(1);
  }
}

importComponents();