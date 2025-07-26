import express from 'express';
import { getVillesByPays } from '../controllers/villeController.js';

const router = express.Router();

router.get('/:id_pays', getVillesByPays);

export default router;