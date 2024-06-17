const {authenticateJWT} = require('../../modules/authenticateJWT');
import express from 'express';
const router = express.Router();
const {calcul} = require('../../controllers/users/calories');

router.post('/calcul', authenticateJWT, calcul);

module.exports = router;