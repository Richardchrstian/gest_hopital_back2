import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../middleware/authMiddleware.js'; // Ajoute le middleware

const router = express.Router();

// Configuration de multer pour stocker les images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Nom unique basé sur l'heure
    },
});
const upload = multer({ storage });

// Route pour uploader une image de profil
router.post('/upload-profile-picture', verifyToken, upload.single('profilePicture'), (req, res) => {
    console.log('Fichier reçu:', req.file); // Log pour vérifier le fichier
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier uploadé' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('imageUrl renvoyé:', imageUrl); // Log pour confirmer la réponse
    res.json({ imageUrl });
});

export default router;