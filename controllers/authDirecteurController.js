import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Ajout pour déboguer les logs
});

export const loginDirecteur = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
        const directeur = await prisma.directeurs.findUnique({
            where: { email },
        });

        if (!directeur) {
            return res.status(404).json({ message: 'Directeur non trouvé' });
        }

        const isMatch = await bcrypt.compare(mot_de_passe, directeur.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: directeur.id_directeur, email: directeur.email, role: 'directeur' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Connexion réussie',
            role: 'directeur',
            user: {
                id: directeur.id_directeur,
                prenom: directeur.prenom,
                nom: directeur.nom,
                email: directeur.email,
                profile_picture: directeur.profile_picture,
                telephone: directeur.telephone,
                pays_id: directeur.pays_id,
                ville_id: directeur.ville_id,
            },
            token,
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        console.log('req.user dans updateProfile:', req.user);
        console.log('req.body reçu:', req.body);

        const { prenom, nom, email, profile_picture, telephone, pays_id, ville_id } = req.body;
        const id_directeur = req.user.id;

        console.log('id_directeur extrait:', id_directeur);

        if (!id_directeur) {
            console.log('id_directeur non défini - Requête rejetée');
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        const dataToUpdate = {};
        if (prenom !== undefined) dataToUpdate.prenom = prenom;
        if (nom !== undefined) dataToUpdate.nom = nom;
        if (email !== undefined) dataToUpdate.email = email;
        if (profile_picture !== undefined) dataToUpdate.profile_picture = profile_picture;
        if (telephone !== undefined) dataToUpdate.telephone = telephone;
        if (pays_id !== undefined) dataToUpdate.pays_id = parseInt(pays_id); // Conversion en entier
        if (ville_id !== undefined) dataToUpdate.ville_id = ville_id !== null ? parseInt(ville_id) : null; // Conversion en entier ou null

        if (Object.keys(dataToUpdate).length === 0) {
            console.log('Aucune donnée à mettre à jour');
            return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
        }

        const updatedDirecteur = await prisma.directeurs.update({
            where: { id_directeur },
            data: dataToUpdate,
        });

        console.log('Résultat de la mise à jour:', updatedDirecteur);
        res.json({ message: 'Profil mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
    }
};