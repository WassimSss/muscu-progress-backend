const {authenticateJWT} = require('../../modules/authenticateJWT');
const {authorizeRoles} = require('../../modules/authorizeRoles');
import express from 'express';
const router = express.Router();
const {addExercise, deleteExercise, addMuscleGroup, deleteMuscleGroup } = require('../../controllers/admin/data-app');

router.post('/exercise/add', authenticateJWT, addExercise)

router.delete('/exercise/delete/:idExercise', authenticateJWT, deleteExercise)

router.post('/muscle-group/add', authenticateJWT, authorizeRoles('ROLE_ADMIN'), addMuscleGroup)

router.delete('/muscle-group/delete/:idMuscleGroup', authenticateJWT, authorizeRoles('ROLE_ADMIN'), deleteMuscleGroup)
module.exports = router;
