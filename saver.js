module.exports = function(db, how_often) {
    this.database = db;
    this.timers = [];
    this.pool;
    this.how_often = how_often;
    
    var obj = this;
    this.update = function(callback) {
        for(var i = 0; i < obj.timers.length; i++) 
            obj.database.save_time(obj.timers[i].get_timer());
        obj.database.save_pool(obj.pool.get_pool());
        obj.save();
    }
    
    this.save = function() {
        setTimeout(obj.update, obj.how_often);
    }
    
    this.add_timer = function(timer) {
        this.timers.push(timer);
    }
    
    this.add_pool = function(pool) {
        this.pool = pool;
    }
    
}