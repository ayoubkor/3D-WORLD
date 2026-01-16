const db = require('../config/db');

class Order {
    static async getAll() {
        const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');

        // Fetch items for all orders efficiently
        if (orders.length === 0) return [];

        const orderIds = orders.map(o => o.id);
        const [items] = await db.query(
            'SELECT oi.*, p.name_fr, p.name_ar FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id IN (?)',
            [orderIds]
        );

        // Map items to orders
        const ordersWithItems = orders.map(order => ({
            ...order,
            items: items.filter(item => item.order_id === order.id)
        }));

        return ordersWithItems;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
        const [items] = await db.query('SELECT oi.*, p.name_fr, p.name_ar FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [id]);
        if (rows[0]) {
            rows[0].items = items;
        }
        return rows[0];
    }

    static async create(orderData, items) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { customer_name, customer_phone, customer_address, customer_message, total_price } = orderData;
            const [orderResult] = await connection.query(
                'INSERT INTO orders (customer_name, customer_phone, customer_address, customer_message, total_price) VALUES (?, ?, ?, ?, ?)',
                [customer_name, customer_phone, customer_address, customer_message, total_price]
            );
            const orderId = orderResult.insertId;

            for (const item of items) {
                await connection.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price]
                );
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async updateStatus(id, status) {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    }
}

module.exports = Order;
