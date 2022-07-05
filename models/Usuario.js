/** @format */

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userschema = mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
			trim: true,
		},
		password: {
			type: String,
			require: true,
			trim: true,
		},
		email: {
			type: String,
			require: true,
			trim: true,
			unique: true,
		},
		token: {
			type: String,
		},
		confirmed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);
userschema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userschema.methods.checkPassword = async function (formPassword) {
	return await bcrypt.compare(formPassword, this.password);
};

const User = mongoose.model("User", userschema);

export default User;
