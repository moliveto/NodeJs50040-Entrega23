import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: the auto-generated id of the user
 *         first_name:
 *           type: string
 *           description: the first name of the user
 *         last_name:
 *           type: string
 *           description: the last name of the user
 *         email:
 *           type: string
 *           description: the email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         Role:
 *           type: string
 *           description: The role of the user
 *       example:
 *         first_name: Juan 
 *         last_name: Perez
 *         email: juan@gmail.com
 *         password: 12345
 *         role: admin
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener todos los usuarios
 *     description: Obtiene todos los usuarios registrados en la base de datos
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '404':
 *         description: Recurso no encontrado
 */
router.get('/', usersController.getAllUsers);
/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Register a new user in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '404':
 *         description: Recurso no encontrado
 */
router.post('/', usersController.createUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '404':
 *         description: Recurso no encontrado
 */
router.get('/:uid', usersController.getUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user by ID
 *     description: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '404':
 *         description: Recurso no encontrado
 */
router.put('/:uid', usersController.updateUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user by ID
 *     description: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '404':
 *         description: Recurso no encontrado
 */
router.delete('/:uid', usersController.deleteUser);

router.post("/resetpassword", usersController.forgotPassword)

router.post("/updatepassword/:token", usersController.updatePassword)

export default router;