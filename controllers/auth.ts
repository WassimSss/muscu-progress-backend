
// controllers/auth.js
const { body, validationResult } = require('express-validator');
const {User} = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import { IUser } from '../models/users';

exports.signup = [
	// Vérification pour email
	body('email').isEmail().withMessage('Veuillez entrer un email valide.'),
	// Vérification pour password
	body('password')
		.isLength({ min: 6, max: 24 })
		.withMessage('Le mot de passe doit comporter entre 6 et 24 caractères.')
		.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/, 'i')
		.withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.'),
	body('confirmPassword').custom((value : string, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Les mots de passe ne correspondent pas.');
		}
		return true;
	}),

	async (req : Request, res : Response) => {

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ result: false, errors: errors.array() });
		}

		const { email, password, confirmPassword }: {email : string, password: string, confirmPassword: string} = req.body;

		// Regarde si les mots de passe correspondent
		if (password !== confirmPassword) {
			return res.status(400).json({ result: false, message: 'Les mots de passe ne correspondent pas.' });
		}

		try {
			// Regarde si l'utilisateur existe déjà
			let user: IUser = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ result: false, message: 'Un utilisateur avec cet email existe déjà.' });
			}

			// Crée un nouvel utilisateur

			// Hache le mot de passe
			const hashedPassword: string = await bcrypt.hash(password, 10);

			user = new User({
				email,
				password: hashedPassword,
				roles: ['ROLE_FREE']
			});

			// Sauvegarde l'utilisateur dans la base de données
			await user.save();

			console.log("user roles : ", user.roles)
			const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

			res.status(201).json({ result: true, message: 'Utilisateur enregistré avec succès.', token });
		} catch (error) {
			console.log(error)
			res.status(500).json({ result: false, message: "Erreur lors de l'enregistrement de l'utilisateur." });
		}
	}
];

exports.signin = [
	body('email').isLength({ min: 1 }).withMessage("L'email est requis."),
	body('password').isLength({ min: 1 }).withMessage('Le mot de passe est requis.'),
	// .isLength({ min: 6, max: 24 })
	// .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/, 'i')
	// .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.'),
	async (req : Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ result: false, errors: errors.array() });
		}

		try {
			const { email, password }: {email: string, password: string} = req.body;

			const user : IUser = await User.findOne({ email: email });

			if (!user) {
				return res.status(400).json({ result: false, message: "L'email ou le mot de passe est incorrect." });
			}

			if (!bcrypt.compareSync(password, user.password)) {
				return res.status(400).json({ result: false, message: "L'email ou le mot de passe est incorrect." });
			}

			const token : string = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET_KEY /*, { expiresIn: '1h' }*/);

			return res.status(201).json({ result: true, token, roles: user.roles });
		} catch (error) {
			res.status(500).json({ result: false, message: 'Erreur lors de la connexion' });
		}
	}
];


