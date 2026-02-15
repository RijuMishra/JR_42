const pool = require("../config/db");

const importComponents = async (rows) => {
  let inserted = 0;
  let updated = 0;

  for (const row of rows) {
    const {
      part_code,
      component,
      monthly_required_quantity,
      current_stock,
      ok,
      scrap,
      total,
      nff
    } = row;

    const query = `
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
    `;

    const values = [
      part_code,
      component,
      Number(current_stock) || 0,
      Number(monthly_required_quantity) || 0,
      Number(ok) || 0,
      Number(scrap) || 0,
      Number(total) || 0,
      Number(nff) || 0
    ];

    try {
      await pool.query(query, values);
      inserted++;
    } catch (err) {
      console.error("Row failed:", err.message);
    }
  }

  return { inserted, total: rows.length };
};

module.exports = { importComponents };