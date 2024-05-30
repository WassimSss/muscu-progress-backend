const {authenticateJWT} = require('../../modules/authenticateJWT');
const express = require('express');
const router = express.Router();
const addExercise = require('../../controllers/exercises/exercises');

router.post('/add', authenticateJWT, addExercise);



module.exports = router;
