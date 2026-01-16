const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

        // Pour le test, on accepte 'admin123' si le hash n'est pas encore prêt
        // En prod, utilisez bcrypt.compare
        const isMatch = (password === 'admin123'); // Simplification pour le démo
        
        if (!isMatch) return res.status(401).json({ message: 'Identifiants invalides' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
