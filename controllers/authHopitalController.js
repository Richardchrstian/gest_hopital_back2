import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Enum mapping pour transformer les valeurs de statut
const statutMapping = {
    actif: 'actif',
    archiv_: 'archivé',
};

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Ajout pour déboguer les logs
});

export const registerHopital = async (req, res) => {
    try {
        const { nom, email, mot_de_passe, adresse, telephone, pays_id, ville_id } = req.body;
        console.log("Payload reçu pour inscription hôpital :", req.body);

        // Vérifier si l'email existe déjà dans n'importe quelle table
        const existingUser = await prisma.hopitaux.findUnique({ where: { email } }) ||
            await prisma.comptables.findUnique({ where: { email } }) ||
            await prisma.directeurs.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé par un autre compte." });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(mot_de_passe, salt);

        const newHopital = await prisma.hopitaux.create({
            data: {
                nom,
                email,
                mot_de_passe: hashedPassword,
                adresse: adresse || null,
                telephone: telephone || null,
                pays_id: pays_id ? parseInt(pays_id) : null,
                ville_id: ville_id ? parseInt(ville_id) : null,
                statut: 'actif', // Défaut selon schema.prisma
            },
        });

        res.status(201).json({ message: "Inscription réussie.", id: newHopital.id_hopital });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
    }
};

export const getAllHopitaux = async (req, res) => {
    try {
        const hopitaux = await prisma.hopitaux.findMany({
            include: {
                pays: true,
                ville: true,
            },
        });
        if (!hopitaux || hopitaux.length === 0) {
            return res.status(404).json({ message: 'Aucun hôpital trouvé' });
        }
        // Transformation des résultats pour correspondre au format attendu
        const formattedHopitaux = hopitaux.map(h => ({
            id_hopital: h.id_hopital,
            nom: h.nom,
            adresse: h.adresse,
            telephone: h.telephone,
            email: h.email,
            profile_picture: h.profile_picture,
            registration_date: h.registration_date,
            statut: statutMapping[h.statut] || h.statut, // Transformation du statut
            pays: h.pays?.nom_pays || null,
            ville: h.ville?.nom_ville || null,
        }));
        res.json(formattedHopitaux);
    } catch (error) {
        console.error('Erreur lors de la récupération des hôpitaux:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const loginHopital = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
        const hopital = await prisma.hopitaux.findUnique({
            where: { email },
        });

        if (!hopital) {
            return res.status(404).json({ message: "Hôpital non trouvé" });
        }
        if (hopital.statut === 'archiv_') {
            return res.status(403).json({ message: "Ce compte est archivé et ne peut pas se connecter." });
        }

        const isPasswordValid = bcrypt.compareSync(mot_de_passe, hopital.mot_de_passe);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: hopital.id_hopital, email: hopital.email, role: "hopital" },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Connexion réussie",
            role: "hopital",
            user: {
                id: hopital.id_hopital,
                nom: hopital.nom,
                email: hopital.email,
                profile_picture: hopital.profile_picture,
                adresse: hopital.adresse,
                telephone: hopital.telephone,
                pays_id: hopital.pays_id,
                ville_id: hopital.ville_id,
            },
            token,
        });
    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        console.log("req.user dans updateProfile (hopital):", req.user);
        console.log("req.body reçu:", req.body);

        const { nom, email, adresse, telephone, profile_picture, pays_id, ville_id } = req.body;
        const id_hopital = req.user.id;

        console.log("id_hopital extrait:", id_hopital);

        if (!id_hopital) {
            console.log("id_hopital non défini - Requête rejetée");
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const dataToUpdate = {};
        if (nom !== undefined) dataToUpdate.nom = nom;
        if (email !== undefined) dataToUpdate.email = email;
        if (adresse !== undefined) dataToUpdate.adresse = adresse;
        if (telephone !== undefined) dataToUpdate.telephone = telephone;
        if (profile_picture !== undefined) dataToUpdate.profile_picture = profile_picture;
        if (pays_id !== undefined) dataToUpdate.pays_id = pays_id ? parseInt(pays_id) : null;
        if (ville_id !== undefined) dataToUpdate.ville_id = ville_id ? parseInt(ville_id) : null;

        if (Object.keys(dataToUpdate).length === 0) {
            console.log("Aucune donnée à mettre à jour");
            return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
        }

        const updatedHopital = await prisma.hopitaux.update({
            where: { id_hopital },
            data: dataToUpdate,
        });

        res.json({ message: 'Profil mis à jour avec succès' });
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
    }
};

export const archiveHopital = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedHopital = await prisma.hopitaux.update({
            where: { id_hopital: parseInt(id) },
            data: { statut: 'archiv_' }, // Utilise la valeur correcte de l'enum
        });

        if (!updatedHopital) {
            return res.status(404).json({ message: 'Hôpital non trouvé' });
        }
        res.status(200).json({ message: 'Hôpital archivé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'archivage:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export const updateHopitalById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, adresse, telephone, email, pays_id, ville_id } = req.body;

        const updatedHopital = await prisma.hopitaux.update({
            where: { id_hopital: parseInt(id) },
            data: {
                nom,
                adresse,
                telephone,
                email,
                pays_id: pays_id ? parseInt(pays_id) : null,
                ville_id: ville_id ? parseInt(ville_id) : null,
            },
        });

        if (!updatedHopital) {
            return res.status(404).json({ message: 'Hôpital non trouvé.' });
        }
        res.status(200).json({ message: 'Hôpital mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'hôpital:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
    }
};

export const getHopitalById = async (req, res) => {
    try {
        const { id } = req.params;
        const hopital = await prisma.hopitaux.findUnique({
            where: { id_hopital: parseInt(id) },
            include: {
                pays: true,
                ville: true,
            },
        });

        if (!hopital) {
            return res.status(404).json({ message: 'Hôpital non trouvé' });
        }
        // Transformation des résultats pour correspondre au format attendu
        const formattedHopital = {
            id_hopital: hopital.id_hopital,
            nom: hopital.nom,
            adresse: hopital.adresse,
            telephone: hopital.telephone,
            email: hopital.email,
            profile_picture: hopital.profile_picture,
            registration_date: hopital.registration_date,
            statut: statutMapping[hopital.statut] || hopital.statut, // Transformation du statut
            pays: hopital.pays?.nom_pays || null,
            ville: hopital.ville?.nom_ville || null,
        };
        res.json(formattedHopital);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'hôpital:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};