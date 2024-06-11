const {authenticateJWT} = require('../../modules/authenticateJWT');
const {authorizeRoles} = require('../../modules/authorizeRoles');
import express from 'express';
const router = express.Router();
const {addExercise, addMuscleGroup} = require('../../controllers/admin/data-app');

router.post('/exercise/add', authenticateJWT, addExercise)

router.post('/muscle-groups/add', authenticateJWT, authorizeRoles('ROLE_ADMIN'), addMuscleGroup)

module.exports = router;
