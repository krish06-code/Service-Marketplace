const express = require('express');
const router = express.Router();
const { search, suggest, describeAndMatch } = require('../controllers/searchController');

router.get('/', search);
router.get('/suggest', suggest);
router.get('/suggestions', suggest);
router.post('/describe', describeAndMatch);

module.exports = router;
