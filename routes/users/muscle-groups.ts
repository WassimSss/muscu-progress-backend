const {authenticateJWT} = require('../../modules/authenticateJWT');
import express from 'express';
const router = express.Router();
const {get} = require('../../controllers/users/muscle-groups');

router.get('/get', authenticateJWT, get)

module.exports = router;
