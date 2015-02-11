var express = require('express');

var app = express();

//setup the handlebars view engine
var handlebars = require('express3-handlebars')
            .create({ defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

var fortunes = [
    "Conquer your fears or they will conquer you",
    "Rivers needs springs",
    "Do not fear what you don't know",
    "You will have a pleasant surprise",
    "Whenever possible, keep it simple",
];

//routes
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.render('home');
});
app.use(express.static(__dirname + '/public'));
app.get('/about', function(req, res){
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {fortune: randomFortune});
});
app.use(express.static(__dirname + '/public'));
//custom 404 page
app.use(function(req, res){
    res.status(404);
    res.render('404');
});
app.use(express.static(__dirname + '/public'));
//custom 500 page
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
   console.log('Express started on http://localhost:' + 
                app.get('port') + '; press Ctrl+c to terminate'); 
});