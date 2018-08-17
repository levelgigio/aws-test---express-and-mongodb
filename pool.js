module.exports = function(game) {
    //-------------------VARIABLES---------------------//
    this.pool;
    this.game = game;
    //-------------------VARIABLES---------------------//

    //-------------------METHODS---------------------//
    this.subir = function(quant) {
        this.pool.subir += quant;
        this.pool.ip_spent += quant;
    }

    this.descer = function(quant) {
        this.pool.descer += quant;
        this.pool.ip_spent += quant;
    }

    this.start_new = function() {
        this.pool = {
            subir: 0,
            descer: 0,
            ip_spent: 0
        };
    }

    this.set_pool = function(pool) {
        this.pool = pool;
    }

    this.get_pool = function() {
        return this.pool;
    }

    this.close_pool = function() {
        if (this.pool.subir > this.pool.descer)
            this.game.nave.subir();

        else if ( this.pool.subir < this.pool.descer ) 
            this.game.nave.descer();
        
        this.start_new();
        
        this.game.nave.update_pos_x();
        this.game.chart.add_ponto(this.game.nave.get_pontos());
        console.log(this.game.chart.get_pontos());

        // TODO: distribuir ip spent
    }
    //-------------------METHODS---------------------//
}