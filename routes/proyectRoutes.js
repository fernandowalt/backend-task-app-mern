import express from "express";
import {
	getProjects,
	newProject,
	getProject,
	editproject,
	deleteproject,
	addCollaborator,
	deleteCollaborator,
	searchCollaborator
} from "../controllers/proyectController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getProjects).post(checkAuth, newProject);
router.route("/:id").get(checkAuth, getProject).put(checkAuth, editproject).delete(checkAuth, deleteproject);
router.post("/collaborators", checkAuth, searchCollaborator);
router.post("/collaborators/:id", checkAuth, addCollaborator);
router.post("/delete-collaborator/:id", checkAuth, deleteCollaborator);


export default router;
