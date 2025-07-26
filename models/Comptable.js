import db from '../config/db.js';

// Création d'un comptable avec `id_hopital` comme clé étrangère
export const createComptable = (comptableData, callback) => {
    const { nom, email, mot_de_passe, id_hopital } = comptableData;
    const sql = 'INSERT INTO comptables (nom, email, mot_de_passe, id_hopital) VALUES (?, ?, ?, ?)';

    db.query(sql, [nom, email, mot_de_passe, id_hopital], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// Récupération d'un comptable par email
export const getComptableByEmail = (email, callback) => {
    const sql = 'SELECT * FROM comptables WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// Récupération de tous les comptables avec `id_comptable` et `id_hopital`
export const getAllComptablesFromDB = (callback) => {
    const sql = 'SELECT id_comptable, nom, email, id_hopital FROM comptables';
    db.query(sql, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};
