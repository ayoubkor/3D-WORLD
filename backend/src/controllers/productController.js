const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const productData = req.body;
        if (req.file) {
            productData.image_url = `/uploads/${req.file.filename}`;
        }
        const id = await Product.create(productData);
        res.status(201).json({ id, ...productData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productData = req.body;
        if (req.file) {
            productData.image_url = `/uploads/${req.file.filename}`;
        }
        await Product.update(req.params.id, productData);
        res.json({ message: 'Produit mis à jour' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.json({ message: 'Produit supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
