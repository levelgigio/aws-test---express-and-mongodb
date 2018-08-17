module.exports = function() {
    //-------------------VARIABLES---------------------//
    this.nave;
    //-------------------VARIABLES---------------------//
    
    //-------------------METHODS---------------------//
    this.subir = function() {
        this.nave.altitude += this.nave.gas_default + this.nave.gas_extra;
    }
    
    this.descer = function() {
        this.nave.altitude -= this.nave.gas_default + this.nave.gas_extra;
    }
    
    this.update_pos_x = function() {
        this.nave.pos_x = new Date().getTime();
    }
    
    this.get_nave = function() {
        return this.nave;
    }
    
    this.get_pontos = function() {
        var pontos = {
            x: this.nave.pos_x,
            y: this.nave.altitude
        }
        return pontos;
    }
    
    this.set_nave = function(nave) {
        this.nave = nave;
    }
    
    this.start_new = function() {
        this.nave = {
            altitude: 0,
            pos_x: new Date().getTime(),
            gas_default: 20,
            gas_extra: 0
        }
    }
    //-------------------METHODS---------------------//
}