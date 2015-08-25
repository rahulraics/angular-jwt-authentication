var express = require('express');
var faker = require("faker");
var cors = require("cors");
var bodyParser=require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var jwtSecret = 's312312jjk321j&^%k2n32131';

var user={
    username:'Rahul',
    password:'p'
};

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({ secret: jwtSecret}).unless({ path: ['/login']}));

app.get('/random-user',function(req,res){
    var user = faker.helpers.userCard();
    user.avatar = faker.image.avatar();
    res.json(user);
});

app.post('/login',authenticate,function(req,res){
    var token= jwt.sign({
        username: user.username
    },jwtSecret);
 res.send({
     token:token,
     user:user.username
 });
});

app.get('/me',function(req,res){
    res.send(req.user.username);
});

app.listen(3000,function(){
    console.log("App listening on port 3000");
});


//UTIL Functions

function authenticate(req,resp,next){
    var body=req.body;
    if(!body.username || !body.password){
        resp.status(400).end('Must Provide username or password.');
    }
    if(body.username !== user.username || body.password !== user.password){
        resp.status(401).end('UserName and Password is incorrect.');
    }
    next();
}