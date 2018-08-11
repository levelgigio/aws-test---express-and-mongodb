module.exports = function(db) {
    this.database = db;
    this.timers = [];
    this.how_often = 200;
    
    var obj = this;
    this.update = function(callback) {
        for(var i = 0; i < obj.timers.length; i++) 
            obj.database.save_time(obj.timers[i].get_timer());
        obj.save();
    }
    
    this.save = function() {
        setTimeout(obj.update, obj.how_often);
    }
    
    this.add_timer = function(timer) {
        this.timers.push(timer);
    }
    
}

/* COMO EH UM JSON DE TIMER
{
    timer_label: "countdowntimer",
    values: {
        time: 28919
    }
}
*/