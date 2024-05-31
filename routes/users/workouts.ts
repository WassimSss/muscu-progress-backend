const {authenticateJWT} = require('../../modules/authenticateJWT');
const express = require('express');
const router = express.Router();
const {add, get} = require('../../controllers/users/workouts');

router.post('/add', authenticateJWT, add);

router.post('/get', authenticateJWT, get);



module.exports = router;
