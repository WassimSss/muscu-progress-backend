const {authenticateJWT} = require('../../modules/authenticateJWT');
const express = require('express');
const router = express.Router();
const {add, get, removeSet, getWorkedDaysInMonth} = require('../../controllers/users/workouts');

router.post('/add', authenticateJWT, add);

router.get('/get', authenticateJWT, get);

router.get('/get/worked-days/:month/:year', authenticateJWT, getWorkedDaysInMonth);

router.delete('/sets/:idSet/remove', authenticateJWT, removeSet)



module.exports = router;
