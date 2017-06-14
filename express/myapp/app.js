var express = require('express');
var app = express();

//var connection = require('./psqlConnection.js');
app.set('views', __dirname  + '/views');
app.set('view engine', 'ejs');

var pg = require('pg');
//var connectionString = "postgres://postgres:postgres@localhost/test_1";

var config = {
		host:		'localhost',
		port:		'5432',
		database:	'test_1',
		user:		'postgres',
		password:	'postgres'
};

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//middleware リクエストが来た時に順次適用されるもの　書く順序に注意が必要。(書いた順番通りに適用される)
app.use(express.static(__dirname + '/public'));//静的ファイルを配信する
app.use(bodyParser());

app.get('/', function(req, res) {
	res.render(__dirname + '/views/index.ejs');
});

//ユーザ一覧画面へ遷移する
app.get('/list', function(req, res) {
	var client = new pg.Client(config);
	client.connect( function(err){
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		
		client.query('select id, name, tel, mailaddress from user_info;', function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
		/*	
			var i =0;
			for(var key in result.rows) {
				console.log(result.rows[i].id);
				console.log(result.rows[i].name);
				console.log(result.rows[i].mailaddress);
				i++;
			}
		*/
			res.render(__dirname + '/views/list.ejs', {items: result.rows });
		});
	});
});

/*
 ** 新規登録
 */
//ユーザ登録画面へ遷移する
app.get('/regist', function(req, res) {
	res.render(__dirname + '/views/regist.ejs');
});

//確認画面へ遷移する
app.post('/confirm', urlencodedParser, function(req, res) {
	var name = req.body.name;
	var tel = req.body.tel;
	var mailaddress = req.body.mailaddress;

	res.render(__dirname + '/views/confirm.ejs', {name: name, tel: tel,  mailaddress: mailaddress});
});

//完了画面へ遷移する
app.post('/complete', urlencodedParser, function(req, res) {
	console.log('start regist');
	var name = req.body.name;
	var tel = req.body.tel;
	var mailaddress = req.body.mailaddress;

	var client = new pg.Client(config);
	client.connect( function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		
		client.query('insert into user_info (name, tel, mailaddress) values (\'' + name + '\',\'' + tel + '\',\'' + mailaddress + '\');', function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			res.render(__dirname + '/views/complete.ejs');
		});
	});
	console.log('end regist');
});

/*
 ** 更新
 */
//編集画面へ遷移する
app.get('/update', urlencodedParser, function(req, res) {
	var id = req.query.id;
	var client = new pg.Client(config);
	client.connect( function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		
		client.query('select id, name, tel, mailaddress from user_info where id = ' + id + ';', function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			res.render(__dirname + '/views/update.ejs', {id: result.rows[0].id, name: result.rows[0].name, tel: result.rows[0].tel, mailaddress: result.rows[0].mailaddress});
		});
	});
});

//確認画面へ遷移する
app.post('/update/confirm', urlencodedParser, function(req, res) {
	var id = req.body.id;
	var name = req.body.name;
	var tel = req.body.tel;
	var mailaddress = req.body.mailaddress;
	
	var client = new pg.Client(config);
	client.connect( function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		
		client.query('update user_info set name=\'' + name + '\', tel=\'' + tel + '\', mailaddress=\'' + mailaddress + '\' where id=' + id + ';', function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			res.render(__dirname + '/views/update_confirm.ejs', {id: id, name: name, tel: tel, mailaddress: mailaddress});
		});
	});
});
		
	

//完了画面へ遷移する
app.post('/update/complete', urlencodedParser, function(req, res) {
	console.log('update start');
	var id = req.body.id;
	var name = req.body.name;
	var tel = req.body.tel;
	var mailaddress = req.body.mailaddress;
	
	var client = new pg.Client(config);
	client.connect( function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		
		client.query('update user_info set name=\'' + name + '\', tel=\'' + tel + '\', mailaddress=\'' + mailaddress + '\' where id=' + id + ';', function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			res.render(__dirname + '/views/update_complete.ejs');
		});
	});
	console.log('update end');
});

/*
 ** 削除
 */
//確認画面へ遷移する
app.get('/delete/confirm', urlencodedParser, function(req, res) {
	var id = req.query.id;
	var client = new pg.Client(config);
	client.connect( function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		
		client.query('select id, name, tel, mailaddress from user_info where id = ' + id + ';', function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			res.render(__dirname + '/views/delete_confirm.ejs', {id: result.rows[0].id, name: result.rows[0].name, tel: result.rows[0].tel, mailaddress: result.rows[0].mailaddress});
		});
	});
});

//完了画面へ遷移する
app.post('/delete/complete', urlencodedParser, function(req, res) {
	console.log('start delete');
	var id_value = req.body.id;
	var client = new pg.Client(config);
	client.connect( function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		
		client.query('delete from user_info where id = ' + id_value + ';', function(err, result) {
			if(err) {
				return console.error('error running query_1', err);
			}
			res.render(__dirname + '/views/delete_complete.ejs');
		});
	});
	console.log('end delete');
});


//トップページを表示する
app.use('/index', function(req, res) {
	res.render(__dirname + '/views/index.ejs');
});

app.use('/index2', function(req, res) {
	//var query = 'insert into user_info (name, mailaddress) values ("test", "test@ctech.co.jp");';
	//connection.query(query, function(err, rows) {
	//	alert('成功です');
	//});
});

app.use('/get', function(req, res) {
	var query = 'select * from user_info;';
	connection.query(query, function(err, rows) {
		console.log(rows);
		res.render('index', {
			title: 'テスト',
			boardList: rows
		});
	});
});
app.use('/chart', function(req, res) {
	res.render(__dirname + '/views/chart_testtest.ejs');
});

app.use('/result1', function(req, res) {
	res.render(__dirname + '/views/chart_testtest.ejs');
});

app.use('/result2', function(req, res) {
	res.render(__dirname + '/views/chart_testtest2.ejs');
});

app.use('/result3', function(req, res) {
	res.render(__dirname + '/views/chart_testtest3.ejs');
});

app.use('/book/:id', function(req, res) {
	res.send('ID:' + req.params.id);
});

app.use('/test', function(req, res) {
	res.send('hello world!');
});

app.use('/about', function(req, res) {
	res.send('about this page');
});

app.use('/hello.txt', function(req, res) {
	res.sendfile(__dirname + '/public/hello.txt');
});

app.use(function(req, res, next) {
	console.log("my custom middleware");
	next();//次のミドルウェアに移るための関数
});
app.listen(3000);
console.log("server starting...");

