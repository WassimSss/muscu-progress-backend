const {authenticateJWT} = require('../../modules/authenticateJWT');
const express = require('express');
const router = express.Router();
const addMuscleGroup = require('../../controllers/exercises/muscle-groups');

router.post('/add', authenticateJWT, addMuscleGroup);



module.exports = router;
