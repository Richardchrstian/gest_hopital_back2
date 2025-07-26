import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Ajout pour déboguer les logs
});

export const getAllPays = async (req, res) => {
    try {
        const pays = await prisma.pays.findMany();
        if (!pays || pays.length === 0) {
            return res.status(404).json({ message: 'Aucun pays trouvé' });
        }
        res.status(200).json(pays);
    } catch (error) {
        console.error('Erreur lors de la récupération des pays:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};