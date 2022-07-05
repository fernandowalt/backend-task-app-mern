/** @format */

import express from "express";
import checkAuth from "../middleware/checkAuth.js";

import { addTask, getTask, updateTask, deletedTask, statusTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/", checkAuth, addTask);
router.route("/:id").get(checkAuth, getTask).put(checkAuth, updateTask).delete(checkAuth, deletedTask);
router.post("/state/:id", checkAuth, statusTask);

export default router;
