const db = require('./src/config/db');

async function addOriginalPriceColumn() {
    try {
        const connection = await db.getConnection();
        console.log("Connected to database...");

        // Check if column exists
        const [columns] = await connection.query("SHOW COLUMNS FROM products LIKE 'original_price'");

        if (columns.length === 0) {
            console.log("Adding 'original_price' column...");
            await connection.query("ALTER TABLE products ADD COLUMN original_price DECIMAL(10, 2) DEFAULT NULL");
            console.log("Column added successfully.");
        } else {
            console.log("'original_price' column already exists.");
        }

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error("Error adding column:", error);
        process.exit(1);
    }
}

addOriginalPriceColumn();
