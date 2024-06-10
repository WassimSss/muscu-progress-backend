const {authenticateJWT} = require('../../modules/authenticateJWT');
import express from 'express';
const router = express.Router();
const {add, get} = require('../../controllers/users/muscle-groups');

router.post('/add', authenticateJWT, add);

router.get('/get', authenticateJWT, get)



module.exports = router;