const {authenticateJWT} = require('../../modules/authenticateJWT');
import express = require('express');
const router = express.Router();
const {get, choose} = require('../../controllers/users/programs');

router.get('/get', authenticateJWT, get);

router.post('/choose', authenticateJWT, choose)




module.exports = router;
