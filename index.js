import express from 'express';
import authHopitalRoutes from './routes/authHopital.js';
import authComptableRoutes from './routes/authComptable.js';
import authDirecteurRoutes from './routes/authDirecteur.js';
import uploadRouter from './routes/upload.js';
import paysRouter from './routes/pays.js';
import villeRouter from './routes/ville.js';
import { login } from './controllers/authController.js'; // Ajout de l'importation

import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();

// Configuration CORS pour autoriser les requêtes depuis le frontend
app.use(cors({
    origin: 'http://localhost:5173', // URL de ton frontend (par défaut avec Vite)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`Requête reçue: ${req.method} ${req.url} - Body:`, req.body);
    next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth/hopital', authHopitalRoutes);
app.use('/api/auth/comptable', authComptableRoutes);
app.use('/api/auth/directeur', authDirecteurRoutes);
app.use('/api/auth', uploadRouter);
app.use('/api/pays', paysRouter);
app.use('/api/villes', villeRouter);
app.post('/api/auth/login', login);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));