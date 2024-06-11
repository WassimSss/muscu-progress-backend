const {authenticateJWT} = require('../../modules/authenticateJWT');
import express from 'express';
const router = express.Router();
const {get} = require('../../controllers/users/exercises');

router.get('/get/:idMuscleGroup', authenticateJWT, get)



module.exports = router;
