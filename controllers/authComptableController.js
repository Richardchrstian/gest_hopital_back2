import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Ajout pour déboguer les logs
});

export const registerComptable = async (req, res) => {
    try {
        const { nom, email, mot_de_passe, id_hopital } = req.body;

        if (!nom || !email || !mot_de_passe || !id_hopital) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
        }

        // Vérifier si l'email existe déjà dans n'importe quelle table
        const existingUser = await prisma.hopitaux.findUnique({ where: { email } }) ||
            await prisma.comptables.findUnique({ where: { email } }) ||
            await prisma.directeurs.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé par un autre compte." });
        }

        const existingHopital = await prisma.hopitaux.findUnique({
            where: { id_hopital: parseInt(id_hopital) },
        });
        if (!existingHopital) {
            return res.status(400).json({ message: "L'hôpital spécifié n'existe pas." });
        }

        const hashedPassword = bcrypt.hashSync(mot_de_passe, 10);
        const newComptable = await prisma.comptables.create({
            data: {
                nom,
                email,
                mot_de_passe: hashedPassword,
                id_hopital: parseInt(id_hopital),
            },
        });

        res.status(201).json({ message: 'Comptable inscrit avec succès.', id: newComptable.id_comptable });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};

export const loginComptable = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        const comptable = await prisma.comptables.findUnique({
            where: { email },
        });

        if (!comptable) {
            return res.status(404).json({ message: "Comptable non trouvé" });
        }

        const isPasswordValid = bcrypt.compareSync(mot_de_passe, comptable.mot_de_passe);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: comptable.id_comptable, email: comptable.email, role: "comptable" },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Connexion réussie",
            role: "comptable",
            user: {
                id: comptable.id_comptable,
                prenom: comptable.prenom,
                nom: comptable.nom,
                email: comptable.email,
                telephone: comptable.telephone,
                profile_picture: comptable.profile_picture,
                pays_id: comptable.pays_id,
                ville_id: comptable.ville_id,
            },
            token,
        });
    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const getAllComptables = async (req, res) => {
    try {
        const comptables = await prisma.comptables.findMany();
        if (!comptables || comptables.length === 0) {
            return res.status(404).json({ message: 'Aucun comptable trouvé.' });
        }
        res.json(comptables);
    } catch (error) {
        console.error('Erreur lors de la récupération des comptables:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        console.log("req.user dans updateProfile (comptable):", req.user);
        console.log("req.body reçu:", req.body);

        const { prenom, nom, email, telephone, profile_picture, pays_id, ville_id } = req.body;
        const id_comptable = req.user.id;

        console.log("id_comptable extrait:", id_comptable);

        if (!id_comptable) {
            console.log("id_comptable non défini - Requête rejetée");
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const dataToUpdate = {};
        if (prenom !== undefined) dataToUpdate.prenom = prenom;
        if (nom !== undefined) dataToUpdate.nom = nom;
        if (email !== undefined) dataToUpdate.email = email;
        if (telephone !== undefined) dataToUpdate.telephone = telephone;
        if (profile_picture !== undefined) dataToUpdate.profile_picture = profile_picture;
        if (pays_id !== undefined) dataToUpdate.pays_id = pays_id ? parseInt(pays_id) : null;
        if (ville_id !== undefined) dataToUpdate.ville_id = ville_id ? parseInt(ville_id) : null;

        if (Object.keys(dataToUpdate).length === 0) {
            console.log("Aucune donnée à mettre à jour");
            return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
        }

        const updatedComptable = await prisma.comptables.update({
            where: { id_comptable },
            data: dataToUpdate,
        });

        res.json({ message: 'Profil mis à jour avec succès' });
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
    }
};