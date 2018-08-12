var Mongo = require('./mongo.js');
var database = new Mongo();

var Game = require('./game.js');
var game = new Game(database);

var express = require('express');
var app = express();
app.listen(3000);

var body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use(express.static('public'));

//----------------------------------INDEX-------------------------------------//
//var project_path = 'C:/Users/Giovanni/Documents/webdev/aws_test/';
app.get('/', (request, response) => {
    //response.sendFile(project_path + 'index.html');
});
//----------------------------------INDEX-------------------------------------//

//----------------------------------POOL-------------------------------------//
// RETRIEVE OBJECT COM OS VOTOS
app.get('/get-pool', (request, response) => {
    response.send(game.get_pool());
});

// ADICIONA UM VOTO NA POOL
app.post('/vote', (request, response) => {
    var user_id = request.body.user;
    var voto = request.body.voto;
    var ip_spent = Number(request.body.ip);
    
    // mongo function to check if the user has enough IP
    database.search_user_by_id(user_id, (user) => {
        // se tem, tira do usuario e coloca na pool
        if(user.ip >= ip_spent) {
            switch(voto) {
                case "subir":
                    game.pool.subir(ip_spent);
                    break;
                case "descer":
                    game.pool.descer(ip_spent);
            }
            //mongo function to update users ip
            database.user_spent_ip(user._id, ip_spent);
            response.send({
                status: "ok",
                user_ip: user.ip
            });
        } else
            response.send({
               status: "NAO TEM IP SUFICIENTE", 
            });
    });
});
//----------------------------------POOL-------------------------------------//

//----------------------------------USER-------------------------------------//
app.post('/login', (request, response) => {
    var username = request.body.username;
    var pwd = request.body.pwd;
    
    var user = {
        username: username,
        pwd: pwd
    };
    
    // funcao mongo retorna um objeto com status e possivelmente um id
    database.user_login(user, (id) => {
        response.send(id);
    }); 
});

app.post('/user', (request, response) => {
    database.search_user_by_id(request.body.user_id, (user) => {
        response.send(user);
    });
});

app.post('/split', (request, response) => {
    database.split_pp(request.body.user_id, request.body.pp_to_split, (result) => {
        response.send(result);
    })
})
//----------------------------------USER-------------------------------------//

//----------------------------------TIMERS-------------------------------------//
app.get('/countdown_timer', (request, response) => {
    response.send(game.get_cd_timer().get_timer());
});

app.get('/reduce_deadline', (request, response) => {
    game.get_deadline_timer().reduce_deadline();
    response.send(game.get_deadline_timer().get_timer());
});

app.get('/deadline', (request, response) => {
    response.send(game.get_deadline_timer().get_timer());
});
//----------------------------------TIMERS-------------------------------------//

//----------------------------------NAVE-------------------------------------//
app.get('/nave', (request, response) => {
    response.send(game.get_nave());
});
//----------------------------------NAVE-------------------------------------//

//----------------------------------EVERYTHING-------------------------------------//
app.post('/everything', (request, response) => {
    var user_id = request.body.user_id;
    database.get_everything(user_id, (everything) => {
        response.send(everything);
    });
});
//----------------------------------EVERYTHING-------------------------------------//