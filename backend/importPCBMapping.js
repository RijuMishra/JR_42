const xlsx = require("xlsx");
const pool = require("./config/db");

const filePath = "./uploads/Cleaned_PCB_Component_Mapping.xlsx";

async function importMapping() {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;

    console.log("Sheets found:", sheetNames);

    for (const sheetName of sheetNames) {
      // Skip first sheet if it's not PCB data
      if (sheetName === sheetNames[0]) continue;

      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(sheet);

      const pcb_part_code = sheetName;

      console.log(`Processing PCB: ${pcb_part_code}, Rows: ${rows.length}`);

      const componentCount = {};

      for (const row of rows) {
        const consumption = row["Component Consumption"];
        if (!consumption) continue;

        const parts = consumption.split("/");

        for (const part of parts) {
          const cleanPart = part.trim();
          if (!cleanPart) continue;

          componentCount[cleanPart] =
            (componentCount[cleanPart] || 0) + 1;
        }
      }

      // Get PCB ID
      const pcbRes = await pool.query(
        `SELECT id FROM pcbs WHERE pcb_part_code = $1`,
        [pcb_part_code]
      );

      if (!pcbRes.rows.length) continue;

      const pcb_id = pcbRes.rows[0].id;

      for (const componentCode in componentCount) {
        const compRes = await pool.query(
          `SELECT id FROM components WHERE component_name = $1`,
          [componentCode]
        );

        if (!compRes.rows.length) continue;

        await pool.query(
          `
          INSERT INTO pcb_components (pcb_id, component_id, quantity_required)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
          `,
          [
            pcb_id,
            compRes.rows[0].id,
            componentCount[componentCode]
          ]
        );
      }
    }

    console.log("Dynamic PCB Mapping imported successfully");
    process.exit();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

importMapping();