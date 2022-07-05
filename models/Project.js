/** @format */

import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},

		description: {
			type: String,
			trim: true,
			required: true,
		},

		dateOfDelivery: {
			type: Date,
			default: Date.now(),
		},

		client: {
			type: String,
			trim: true,
			required: true,
		},

		creator: {
			//aqui hace referencia a el id de el model Usuario, se estan relacionando con el id
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],

		collaborators: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

const project = mongoose.model("project", projectSchema);

export default project;
