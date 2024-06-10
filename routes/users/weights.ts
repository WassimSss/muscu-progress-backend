const {authenticateJWT} = require('../../modules/authenticateJWT');
import express from 'express';
const router = express.Router();
const {add, get, removeWeight} = require('../../controllers/users/weights');

router.post('/add', authenticateJWT, add);

router.get('/get', authenticateJWT, get)

router.delete('/:idWeight/remove', authenticateJWT, removeWeight)

module.exports = router;