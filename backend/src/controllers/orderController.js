const Order = require('../models/orderModel');
const { sendOrderNotification } = require('../services/emailService');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { customer_name, customer_phone, customer_address, customer_message, total_price, items } = req.body;
        const orderId = await Order.create(
            { customer_name, customer_phone, customer_address, customer_message, total_price },
            items
        );

        // Send email notification (non-blocking)
        sendOrderNotification(
            orderId,
            { customer_name, customer_phone, customer_address, customer_message, total_price },
            items
        )
            .then(() => console.log(`✅ Email de notification envoyé pour la commande #${orderId}`))
            .catch(err => console.error(`❌ Erreur email commande #${orderId}:`, err.message));

        res.status(201).json({ id: orderId, message: 'Commande créée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await Order.updateStatus(req.params.id, status);
        res.json({ message: 'Statut de la commande mis à jour' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
