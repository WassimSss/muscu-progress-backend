const {authenticateJWT} = require('../../modules/authenticateJWT');
import express = require('express');
const router = express.Router();
const {get} = require('../../controllers/users/programs');

router.get('/get', authenticateJWT, get);

// router.get('/get/:date', authenticateJWT, get);

// router.get('/get/worked-days/:month/:year', authenticateJWT, getWorkedDaysInMonth);

// router.delete('/sets/:idSet/remove', authenticateJWT, removeSet)




module.exports = router;
