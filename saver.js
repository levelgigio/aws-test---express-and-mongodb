module.exports = function(how_often) {
    //-------------------VARIABLES---------------------//
    this.database;
    this.timers = [];
    this.pool = [];
    this.chart = [];
    this.pontos_salvos = [];
    
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
        for(var i = 0; i < obj.chart.length; i++) {
            for(var j = obj.chart[i].get_pontos().length; j > obj.pontos_salvos[i]; j--) {
                obj.database.save_chart_point(obj.chart[i].get_last_ponto());
                obj.pontos_salvos[i]++;
            }
        }
            
         
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
    
    this.set_database = function(database) {
        this.database = database;
    }
    
    this.add_chart = function(chart) {
        this.chart.push(chart);
        this.pontos_salvos[this.chart.length-1] = chart.get_pontos().length;
    }
    //-------------------METHODS---------------------//
}