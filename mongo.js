// TODO: ELSE IF(ARRAY) NOS FIND.TOARRAY

module.exports = class Mongo {

    constructor() {
        this.mongo = require('mongodb').MongoClient;
        this.ObjectId = require('mongodb').ObjectId; 
        
        this.db; // RECEBE A DATABASE E MANTEM A CONEXAO ABERTA (ver this.connect)
        this.essencials_obj = {};
    }

    //------------------------POOL---------------------------//
    get_pool(callback) {
        this.db.db('prizeship').collection('pool').find( { pool: { $exists: true } }).toArray( (error, array) => {
            if(error)
                console.log("error: ", error);
            else
                //TESTAR O PONTO POOL
                callback(array[0].pool); // precisa existir apenas um objeto com a key "pool"
        });
    } 

    save_pool(cpool) {
        this.db.db('prizeship').collection('pool').update( { pool: {$exists: true}}, {$set : {pool : cpool}});
    }
    //-----------------------------USER------------------------------//
    // testar, se funfar, arrumar a pool_state pq ta usando find em vez de findOne
    search_user_by_id(user_id, callback) {
        var id = new this.ObjectId(user_id);
        this.db.db('prizeship').collection('users').find( { _id: id } ).toArray( (error, array) => {
            if(error)
                console.log("ERRO AO PASSAR PRA ARRAY OS USERS", error);
            else
                callback(array[0].user);
        });
    }

    update_user(user_id, user) {
        var id = new this.ObjectId(user_id);
        this.db.db('prizeship').collection('users').update( { _id : id}, {user: user});
    }

    user_spent_ip(user_id, quant, callback) {
        var id = new this.ObjectId(user_id);
        this.db.db('prizeship').collection('users').update( { _id : id}, {$inc: {"user.ip": -quant, "user.ip_spent": quant}});
        callback();
    }

    user_login(user, callback) {
        this.db.db('prizeship').collection('users').find( { "user.username": user.username, "user.pwd": user.pwd} ).toArray((error, array) => {
            if(error)
                console.log("ERRO AO PASSAR PRA ARRAY OS USERS", error);
            else
                if(array.length)
                    callback({
                        status: "ok",
                        user_id: array[0]._id
                    }); // retorna o id do usuario com esse username e senha
            else
                callback({
                    status: "not found"
                });
        });
    }

    distribute_ip_winners(pool) {

    }

    split_pp(user_id, quant, callback) {
        this.search_user_by_id(user_id, (user) => {
            if(user.pp >= quant) {
                user.pp -= quant;
                user.ip += quant*10;
                this.update_user(user_id, user);
                callback({
                    status: "ok",
                    user: user
                });
            } else
                callback({
                    status: "not enough pp"
                });
        });
    }
    //---------------------------TIMERS---------------------------------//
    // TODO: TALVEZ TIRAR O UPSERT
    save_time(timer) {
        this.db.db('prizeship').collection('timers').update({timer_label: timer.timer_label}, {$set: {values: timer.values}}, {upsert: true}, (error) => {
            if(error)
                console.log("ERRO AO SALVAR TIMERS: ", err);
        });
    }

    get_timer(label, callback) {
        this.db.db('prizeship').collection('timers').find( { timer_label: label }).toArray((error, array) => {
            if(error)
                console.log("ERRO AO PASSAR PRA ARRAY OS TIMERS", error);
            else
                if(array.length)
                    callback(array[0]);
        });
    }
    //----------------------------------NAVE-------------------------------------//
    get_nave(callback) {
        this.db.db('prizeship').collection('nave').find( { nave: {$exists: true} } ).toArray((error, array) => {
            if(error)
                console.log("ERRO AO PASSAR PRA ARRAY A NAVE", error);
            else
                if(array.length)
                    callback(array[0].nave);
        });
    }

    save_nave(nave) {
        this.db.db('prizeship').collection('nave').update( { nave: {$exists: true}}, {$set : {nave: nave}});
    }
    //------------------------------ESSENCIALS--------------------------------//
    
    // TODO: ASSINCRONO TA FUDENDO
    get_essencials(user_id, callback) {
        var id = new this.ObjectId(user_id);
        this.db.db('prizeship').collection('users').find({ _id: id}).toArray((error, array) => {
            if (error)
                console.log("ERRO AO COLOCAR USER NA ARRAY: ", error);
            else {
                this.essencials_obj.user = array[0].user; //PUBLIC
                this.essencials_obj.user.id = array[0]._id;
            }
                
        });
        
        this.db.db('prizeship').collection('pool').find({ pool: {$exists: true}}).toArray((error, array) => {
            if (error)
                console.log("ERRO AO COLOCAR EM ARRAY POOL: ", error);
            else 
                this.essencials_obj.pool = array[0].pool;
        });
        
        this.db.db('prizeship').collection('timers').find({ timer_label: "deadlinetimer"}).toArray((error, array) => {
            if (error)
                console.log("ERRO AO COLOCAR EM ARRAY DL TIMER: ", error);
            else
                this.essencials_obj.deadline = array[0].values;
        });
        
        this.db.db('prizeship').collection('timers').find({ timer_label: "countdowntimer"}).toArray((error, array) => {
            if (error)
                console.log("ERRO AO COLOCAR EM ARRAY CD TIMER: ", error);
            else
                this.essencials_obj.countdown = array[0].values;
        });
        
        this.db.db('prizeship').collection('nave').find({ nave: {$exists: true}}).toArray((error, array) => {
            if (error)
                console.log("ERRO AO COLOCAR EM ARRAY NAVE: ", error);
            else
                {
                    this.essencials_obj.nave = array[0].nave;
                    console.log("essencials: ", this.essencials_obj);
                    callback(this.essencials_obj);
                }
                
        });
        
        
    }
    //------------------------CONNECTION------------------------//
    connect(callback) {
        var obj = this;
        this.mongo.connect('mongodb://localhost:27017/prizeship', { useNewUrlParser: true }, (error, db) => {
            if (error)
                console.log("ERRO AO CONECTAR AO MONGO DB: ", error);
            else {
                obj.db = db;
                console.log(db);
                callback(db);
            }    
            //db.close();
        });
    }
}