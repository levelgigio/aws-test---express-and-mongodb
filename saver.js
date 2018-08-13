module.exports = function(db, how_often) {
    //-------------------VARIABLES---------------------//
    this.database = db;
    this.timers = [];
    this.pool = [];
    this.nave = [];
    this.how_often = how_often;
    //-------------------VARIABLES---------------------//
    
    //-------------------METHODS---------------------//
    var obj = this;
    this.update = function(callback) {
        for(var i = 0; i < obj.timers.length; i++) 
            obj.database.save_time(obj.timers[i].get_timer());
        for(var i = 0; i < obj.pool.length; i++) 
            obj.database.save_pool(obj.pool[i].get_pool());
        for(var i = 0; i < obj.nave.length; i++) 
            obj.database.save_nave(obj.nave[i].get_nave());
        obj.save();
    }
    
    this.save = function() {
        setTimeout(obj.update, obj.how_often);
    }
    
    this.add_timer = function(timer) {
        this.timers.push(timer);
    }
    
    this.add_pool = function(pool) {
        this.pool.push(pool);
    }
    
    this.add_nave = function(nave) {
        this.nave.push(nave);
    }
    //-------------------METHODS---------------------//
}