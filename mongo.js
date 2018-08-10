module.exports = class Mongo {

    constructor() {
        this.mongo = require('mongodb').MongoClient;
        this.ObjectId = require('mongodb').ObjectId; 
    }

    get_pool(callback) {
        this.mongo.connect('mongodb://localhost:27017/', (error, db) => {
            if (error)
                console.log("ERRO AO CONECTAR AO MONGO DB: ", error);
            else 
                db.db('prizeship').collection('pool').find( { pool: { $exists: true } }).toArray( (error, array) => {
                    if(error)
                        console.log("error: ", error);
                    else
                        //TESTAR O PONTO POOL
                        callback(array[0].pool); // precisa existir apenas um objeto com a key "pool"

                });
            db.close();
        }); 
    }


    // testar, se funfar, arrumar a pool_state pq ta usando find em vez de findOne
    search_user(user_id, callback) {
        var id = new this.ObjectId(user_id);
        this.mongo.connect('mongodb://localhost:27017/', (error, db) => {
            if (error)
                console.log("ERRO AO CONECTAR AO MONGO DB: ", error);
            else {
                db.db('prizeship').collection('users').find( { _id: id } ).toArray( (error, array) => {
                    callback(array[0]);
                })
                
            }
            db.close();        
        });
    }

    update_pool(cpool) {
        this.mongo.connect('mongodb://localhost:27017/', (error, db) => {
            if (error)
                console.log("ERRO AO CONECTAR AO MONGO DB: ", error);
            else 
                db.db('prizeship').collection('pool').update( { pool: {$exists: true}}, {$set : {pool : cpool}});
            db.close();
        });
    }

    user_spent_ip(user_id, quant) {
        var id = new this.ObjectId(user_id);
        this.mongo.connect('mongodb://localhost:27017/', (error, db) => {
            if (error)
                console.log("ERRO AO CONECTAR AO MONGO DB: ", error);
            else
                db.db('prizeship').collection('users').update( { _id : id}, {$inc: {ip: -quant, ip_spent: quant}});
                
            db.close();
        });
    }
    
    
}