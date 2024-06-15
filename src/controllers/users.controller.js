import { usersService } from "../services/index.js"
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET, JWT_RESET_EXPIRE_IN, CLIENT_URL } from "../config/config.js";
import { transporter } from "../utils/email.js"
import { createHashValue, isValidPasswd } from "../utils/encrypt.js";

const getAllUsers = async (req, res) => {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users })
}

const createUser = async (req, res) => {
    const user = req.body;
    const newUser = await usersService.create(user);
    res.send({ status: "success", message: "User created", payload: newUser })
}

const getUser = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" })
    res.send({ status: "success", payload: user })
}

const updateUser = async (req, res) => {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" })
    const result = await usersService.update(userId, updateBody);
    res.send({ status: "success", message: "User updated" })
}

const deleteUser = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersService.delete(userId);
    res.send({ status: "success", message: "User deleted" })
}

const forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await usersService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    let token = jsonwebtoken.sign(
        user,
        JWT_SECRET,
        { expiresIn: JWT_RESET_EXPIRE_IN });

    const message = {
        to: email,
        subject: 'Reset Account Password Link',
        html: `
        <h3>Por favor, ingresa al link para cambiar tu contraseña</h3>
        <p>${CLIENT_URL}/updatePassword/${token}"</p>
        `,
    };

    user.resetLink = token;

    const result = await usersService.update(user._id, user);

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log('Error al enviar correo:', error);
            return res.status(400).json({ error: error.message })
        } else {
            console.log('Correo enviado correctamente:', info.messageId);
            return res.status(200).json({ message: 'El correo fue enviado sigue las instrucciones' })
        }
    });
}

const updatePassword = async (req, res) => {
    const resetLink = req.params.token
    const { newPassword } = req.body;
    if (resetLink) {
        jsonwebtoken.verify(resetLink, JWT_SECRET, async function (error, decodedData) {
            if (error) {
                return res.status(401).json({
                    error: 'El token ha expirado'
                });
            }
            const user = await usersService.getUserById(decodedData._id);
            if (!user) return res.status(404).send({ status: "error", error: "User not found" });
            const pswHashed = await createHashValue(newPassword);
            user.password = await pswHashed;
            user.resetLink = '';
            const result = await usersService.update(user._id, user);
            return res.status(200).json({ message: 'La contraseña ha sido actualizada' });
        });
    } else {
        return res.status(401).json({ error: 'Autenticación fallida' });
    }
}


export default {
    deleteUser,
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    forgotPassword,
    updatePassword
}