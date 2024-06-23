import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import { handlePolicies } from '../middleware/auth.middleware.js';

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

/**
* @swagger
* /api/users/forgotpassword:
*   post:
*      tags:
*        - Users
*      summary: Initiates the password reset process for a user
*      description: Allows a user to request a password reset link. The user must provide their registered email address to receive the password reset instructions.
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              required:
*                - email
*              properties:
*                email:
*                  type: string
*                  format: email
*                  description: The user's email address.
*      responses:
*        '200':
*          description: Password reset email sent successfully.
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  message:
*                    type: string
*                    example: Password reset email has been sent.
*        '400':
*          description: Bad request, such as missing email parameter.
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: Email is required.
*        '404':
*          description: User not found with the provided email.
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: User not found.
*        '500':
*          description: Internal server error.
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*                    example: An error occurred while processing the request.
*/
router.post("/resetpassword", usersController.forgotPassword)

/**
 * @swagger
 * /api/users/updatepassword:
 *   put:
 *     tags:
 *       - Users
 *     summary: Updates the user's password
 *     description: Allows a user to update their password. This typically follows a successful password reset request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               token:
 *                 type: string
 *                 description: The password reset token previously sent to the user's email.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user.
 *     responses:
 *       '200':
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your password has been updated successfully.
 *       '400':
 *         description: Bad request, such as missing parameters or parameters not meeting the requirements.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing parameters or parameters do not meet the requirements.
 *       '401':
 *         description: Unauthorized, such as invalid or expired token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or expired token.
 *       '404':
 *         description: User not found with the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while processing the request.
 */
router.post("/updatepassword/:token", usersController.updatePassword)

/**
 * @swagger
 * /api/users/togglepremium:
 *   put:
 *     tags:
 *       - Users
 *     summary: Toggles the premium status of a user
 *     description: Allows an admin to toggle the premium status of a user account. This endpoint should change the user's premium status from true to false or vice versa.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - adminId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user whose premium status is being toggled.
 *               adminId:
 *                 type: string
 *                 description: The ID of the admin performing the operation.
 *     responses:
 *       '200':
 *         description: Premium status toggled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User's premium status has been successfully toggled.
 *       '400':
 *         description: Bad request, such as missing parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing parameters or invalid request.
 *       '401':
 *         description: Unauthorized, such as invalid admin ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized or invalid admin ID.
 *       '404':
 *         description: User not found with the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while processing the request.
 */
router.post("/premium/:uid", handlePolicies(['ADMIN']), usersController.togglePremiumCtrl)

export default router;