const {authenticateJWT} = require('../../modules/authenticateJWT');
import express from 'express';
const router = express.Router();
const add = require('../../controllers/users/exercises');

router.post('/add', authenticateJWT, add);



module.exports = router;
