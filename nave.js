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
    
    this.get_nave = function() {
        return this.nave;
    }
    
    this.set_nave = function(nave) {
        this.nave = nave;
    }
    
    this.start_new = function() {
        this.nave = {
            altitude: 0,
            gas_default: 20,
            gas_extra: 0
        }
    }
    //-------------------METHODS---------------------//
}