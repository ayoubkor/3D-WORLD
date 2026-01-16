const db = require('./src/config/db');

async function migrate() {
    try {
        console.log("Updating order status enum...");
        // Modify the column to include new ENUM values
        await db.query(`
            ALTER TABLE orders 
            MODIFY COLUMN status 
            ENUM('nouvelle', 'confirmee', 'conception', 'en machine', 'assamblage', 'ambalage', 'societe de livraison', 'livree', 'retour', 'annulee') 
            DEFAULT 'nouvelle'
        `);
        console.log("Order status enum updated successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit();
    }
}

migrate();
