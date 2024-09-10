// biblioteca externa, inquire, instalar com npm install inquire
const {select} = require('@inquirer/prompts');

// toda vez que usar await deve usar async antes da função
async function initStart(){

    while(true){
        // faz esperar o usuário fazer a seleção
        const option = await select({

            // tem que ser em inglês, pois dentro do método select ele espera um objeto com esses valores
            message: 'Menu >',
            choices: [
                {name: 'Cadastrar meta', value: 'cadastrar'},
                {name: 'Listar metas', value: 'listar'},
                {sair: 'Sair', value: 'sair'}
            ],
        });

        switch(option){
            case 'cadastrar':
                console.log('vamos cadastrar');
                break;
            case 'listar': 
                console.log('vamos listar');
                break;
            case 'sair': 
                console.log('Até a próxima!');
                return;
        }

    }

}

initStart();