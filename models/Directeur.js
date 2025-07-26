import db from '../config/db.js';

export const createDirecteur = (directeurData, callback) => {
    const { nom, email, mot_de_passe, telephone, profile_picture } = directeurData;
    const sql = 'INSERT INTO directeurs (nom, email, mot_de_passe, telephone, profile_picture) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nom, email, mot_de_passe, telephone || null, profile_picture || null], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

export const getDirecteurByEmail = (email, callback) => {
    const sql = 'SELECT * FROM directeurs WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

export const getAllDirecteursFromDB = (callback) => {
    const sql = 'SELECT id_directeur, nom, email, telephone, profile_picture FROM directeurs';
    db.query(sql, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};