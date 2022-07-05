/** @format */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/proyectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();
conectarDB();

//configurar cors
const whiteList = [process.env.FRONTEND_URL];

const corsOptios = {
	origin: function (origin, callback) {
		if (whiteList.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Error de Cors"));
		}
	},
};

app.use(cors(corsOptios));
//Routing
app.use("/api/usuarios", userRoutes);
app.use("/api/proyectos", projectRoutes);
app.use("/api/tareas", taskRoutes);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

//socket.io
import { Server } from "socket.io";
const io = new Server(server, { pingTimeout: 60000, cors: { origin: process.env.FRONTEND_URL } });
io.on("connection", socket => {
	console.log("Conecectado a socket.io");

	//definiendo eventos socket io
	socket.on("abrir proyecto", projectId => {
		socket.join(projectId);
	});

	socket.on("nueva tarea", tarea => {
		socket.to(tarea.project).emit("tarea agregada", tarea);
	});
	socket.on("eliminar tarea", tarea => {
		if (tarea.complete !== undefined) {
			const tarea1 = {
				name: tarea.name,
				description: tarea.description,
				state: tarea.state,
				dateOfDelivery: tarea.dateOfDelivery,
				priority: tarea.priority,
				project: tarea.project._id,
				_id: tarea._id,
				createdAt: tarea.createdAt,
				updatedAt: tarea.updatedAt,
			};
			socket.to(tarea.project._id).emit("tarea eliminada", tarea1);
		} else {
			socket.to(tarea.project).emit("tarea eliminada", tarea);
		}
	});
	socket.on("editar tarea", tarea => {
		socket.to(tarea.project._id).emit("tarea editada", tarea);
	});
	socket.on("cambiar estado", task => {
		socket.to(task.project._id).emit("estado cambiado", task);
	});
});
