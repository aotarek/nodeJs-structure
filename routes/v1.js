const express = require('express');
const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');
const multer = require('../config/multer.config');
const ArticleController = require('../controllers/article.controller');
const AuthController = require('../controllers/auth.controller');
const router = express.Router();

//********* API Routes **********

/**
 * @swagger
 *
 * /auth/signin:
 *   post:
 *     tags: ['user']
 *     summary: User Sign in
 *     description: Returns Bearer Token for JWT authentication
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email to use for login.
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Logged In Successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Unprocessable entity
 */
router.post('/auth/signin', AuthController.signIn);

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     tags: ['user']
 *     summary: User Sign up
 *     description: Returns Bearer Token for JWT authentication
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email to use for login.
 *         in: body
 *         required: true
 *         type: string
 *       - name: firstName
 *         description: user name.
 *         in: body
 *         required: true
 *         type: string
 *       - name: firstName
 *         description: user name.
 *         in: body
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: user name.
 *         in: body
 *         required: true
 *         type: string
 *       - name: phone
 *         description: user name.
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: body
 *         required: true
 *         type: string
 *       - name: confirmed_password
 *         description: User's password confirmation.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Logged In Successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Unprocessable entity
 */
router.post('/auth/register', AuthController.signUp);

/**
 * @swagger
 *
 * /auth/logout:
 *   post:
 *     tags: ['user']
 *     summary: User Sign out
 *     description: Returns success message
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Logged Out Successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/auth/logout',
  auth.required,
  auth.unauthorizedErrorHundler,
  AuthController.logOut
);

/**
 * @swagger
 *
 * /auth/authenticated:
 *   post:
 *     tags: ['user']
 *     summary: User token verification
 *     description: Returns the authenticated user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User still authenticated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource doesn’t exist
 *
 */
router.get(
  '/auth/authenticated',
  auth.required,
  auth.unauthorizedErrorHundler,
  AuthController.isAuthenticated
);

router.post(
  '/articles',
  auth.required,
  auth.unauthorizedErrorHundler,
  multer.single('image'),
  ArticleController.create
);
router.get(
  '/articles',
  auth.required,
  auth.unauthorizedErrorHundler,
  ArticleController.getAll
);
router.delete(
  '/articles',
  auth.required,
  auth.unauthorizedErrorHundler,
  ArticleController.removeAll
);
router.put(
  '/articles',
  auth.required,
  auth.unauthorizedErrorHundler,
  ArticleController.putAllNotAllowed
);

router.get(
  '/articles/:articleId',
  auth.required,
  auth.unauthorizedErrorHundler,
  ArticleController.get
);
router.post(
  '/articles/:articleId',
  auth.required,
  auth.unauthorizedErrorHundler,
  ArticleController.postNotAllowed
);
router.put(
  '/articles/:articleId',
  auth.required,
  auth.unauthorizedErrorHundler,
  multer.single('image'),
  ArticleController.update
);
router.delete(
  '/articles/:articleId',
  auth.required,
  auth.unauthorizedErrorHundler,
  ArticleController.remove
);

module.exports = router;
