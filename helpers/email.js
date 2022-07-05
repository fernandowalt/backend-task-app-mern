/** @format */

import nodemailer from "nodemailer";

//TODO: Mover-hacia-variables-de-entorno
//? nuevas afirmaciones
//! deprecation
//* importar informacion

export const emailRegister = async data => {
	const { name, email, token } = data;

	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	//informacion del email
	await transport.sendMail({
		from: '"UpTask"<cuentas@uptask.com>',
		to: email,
		subject: "UpTask-confirma tu cuenta",
		text: "Confirmción de cuenta",
		html: `
    <p>Hola: ${name}, por favor comprueba tu cuenta</p><br/>
    <P>As click en el siguiente enlace para comfirmar: <a href="${process.env.FRONTEND_URL}/confirm/${token}">Comprobar Cuenta</a></P><br/>
    <p>Si tu no creaste esta cuenta,puedes ignorar el mensaje</p>

    `,
	});
};

export const EmailNewPassword = async data => {
	const { name, email, token } = data;

	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	await transport.sendMail({
		from: '"UpTask"<cuentas@uptask.com>',
		to: email,
		subject: "UpTask-confirma tu cuenta",
		text: "Reestablece tu contraseña",
		html: `
    <p>Hola: ${name}</p><br/>
    <P>As click en el siguiente enlace para reestablecer la contraseña: <a href="${process.env.FRONTEND_URL}/new-password/${token}">Nuevo password</a></P><br/>
    <p>Si tu no solicitaste el reestablecimiento de la contraseña,puedes ignorar el mensaje</p>

    `,
	});
};
