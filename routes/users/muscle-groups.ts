const {authenticateJWT} = require('../../modules/authenticateJWT');
import express from 'express';
const router = express.Router();
const addMuscleGroup = require('../../controllers/exercises/muscle-groups');

router.post('/add', authenticateJWT, addMuscleGroup);



module.exports = router;
