import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Ajout pour déboguer les logs
});

export const getVillesByPays = async (req, res) => {
    try {
        const { id_pays } = req.params;
        const villes = await prisma.ville.findMany({
            where: { id_pays: parseInt(id_pays) },
        });
        if (!villes || villes.length === 0) {
            return res.status(404).json({ message: 'Aucune ville trouvée pour ce pays' });
        }
        res.status(200).json(villes);
    } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};