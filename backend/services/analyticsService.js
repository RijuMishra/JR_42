const pool = require("../db");  // make sure path is correct

async function getShortageAnalysis() {
  const query = `
    SELECT 
      c.id,
      c.part_code,
      c.component_name,
      c.current_stock,
      c.monthly_required_quantity,
      COALESCE(SUM(pc.quantity_required), 0) AS total_required,
      GREATEST(COALESCE(SUM(pc.quantity_required), 0) - c.current_stock, 0) AS shortage,
      CASE 
        WHEN COALESCE(SUM(pc.quantity_required), 0) > 0
        THEN ROUND(
          (GREATEST(COALESCE(SUM(pc.quantity_required), 0) - c.current_stock, 0)::numeric
          / COALESCE(SUM(pc.quantity_required), 0)) * 100, 2
        )
        ELSE 0
      END AS shortage_percentage,
      CASE
        WHEN c.current_stock < (0.2 * c.monthly_required_quantity)
        THEN 'LOW STOCK'
        ELSE 'OK'
      END AS stock_status
    FROM components c
    LEFT JOIN pcb_components pc ON c.id = pc.component_id
    GROUP BY c.id;
  `;

  const result = await pool.query(query);
  return result.rows;
}

module.exports = {
  getShortageAnalysis
};