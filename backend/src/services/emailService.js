const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

/**
 * Envoie une notification email à l'admin pour une nouvelle commande
 * @param {number} orderId
 * @param {object} orderData - { customer_name, customer_phone, customer_address, customer_message, total_price }
 * @param {Array}  items     - [{ name_fr, quantity, price }, ...]
 */
async function sendOrderNotification(orderId, orderData, items = []) {
    const {
        customer_name,
        customer_phone,
        customer_address,
        customer_message,
        total_price,
    } = orderData;

    // Build items rows
    const itemsRows = items.map(item => `
        <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.name_fr || item.product_id}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">${Number(item.price).toFixed(2)} DT</td>
        </tr>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:30px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">🛍️ GiftiniShop</h1>
          <p style="color:#a0a0c0;margin:8px 0 0;">Nouvelle commande reçue</p>
        </div>

        <!-- Order ID -->
        <div style="background:#ff4444;padding:12px;text-align:center;">
          <p style="color:#fff;margin:0;font-size:16px;font-weight:bold;">Commande #${orderId}</p>
        </div>

        <!-- Customer Info -->
        <div style="padding:30px;">
          <h2 style="color:#1a1a2e;font-size:16px;margin:0 0 16px;border-bottom:2px solid #f0f0f0;padding-bottom:8px;">
            👤 Coordonnées du client
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#666;width:35%;">Nom :</td>
              <td style="padding:8px 0;color:#1a1a2e;font-weight:bold;">${customer_name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;">Téléphone :</td>
              <td style="padding:8px 0;color:#1a1a2e;font-weight:bold;">
                <a href="tel:${customer_phone}" style="color:#ff4444;text-decoration:none;">${customer_phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;">Adresse :</td>
              <td style="padding:8px 0;color:#1a1a2e;">${customer_address}</td>
            </tr>
            ${customer_message ? `
            <tr>
              <td style="padding:8px 0;color:#666;vertical-align:top;">Message :</td>
              <td style="padding:8px 0;color:#1a1a2e;font-style:italic;">"${customer_message}"</td>
            </tr>` : ''}
          </table>
        </div>

        <!-- Items -->
        ${items.length > 0 ? `
        <div style="padding:0 30px 30px;">
          <h2 style="color:#1a1a2e;font-size:16px;margin:0 0 16px;border-bottom:2px solid #f0f0f0;padding-bottom:8px;">
            📦 Articles commandés
          </h2>
          <table style="width:100%;border-collapse:collapse;background:#fafafa;border-radius:8px;">
            <thead>
              <tr style="background:#1a1a2e;">
                <th style="padding:10px 12px;color:#fff;text-align:left;font-size:13px;">Produit</th>
                <th style="padding:10px 12px;color:#fff;text-align:center;font-size:13px;">Qté</th>
                <th style="padding:10px 12px;color:#fff;text-align:right;font-size:13px;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
        </div>` : ''}

        <!-- Total -->
        <div style="margin:0 30px 30px;background:#f8f8f8;border-radius:8px;padding:16px;text-align:right;">
          <span style="color:#666;font-size:14px;">Total : </span>
          <span style="color:#ff4444;font-size:20px;font-weight:bold;">${Number(total_price).toFixed(2)} DT</span>
        </div>

        <!-- Footer -->
        <div style="background:#f4f4f4;padding:16px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">
            Rendez-vous sur votre <strong>tableau de bord admin</strong> pour gérer cette commande.
          </p>
          <p style="color:#ccc;font-size:11px;margin:8px 0 0;">© 2026 GiftiniShop</p>
        </div>

      </div>
    </body>
    </html>`;

    await transporter.sendMail({
        from: `"GiftiniShop 🛍️" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🛒 Nouvelle commande #${orderId} — ${customer_name}`,
        html,
    });
}

module.exports = { sendOrderNotification };
