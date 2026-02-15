const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, async (req, res) => {
  const { pcb_id, quantity } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Get required components
    const components = await client.query(
      `
      SELECT c.id, c.current_stock, pc.quantity_required
      FROM pcb_components pc
      JOIN components c ON c.id = pc.component_id
      WHERE pc.pcb_id = $1
      `,
      [pcb_id]
    );

    for (let comp of components.rows) {
      const requiredTotal = comp.quantity_required * quantity;

      if (comp.current_stock < requiredTotal) {
        throw new Error("Insufficient stock");
      }

      // Deduct stock
      await client.query(
        `UPDATE components
         SET current_stock = current_stock - $1
         WHERE id = $2`,
        [requiredTotal, comp.id]
      );

      // Insert consumption history
      await client.query(
        `INSERT INTO consumption_history
         (component_id, pcb_id, quantity_deducted)
         VALUES ($1, $2, $3)`,
        [comp.id, pcb_id, requiredTotal]
      );
    }

    // Insert production record
    await client.query(
      `INSERT INTO production_entries (pcb_id, quantity_produced)
       VALUES ($1, $2)`,
      [pcb_id, quantity]
    );

    await client.query("COMMIT");

    res.json({ message: "Production successful" });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;