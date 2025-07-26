import bcrypt from 'bcrypt';

const password = "Admin"; // 🔹 Mets ici le mot de passe que tu veux utiliser
// Mot de passe hashé : $2b$10$QUKxClVEwUxRYTteDLjzmeytoNkHH7NwHJ0zYe1ibcTP8slCzKxie

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error("Erreur de hash :", err);
    } else {
        console.log("Mot de passe hashé :", hash);
    }
});


