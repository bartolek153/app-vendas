import { db } from '../database/database';


// Obter um produto pelo ID
const getAllProducts = async () => {
  const rows = await db.getAllAsync("SELECT * FROM products");
  return rows;
};

// Obter um produto pelo ID
const getProductById = async (id) => {
  const result = await db.getFirstAsync("SELECT * FROM products WHERE id = ?", [
    id,
  ]);
  return result.data || null;
};

// Adicionar um novo produto
const addProduct = async (product) => {
  const result = await db.runAsync(
    "INSERT INTO products (code, description, price) VALUES (?, ?, ?)",
    [product.code, product.description, product.price]
  );
  return { ...product, id: result.lastInsertRowId };
};

// Atualizar um produto existente
const updateProduct = async (product) => {
  await db.runAsync(
    "UPDATE products SET code = ?, description = ?, price = ? WHERE id = ?",
    [product.code, product.description, product.price, product.id]
  );
  return product;
};

// Excluir um produto
const deleteProduct = async (id) => {
  await db.runAsync("DELETE FROM products WHERE id = ?", [id]);
  return true;
};

export {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
