module.exports = class Mongo {

    constructor() {
        this.mongo = require('mongodb').MongoClient;
        this.ObjectId = require('mongodb').ObjectId; 
    }

    get_pool(callback) {
        this.connect((db) => {
            db.db('prizeship').collection('pool').find( { pool: { $exists: true } }).toArray( (error, array) => {
                if(error)
                    console.log("error: ", error);
                else
                    //TESTAR O PONTO POOL
                    callback(array[0].pool); // precisa existir apenas um objeto com a key "pool"
            });
        }); 
    }

    // testar, se funfar, arrumar a pool_state pq ta usando find em vez de findOne
    search_user_by_id(user_id, callback) {
        var id = new this.ObjectId(user_id);
        this.connect((db) => {
            db.db('prizeship').collection('users').find( { _id: id } ).toArray( (error, array) => {
                if(error)
                    console.log("ERRO AO PASSAR PRA ARRAY OS USERS", error);
                else
                    callback(array[0]);
            });
        });
    }

    save_pool(cpool) {
        // TODO: ADD UPSERT
        this.connect((db) => {
            db.db('prizeship').collection('pool').update( { pool: {$exists: true}}, {$set : {pool : cpool}});
        });
    }
    
    
    distribute_ip_winners(pool) {
        
    }

    user_spent_ip(user_id, quant) {
        var id = new this.ObjectId(user_id);
        this.connect((db) => {
            db.db('prizeship').collection('users').update( { _id : id}, {$inc: {ip: -quant, ip_spent: quant}});
        });
    }
    
    user_login(user, callback) {
        this.connect((db) => {
            db.db('prizeship').collection('users').find( { username: user.username, pwd: user.pwd} ).toArray((error, array) => {
                if(error)
                    console.log("ERRO AO PASSAR PRA ARRAY OS USERS", error);
                else
                    if(array.length)
                        callback({
                            status: array[0]._id
                        }); // retorna o id do usuario com esse username e senha
                    else
                        callback({
                            status: "not found"
                        });
            })
        });
    }
    
    
    // TODO: TALVEZ TIRAR O UPSERT
    save_time(timer) {
        this.connect((db) => {
            db.db('prizeship').collection('timers').update({timer_label: timer.timer_label}, {$set: {values: timer.values}}, {upsert: true}, (error, result) => {
                if(error)
                    console.log("ERRO AO SALVAR TIMERS: ", err);
                /*else
                    console.log("RESULTADO SALVAR TIMERS: ", result);*/
            });
        });
    }
    
    get_timer(label, callback) {
        this.connect((db) => {
            db.db('prizeship').collection('timers').find( { timer_label: label }).toArray((error, array) => {
                if(error)
                    console.log("ERRO AO PASSAR PRA ARRAY OS TIMERS", error);
                else
                    if(array.length)
                        callback(array[0]);
            });
        });
    }
    
    get_nave(callback) {
        this.connect((db) => {
            db.db('prizeship').collection('nave').find( { nave: {$exists: true} } ).toArray((error, array) => {
                if(error)
                    console.log("ERRO AO PASSAR PRA ARRAY A NAVE", error);
                else
                    if(array.length)
                        callback(array[0]);
            });
        });
    }

    mover_nave(pool) {
        var movimento = 0;
        if(pool.subir > pool.descer)
            movimento = 1;
        else if(pool.subir < pool.descer)
            movimento = -1;
        this.get_nave((nave) => {
            var nova_nave = nave;
            nova_nave.nave.altitude = nave.nave.altitude + (nave.nave.gas_default + nave.nave.gas_extra)*movimento;
            nova_nave.nave.gas_extra = 0;
            this.connect((db) => {
                db.db('prizeship').collection('nave').update( {nave: {$exists: true}}, { nave: nova_nave.nave });
            });
        });  
    }
    
    get_everything(user_id, callback) {
        var everything_obj = {};
        this.connect((db) => {
            db.db('prizeship').collection('nave').find({ nave: {$exists: true}}).toArray((error, array) => {
                if (error)
                    console.log("ERRO AO COLOCAR EM ARRAY NAVE: ", error);
                else
                    everything_obj.nave = array[0];
            });
            
            db.db('prizeship').collection('pool').find({ pool: {$exists: true}}).toArray((error, array) => {
                if (error)
                    console.log("ERRO AO COLOCAR EM ARRAY POOL: ", error);
                else
                    everything_obj.pool = array[0];
            });
            
            db.db('prizeship').collection('timers').find({ timer_label: {$exists: true}}).toArray((error, array) => {
                if (error)
                    console.log("ERRO AO COLOCAR EM ARRAY TIMERS: ", error);
                else
                    everything_obj.timers = array;
            });
            
            var id = new this.ObjectId(user_id);
            db.db('prizeship').collection('users').find({ _id: id}).toArray((error, array) => {
                if (error)
                    console.log("ERRO AO COLOCAR EM ARRAY USER: ", error);
                else {
                    everything_obj.user = array[0];
                    callback(everything_obj);
                }
            });
        });
    }
    
    connect(callback) {
        this.mongo.connect('mongodb://localhost:27017/', (error, db) => {
            if (error)
                console.log("ERRO AO CONECTAR AO MONGO DB: ", error);
            else
                callback(db);
            db.close();
        });
    }

}