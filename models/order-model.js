const pool = require("../database/")

const getInventoryList = async () => {
  const query = `SELECT inv_id, inv_make, inv_model, inv_price FROM inventory`;
  const result = await pool.query(query);
  return result.rows;
};

const getVehicleById = async (invId) => {
  const query = `SELECT inv_price FROM inventory WHERE inv_id = $1`;
  const result = await pool.query(query, [invId]);
  return result.rows[0];
};


const createOrder = async(account_id, inv_id, quantity, total_price ) => {
  try {
    const sql = `INSERT INTO orders 
      (account_id, inv_id, quantity, total_price) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *`;
    return await pool.query(sql, [
      account_id, inv_id, quantity, total_price
    ]);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getInventoryList,
  getVehicleById,
  createOrder
};
