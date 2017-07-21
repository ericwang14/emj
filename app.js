
// builtin
var fs = require('fs');

// 3rd party
var express = require('express');
var hbs = require('hbs');

var app = express();

//hbs.registerPartial('partial', fs.readFileSync(__dirname + '/views/partial.hbs', 'utf8'));
hbs.registerPartials(__dirname + '/views/partials');

// set the view engine to use handlebars
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

app.get('/self-serve/create-account', function(req, res) {
    res.render('index');
});

app.get('/self-serve/login', function(reg, res) {
    res.render('index');
});

app.listen(3000, function() {
        console.log('Express started in ' + app.get('env') + ' mode on http://localhost:3000' + 
            ' Press Ctrl+C to terminate.');
    });

