const {authenticateJWT} = require('../../modules/authenticateJWT');
import express from 'express';
const router = express.Router();
const {add, get} = require('../../controllers/users/exercises');

router.post('/add', authenticateJWT, add);

router.get('/get/:idMuscleGroup', authenticateJWT, get)



module.exports = router;
