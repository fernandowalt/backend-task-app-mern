/** @format */

import express from "express";
import { createUser, authenticate, confirm, recoverPassword, checkToken, newPassword,profile} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", authenticate);
router.get("/confirm/:token", confirm);
router.post("/recoverPassword", recoverPassword);
router.route("/recoverPassword/:token").get(checkToken).post(newPassword);


router.get("/profile", checkAuth, profile);

export default router;
