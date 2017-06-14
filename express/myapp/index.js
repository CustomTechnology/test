var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('views/index.ejs', { title: 'Express' });
});

router.post('/', function(req, res, next) {
	var title = req.body.title;
	console.log(title);
});

module.exports = router;