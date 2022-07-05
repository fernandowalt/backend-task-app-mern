/** @format */

import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
	const { project } = req.body;

	const existeProyecto = await Project.findById(project);

	if (!existeProyecto) {
		const error = new Error("el proyecto no existe");
		return res.status(404).json({ msg: error.message });
	}
	if (existeProyecto.creator.toString() !== req.user._id.toString()) {
		const error = new Error("no tienes los permisos solicitados");
		return res.status(403).json({ msg: error.message });
	}

	try {
		const tareasAlmacenada = await Task.create(req.body);
		existeProyecto.tasks.push(tareasAlmacenada._id);
		await existeProyecto.save();

		res.json(tareasAlmacenada);
	} catch (error) {
		console.log(error);
	}
};
const getTask = async (req, res) => {
	const { id } = req.params;
	const task = await Task.findById(id).populate("project");

	if (!task) {
		const error = new Error("tarea no encontrada");
		res.status(404).json({ msg: error.message });
	}

	if (task.project.creator.toString() !== req.user._id.toString()) {
		const error = new Error("Accion no valida");
		res.status(403).json({ msg: error.message });
	}

	res.json(task);
};
const updateTask = async (req, res) => {
	const { id } = req.params;
	const modifications = req.body;
	const task = await Task.findById(id).populate("project");

	if (!task) {
		const error = new Error("tarea no encontrada");
		res.status(404).json({ msg: error.message });
	}

	if (task.project.creator.toString() !== req.user._id.toString()) {
		const error = new Error("Accion no valida");
		res.status(403).json({ msg: error.message });
	}

	task.name = modifications.name || task.name;
	task.description = modifications.description || task.description;
	task.priority = modifications.priority || task.priority;
	task.dateOfDelivery = modifications.dateOfDelivery || task.dateOfDelivery;

	try {
		const updatedTask = await task.save();
		res.json(updatedTask);
	} catch (error) {
		console.log(error);
	}
};
const deletedTask = async (req, res) => {
	const { id } = req.params;
	const task = await Task.findById(id).populate("project");

	if (!task) {
		const error = new Error("tarea no encontrada");
		res.status(404).json({ msg: error.message });
	}

	if (task.project.creator.toString() !== req.user._id.toString()) {
		const error = new Error("Accion no valida");
		res.status(403).json({ msg: error.message });
	}

	try {
		const project = await Project.findById(task.project);
		project.tasks.pull(task._id);
		await Promise.allSettled([await project.save(), await task.deleteOne()]);

		res.json({ msg: "tarea eliminada" });
	} catch (error) {
		console.log(error);
	}
};
const statusTask = async (req, res) => {
	const { id } = req.params;

	const task = await Task.findById(id).populate("project");

	if (!task) {
		const error = new Error("tarea no encontrada");
		return res.status(404).json({ msg: error.message });
	}
	if (
		task.project.creator.toString() !== req.user._id.toString() &&
		!task.project.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())
	) {
		const error = new Error("Accion no valida");
		return res.status(403).json({ msg: error.message });
	}

	task.state = !task.state;
	task.complete = req.user._id;
	await task.save();

	const storedTask = await Task.findById(id).populate("project").populate("complete");

	res.json(storedTask);
};

export { addTask, getTask, updateTask, deletedTask, statusTask };
