import express from 'express';
import { registerHopital, loginHopital, getAllHopitaux, updateProfile, archiveHopital, updateHopitalById, getHopitalById } from '../controllers/authHopitalController.js';
import { verifyToken, isDirecteur } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerHopital);
router.post('/login', loginHopital);
router.get('/hopitaux', getAllHopitaux);
router.get('/hopitaux/:id', verifyToken, isDirecteur, getHopitalById); // Route protégée
router.put('/profile', verifyToken, updateProfile);
router.put('/hopitaux/:id/archive', verifyToken, archiveHopital);
router.put('/hopitaux/:id', verifyToken, isDirecteur, updateHopitalById);

export default router;