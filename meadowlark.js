var express = require('express');
var fortune = require('./lib/fortune.js');
var formidable = require('formidable');
var nodemailer = require('nodemailer');

var app = express();

//setup the handlebars view engine
var handlebars = require('express3-handlebars')
            .create({
                defaultLayout:'main',
                helpers: {
                    section: function(name, options) {
                        if(!this._sections) this._sections = {};
                        this._sections[name] = options.fn(this);
                        return null;
                    }
                }
            });

//setup mail sending
var mailTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        user: credentials.gmail.user,
        pass: credentials.gmail.password
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
   res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

//routes
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.render('home');
});

app.use(express.static(__dirname + '/public'));
app.get('/about', function(req, res){
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function(req, res){
   res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
   res.render('tours/request-group-rate');
});

app.use(require('body-parser')());

app.get('/newsletter', function(req, res) {
    res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.post('/process', function(req, res){
    if(req.xhr || req.accepts('json, html') === 'json') {
        console.log('Form (form querystring): ' + req.query.form);
        console.log('CSRF token (from hidden form field): ' + req.body._csrf);
        console.log('Name (from form field)' + req.body.name);
        console.log('Email (from form field)' + req.body.email);
        res.send({success: true});
    } else {
        res.redirect(303, '/thank-you');
    }
});

app.get('/contest/vacation-photo',function(req,res){
    var now = new Date(); res.render('contest/vacation-photo',{
        year: now.getFullYear(),month: now.getMont()
    });
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303, '/error'); console.log('received fields:'); console.log(fields);
        console.log('received files:'); console.log(files);
        res.redirect(303, '/thank-you');
    });
});

app.get('/thank-you', function(req, res){
    res.render('thank-you');
});

//custom 404 page
app.use(function(req, res){
    res.status(404);
    res.render('404');
});

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


