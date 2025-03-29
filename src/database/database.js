import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("vendas.db");

export const initDatabase = async () => {
  
  await db.withTransactionAsync(async () => {
    const queries = [
      `CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT NOT NULL UNIQUE,
          description TEXT NOT NULL,
          price REAL NOT NULL
        );`,
      `CREATE TABLE IF NOT EXISTS sales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT NOT NULL UNIQUE,
          date TEXT NOT NULL,
          total REAL NOT NULL
        );`,
      `CREATE TABLE IF NOT EXISTS sale_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sale_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY (sale_id) REFERENCES sales (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        );`,
    ];

    queries.forEach(async (query) => {
      await db.execAsync(query);
    });

    console.log("Banco de dados inicializado");
  });

  return db;
}
