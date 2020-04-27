const {connect, saveToken, followers, rubric} = require('../controllers/RubricController');
const auth = require('../middleware/auth');
const router = require('express').Router();

router.get('/connect', connect);
router.get('/saveTokens', saveToken);
router.get('/followers', auth, followers);
router.get('/:id/rubric.json', auth, rubric);


module.exports = router;
