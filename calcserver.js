var http 		= require('http'),
	express		= require('express');

var PORT = 8080;

var app = express();

app.use('/', express.static('./public'));

app.listen( PORT );

