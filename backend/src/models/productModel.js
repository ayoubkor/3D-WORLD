const db = require('../config/db');

class Product {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { name_fr, name_ar, description_fr, description_ar, price, image_url, category, subcategory, stock, is_promo, original_price } = data;
        const [result] = await db.query(
            'INSERT INTO products (name_fr, name_ar, description_fr, description_ar, price, image_url, category, subcategory, stock, is_promo, original_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name_fr, name_ar, description_fr, description_ar, price, image_url, category, subcategory, stock, is_promo || false, original_price || null]
        );
        return result.insertId;
    }

    static async update(id, data) {
        // Fetch current product to preserve image if not provided
        // OR better: build dynamic query.

        const fields = [];
        const values = [];

        if (data.name_fr !== undefined) { fields.push('name_fr=?'); values.push(data.name_fr); }
        if (data.name_ar !== undefined) { fields.push('name_ar=?'); values.push(data.name_ar); }
        if (data.description_fr !== undefined) { fields.push('description_fr=?'); values.push(data.description_fr); }
        if (data.description_ar !== undefined) { fields.push('description_ar=?'); values.push(data.description_ar); }
        if (data.price !== undefined) { fields.push('price=?'); values.push(data.price); }
        if (data.image_url !== undefined) { fields.push('image_url=?'); values.push(data.image_url); }
        if (data.category !== undefined) { fields.push('category=?'); values.push(data.category); }
        if (data.subcategory !== undefined) { fields.push('subcategory=?'); values.push(data.subcategory); }
        if (data.stock !== undefined) { fields.push('stock=?'); values.push(data.stock); }

        // Handle is_promo boolean/string conversion
        if (data.is_promo !== undefined) {
            fields.push('is_promo=?');
            values.push(data.is_promo === 'true' || data.is_promo === true ? 1 : 0);
        }

        // Handle original_price
        if (data.original_price !== undefined) {
            fields.push('original_price=?');
            // If empty string, set to NULL or 0? user logic expects >0.
            // If user clears it, we should set null.
            values.push(data.original_price === '' || data.original_price === 'null' ? null : data.original_price);
        }

        if (fields.length === 0) return;

        values.push(id);

        await db.query(
            `UPDATE products SET ${fields.join(', ')} WHERE id=?`,
            values
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
    }
}

module.exports = Product;
