import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization?.split(' ')[1];
    console.log('En-tête Authorization reçu dans verifyToken');
    if (!authHeader) {
        console.log('Accès refusé. Aucun token fourni.');
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }
    console.log('Token extrait');
    jwt.verify(authHeader, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Erreur lors de la vérification du token:', err.message);
            return res.status(401).json({ message: 'Token invalide ou expiré.' });
        }
        console.log('Token décodé avec succès');
        req.user = decoded;
        next();
    });
};

const isDirecteur = (req, res, next) => {
    if (req.user && req.user.role === 'directeur') {
        console.log('Accès autorisé pour le rôle directeur');
        next();
    } else {
        console.log('Accès refusé. Seuls les directeurs peuvent effectuer cette action.');
        return res.status(403).json({ message: 'Accès refusé. Seuls les directeurs peuvent effectuer cette action.' });
    }
};

export { verifyToken, isDirecteur };