var Mongo = require('./mongo.js');
var database = new Mongo();

var CDTimer = require('./cd_timer.js');
var cd_timer = new CDTimer();

//<-- (1) : ative para nao carregar o antigo do banco de dados
//cd_timer.start_new(24*60*60*1000, "countdowntimer"); 
//cd_timer.begin();
//--> (1) : ative para nao carregar o antigo do banco de dados

var TimeSaver = require('./time_saver.js');
var saver = new TimeSaver(database, cd_timer);

//saver.save(); //--> (1) : ative para nao carregar o antigo do banco de dados

// <-- (1) : desative para nao carregar o antigo do banco de dados
database.get_timer("countdowntimer", (timer) => {
    cd_timer.set_timer(timer);
    cd_timer.begin();
    
    saver.save();
});
// --> (1) : desative para nao carregar o antigo do banco de dados


var express = require('express');
var app = express();
app.listen(3000);

var body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use(express.static('public'));

//var project_path = 'C:/Users/Giovanni/Documents/webdev/aws_test/';

// INDEX PAGE
app.get('/', (request, response) => {
    //response.sendFile(project_path + 'index.html');
});

// RETRIEVE OBJECT COM OS VOTOS
app.get('/get-pool', (request, response) => {
    database.get_pool((pool) => {
        response.send(pool);
    }); 
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
            // mongo function to update pool
            database.get_pool((pool) => {
                pool[voto] += ip_spent;
                database.update_pool(pool);
            });
            //mongo function to update users ip
            database.user_spent_ip(user._id, ip_spent);
            response.send("TUDO CERTO, VOTOU-SE");
        } else
            response.send("NAO TEM IP SUFICIENTE");
    });
});

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

app.get('/countdown_timer', (request, response) => {
    response.send(cd_timer.get_timer());
});


