import express from "express";
import { loginDirecteur, updateProfile } from "../controllers/authDirecteurController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Importe le middleware

const router = express.Router();

router.post("/login", loginDirecteur);
router.put("/profile", verifyToken, updateProfile); // Ajoute verifyToken comme middleware

export default router;