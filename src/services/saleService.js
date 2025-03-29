import { db } from "../database/database";

// Generate a unique sale code
const generateSaleCode = () => {
  const date = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `V${date}${random}`;
};

// Get all sales
const getAllSales = async () => {
  const rows = await db.getAllAsync("SELECT * FROM sales ORDER BY date DESC");
  return rows;
};

// Get sale by ID with its items
const getSaleById = async (id) => {
  const saleRows = await db.getAllAsync("SELECT * FROM sales WHERE id = ?", [
    id,
  ]);

  if (!saleRows || saleRows.length === 0) return null; // Check if saleRows exists

  const sale = saleRows[0]; // Fix: Access first element directly

  const itemRows = await db.getAllAsync(
    `SELECT si.*, p.code, p.description 
     FROM sale_items si
     JOIN products p ON si.product_id = p.id
     WHERE si.sale_id = ?`,
    [id]
  );

  const items =
    itemRows?.map((item) => ({
      ...item,
      product: {
        id: item.product_id,
        code: item.code,
        description: item.description,
        price: item.price,
      },
    })) || []; // Fix: Ensure `itemRows` exists before mapping

  return { ...sale, items };
};


// Add a new sale with its items
const addSale = async (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const sale = {
    code: generateSaleCode(),
    date: new Date().toISOString(),
    total,
  };

  const result = await db.runAsync(
    "INSERT INTO sales (code, date, total) VALUES (?, ?, ?)",
    [sale.code, sale.date, sale.total]
  );

  const saleId = result.lastInsertRowId;

  const itemPromises = cartItems.map((item) =>
    db.runAsync(
      "INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [saleId, item.product.id, item.quantity, item.product.price]
    )
  );

  await Promise.all(itemPromises);

  return { ...sale, id: saleId };
};

export { getAllSales, getSaleById, addSale };
