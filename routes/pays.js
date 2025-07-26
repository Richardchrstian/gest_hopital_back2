import express from 'express';
import { getAllPays } from '../controllers/paysController.js';

const router = express.Router();

router.get('/', getAllPays);

export default router;