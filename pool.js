module.exports = function() {
    this.pool;
    
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
        }
    }
    
    this.set_pool = function(pool) {
        this.pool = pool;
    }
    
    this.get_pool = function() {
        return this.pool;
    }
    
    this.close_pool = function() {
        // distribuir ip spent
        this.start_new();
    }
    
}