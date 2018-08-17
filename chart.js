module.exports = function() {
    this.pontos = [];
    
    this.get_last_ponto = function() {
        return this.pontos[this.pontos.length-1];
    }
    
    this.get_pontos = function() {
        return this.pontos;
    }
    
    this.set_pontos = function(pontos) {
        this.pontos = pontos;
    }
    
    this.add_ponto = function(ponto) {
        this.pontos.push(ponto);
    }
    
    this.start_new = function() {
        this.pontos = [];
    }
}