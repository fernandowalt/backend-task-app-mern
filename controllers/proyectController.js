/** @format */

import Project from "../models/Project.js";
import Usuario from "../models/Usuario.js";

const getProjects = async (req, res) => {
	//id = string

	const projectosDeusuario = await Project.find({ $or: [{ collaborators: { $in: req.user } }, { creator: { $in: req.user } }] }).select("-tasks");

	res.json(projectosDeusuario);
};
const newProject = async (req, res) => {
	const project = new Project(req.body);
	project.creator = req.user._id;

	try {
		const storedProject = await project.save();

		res.json(storedProject);
	} catch (error) {
		console.log(error);
	}
};
const getProject = async (req, res) => {
	const { id } = req.params;
	const project = await Project.findById(id)
		.populate({ path: "tasks", populate: { path: "complete", select: "name" } })
		.populate("collaborators", "name email");

	if (!project) {
		const error = new Error("no encontrado");
		return res.status(404).json({ msg: error.message });
	}

	if (
		project.creator.toString() !== req.user._id.toString() &&
		!project.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())
	) {
		const error = new Error("accion no valida");
		return res.status(401).json({ msg: error.message });
	}

	//obtener las tareas de un proyecto

	res.json(project);
};
const editproject = async (req, res) => {
	const { id } = req.params;
	const project = await Project.findById(id);

	if (!project) {
		const error = new Error("no encontrado");
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error("accion no valida");
		return res.status(401).json({ msg: error.message });
	}

	project.name = req.body.name || project.nombre;
	project.description = req.body.description || project.description;
	project.dateOfDelivery = req.body.dateOfDelivery || project.dateOfDelivery;
	project.client = req.body.client || project.client;

	try {
		const updatedProject = await project.save();
		res.json(updatedProject);
	} catch (error) {
		console.log(error);
	}
};
const deleteproject = async (req, res) => {
	const { id } = req.params;
	const project = await Project.findById(id);

	if (!project) {
		const error = new Error("no encontrado");
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error("accion no valida");
		return res.status(401).json({ msg: error.message });
	}

	try {
		await project.deleteOne();
		res.json({ msg: "projecto eliminado" });
	} catch (error) {
		console.log(error);
	}
};
const searchCollaborator = async (req, res) => {
	const { email } = req.body;

	const user = await Usuario.findOne({ email }).select("-confirmed -password -token -createdAt -updatedAt -__v ");

	if (!user) {
		const error = new Error("usuario no encontrado");
		return res.status(404).json({ msg: error.message });
	}

	res.json(user);
};

const addCollaborator = async (req, res) => {
	const project = await Project.findById(req.params.id);

	if (!project) {
		const error = new Error("Projecto no encontrado");
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error("Acción no permitida");
		return res.status(404).json({ msg: error.message });
	}

	const { email } = req.body;

	const user = await Usuario.findOne({ email }).select("-confirmed -password -token -createdAt -updatedAt -__v ");

	if (!user) {
		const error = new Error("usuario no encontrado");
		return res.status(404).json({ msg: error.message });
	}
	//comprobando que el colaborador no sea el mismo creador del proyecto
	if (project.creator.toString() === user._id.toString()) {
		const error = new Error("el creador del proyecto no puede estar en la lista de colaboradores");
		return res.status(404).json({ msg: error.message });
	}

	//comprobando que el colaborador no este agregado ya al proyecto

	if (project.collaborators.includes(user._id)) {
		const error = new Error("el usuario ya esta agregado a la lista de colaboradores");
		return res.status(404).json({ msg: error.message });
	}

	// TTodo ok
	project.collaborators.push(user._id);
	await project.save();
	res.json({ msg: "colaborador agregado exitosamente" });
};

const deleteCollaborator = async (req, res) => {
	const project = await Project.findById(req.params.id);

	if (!project) {
		const error = new Error("Projecto no encontrado");
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error("Acción no permitida");
		return res.status(404).json({ msg: error.message });
	}

	// eliminar colaborador

	project.collaborators.pull(req.body.id);
	console.log(project);

	await project.save();
	res.json({ msg: "colaborador eliminado exitosamente" });
};

export { getProjects, newProject, getProject, editproject, deleteproject, addCollaborator, deleteCollaborator, searchCollaborator };
