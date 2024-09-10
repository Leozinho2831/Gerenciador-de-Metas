// biblioteca externa, inquire, instalar com npm install inquire
const {select, input} = require('@inquirer/prompts');

let meta = {
    value: 'Tomar água, 2L por dia',
    checked: true
};

let metas = [meta];

async function register(){
    const meta = await input({message: 'Digite a meta:'});

    // length, diz que há mais de um caractér.
    if(meta.length == 0){
        console.log('A meta não pode ser vazia!');
        return;
    }

    metas.push(
        {value: meta, checked: false}
    );
}

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
                await register();
                console.log(metas)
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