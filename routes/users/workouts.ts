const {authenticateJWT} = require('../../modules/authenticateJWT');
const express = require('express');
const router = express.Router();
const {add, get, removeSet} = require('../../controllers/users/workouts');

router.post('/add', authenticateJWT, add);

router.get('/get', authenticateJWT, get);

router.delete('/sets/:idSet/remove', authenticateJWT, removeSet)



module.exports = router;
