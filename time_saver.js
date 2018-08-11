module.exports = function(db, ...args) {
    this.database = db;
    this.timers = args;
    this.how_often = 200;
    
    var obj = this;
    this.update = function(callback) {
        for(var i = 0; i < 1; i++) 
            obj.database.save_time(obj.timers[i].get_timer(), obj.save);
    }
    
    this.save = function() {
        setTimeout(obj.update, obj.how_often);
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