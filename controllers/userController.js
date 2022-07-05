/** @format */

import { emailRegister, EmailNewPassword } from "../helpers/email.js";
import generateId from "../helpers/generateId.js";
import generateJwt from "../helpers/generateJWT.js";
import Usuario from "../models/Usuario.js";

const users = (req, res) => {
	res.json({ msg: "desde api/usuario" });
};

const createUser = async (req, res) => {
	//avitando registros de email duplicados

	const { email } = req.body;
	const existeUsuario = await Usuario.findOne({ email });

	if (existeUsuario) {
		const error = new Error("Usuario ya registrado");

		return res.status(400).json({ msg: error.message });
	}

	try {
		const usuario = new Usuario(req.body);
		usuario.token = generateId();
		await usuario.save();

		//enviar correo de verificacion
		const { email, name, token } = usuario;
		emailRegister({ email, name, token });

		res.status(200).json({ msg: "Usuario Creado correctamente, por favor revisa tu email para confirma tu cuenta" });
	} catch (error) {
		console.log(error.response);
	}
};

const authenticate = async (req, res) => {
	const { email, password } = req.body;
	const usuario = await Usuario.findOne({ email });

	if (!usuario) {
		const error = new Error("el usuario no existe");

		return res.status(404).json({ msg: error.message });
	}

	if (!usuario.confirmed) {
		const error = new Error("tu cuenta no ha sido confirmada");

		return res.status(403).json({ msg: error.message });
	}

	if (await usuario.checkPassword(password)) {
		res.status(200).json({
			_id: usuario.id,
			name: usuario.name,
			email: usuario.email,
			token: generateJwt(usuario.id),
		});
	} else {
		const error = new Error("el password es incorrecto");
		return res.status(403).json({ msg: error.message });
	}
};

const confirm = async (req, res) => {
	const { token } = req.params;
	const userConfirm = await Usuario.findOne({ token });

	if (!userConfirm) {
		const error = new Error("Token no valido");
		return res.status(403).json({ msg: error.message });
	}

	try {
		userConfirm.confirmed = true;
		userConfirm.token = "";
		await userConfirm.save();
		res.json({ msg: "Usuario confirmado correctamente" });
	} catch (error) {
		console.log(error);
	}
};

const recoverPassword = async (req, res) => {
	const { email } = req.body;

	const user = await Usuario.findOne({ email });

	if (!user) {
		const error = new Error("el usuario no existe");
		return res.status(404).json({ msg: error.message });
	}
	try {
		user.token = generateId();
		await user.save();

		const { name, email, token } = user;
		EmailNewPassword({ name, email, token });

		return res.json({ msg: "revisa tu cuenta de correo electronico para confirmar la generacion de una nueva contraseña" });
	} catch (error) {
		console.log(error);
	}
};

const checkToken = async (req, res) => {
	const { token } = req.params;

	const validToken = await Usuario.findOne({ token });

	if (validToken) {
		return res.json({ msg: "token valido" });
	} else {
		const error = new Error("Token no valido");
		return res.status(404).json({ msg: error.message });
	}
};

const newPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	const user = await Usuario.findOne({ token });

	if (user) {
		user.password = password;
		user.token = "";

		await user.save();
		res.json({ msg: "password modificado exitosamente" });
	} else {
		const error = new Error("Token no valido");
		return res.status(404).json({ msg: error.message });
	}
};

const profile = async (req, res) => {
	const { user } = req;

	res.json(user);
};

export { users, createUser, authenticate, confirm, recoverPassword, checkToken, newPassword, profile };
