const {authenticateJWT} = require('../../modules/authenticateJWT');
const express = require('express');
const router = express.Router();
const add = require('../../controllers/users/workouts');

router.post('/add', authenticateJWT, add);



module.exports = router;
