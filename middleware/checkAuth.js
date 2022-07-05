/** @format */

import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

/** @format */

const checkAuth = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const { id } = decoded;
			//aqui a req se le asigna un user que luego el otro middleware podra acceder
			req.user = await Usuario.findById(id).select("-password -confirmed -token -createdAt -updatedAt -__v");

			return next();
		} catch (error) {
			return res.status(404).json({ msg: "hubo un error" });
		}
	}
	if (!token) {
		const error = new Error("Token no valido");

		return res.status(401).json({ msg: error.message });
	}

	next();
};

export default checkAuth;
