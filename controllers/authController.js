import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export const login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
        console.log(`Tentative de connexion pour email: ${email}`);

        let user = null;
        let role = null;
        let userData = null;

        // Vérifier dans la table hopitaux en premier
        user = await prisma.hopitaux.findUnique({ where: { email } });
        if (user) {
            console.log(`Utilisateur trouvé dans hopitaux: ${email}`);
            if (user.statut === 'archiv_') {
                console.log(`Compte archivé détecté pour ${email}`);
                return res.status(403).json({ message: "Ce compte est archivé et ne peut pas se connecter." });
            }
            role = 'hopital';
            userData = {
                id: user.id_hopital,
                nom: user.nom,
                email: user.email,
                profile_picture: user.profile_picture,
                adresse: user.adresse,
                telephone: user.telephone,
                pays_id: user.pays_id,
                ville_id: user.ville_id,
            };
        }

        // Si pas trouvé dans hopitaux, vérifier dans comptables
        if (!user) {
            user = await prisma.comptables.findUnique({ where: { email } });
            if (user) {
                console.log(`Utilisateur trouvé dans comptables: ${email}`);
                role = 'comptable';
                userData = {
                    id: user.id_comptable,
                    prenom: user.prenom,
                    nom: user.nom,
                    email: user.email,
                    telephone: user.telephone,
                    profile_picture: user.profile_picture,
                    pays_id: user.pays_id,
                    ville_id: user.ville_id,
                };
            }
        }

        // Si pas trouvé dans comptables, vérifier dans directeurs
        if (!user) {
            user = await prisma.directeurs.findUnique({ where: { email } });
            if (user) {
                console.log(`Utilisateur trouvé dans directeurs: ${email}`);
                role = 'directeur';
                userData = {
                    id: user.id_directeur,
                    prenom: user.prenom,
                    nom: user.nom,
                    email: user.email,
                    profile_picture: user.profile_picture,
                    telephone: user.telephone,
                    pays_id: user.pays_id,
                    ville_id: user.ville_id,
                };
            }
        }

        if (!user) {
            console.log(`Aucun utilisateur trouvé pour ${email}`);
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        console.log(`Vérification du mot de passe pour ${email}`);
        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isPasswordValid) {
            console.log(`Mot de passe incorrect pour ${email}`);
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { id: userData.id, email: user.email, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log(`Connexion réussie pour ${email} avec rôle ${role}`);
        res.status(200).json({
            message: 'Connexion réussie',
            role,
            user: userData,
            token,
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};