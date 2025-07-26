import db from '../config/db.js';

export const createHopital = (hopital, callback) => {
    const sql = 'INSERT INTO hopitaux (nom, email, mot_de_passe) VALUES (?, ?, ?)';
    db.query(sql, [hopital.nom, hopital.email, hopital.mot_de_passe], callback);
};

export const getHopitalByEmail = (email, callback) => {
    const sql = 'SELECT * FROM hopitaux WHERE email = ?';
    db.query(sql, [email], callback);
};

export const getAllHopitauxFromDB = (callback) => {
    const sql = 'SELECT id_hopital, nom, adresse, telephone, email, profile_picture, pays_id, ville_id, registration_date, statut FROM hopitaux';
    db.query(sql, (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};