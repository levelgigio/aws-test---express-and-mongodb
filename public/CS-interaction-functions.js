var user_id = '5b6cdd1e1879441f10bb345f';

function get_pool() {
    $.get('http://localhost:3000/get-pool', (pool) => {
        console.log(pool);
    });
}

function login() {
    
}

function vote() {
    $.post('http://localhost:3000/vote', {
        user: user_id,
        ip: 2,
        voto: "descer"
    }, (response) => {
        console.log(response);
    });
}