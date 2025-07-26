import express from 'express';
import { registerComptable, loginComptable, getAllComptables, updateProfile } from '../controllers/authComptableController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // Ajout du middleware

const router = express.Router();

router.post('/register', registerComptable);
router.post('/login', loginComptable);
router.get('/comptables', getAllComptables);
router.put('/profile', verifyToken, updateProfile); // Ajout de la route pour mettre à jour le profil

export default router;