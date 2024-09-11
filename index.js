// biblioteca externa, inquire, instalar com npm install inquire
const {select, input, checkbox} = require('@inquirer/prompts');

let meta = {
    value: 'Tomar água, 2L por dia',
    checked: true
};

let listMetas = [meta];

async function register(){
    const meta = await input({message: 'Digite a meta:'});

    // length, diz que há mais de um caractér.
    if(meta.length == 0){
        console.log('A meta não pode ser vazia!');
        return;
    }

    listMetas.push(
        {value: meta, checked: false}
    );
}

async function list(){
    const answers = await checkbox({
        message: 'Use as setas para mudar de meta, o espaço para marcar e desmarcar e Enter para finalizar essa etapa',
        choices: [...listMetas],
        // os ... pega tudo do array listMetas e joga para esse array.
        instructions: false
    });

    listMetas.forEach((meta) => {
        meta.checked = false;
    });

    if(answers.length == 0){
        console.log('Nenhuma meta selecionada!');
        return;
    }

    answers.forEach((answer) => {
        // no find, procura-se a meta que é igual a resposta
        const metaChosen = listMetas.find((meta) => {
            return meta.value == answer;
        });

        metaChosen.checked = true;
    });

    console.log('Meta(s) marcada(s) como concluída(s)');
}

async function carriedOut(){
    const carriedOut = listMetas.filter((meta) => {
        return meta.checked;
    });

    if(carriedOut.length == 0){
        console.log('Não existe metas realizadas');
        return;
    }

    await select({
        message: `Metas realizadas ${carriedOut.length}`,
        choices: [...carriedOut]
    });
}

async function noCarriedOut(){
    const noCarriedOut = listMetas.filter((meta) => {
        return !meta.checked;
    });

    if(noCarriedOut.length == 0){
        console.log('Todas as metas estão realizadas! :)');
        return;
    }

    await select({
        message: `Metas abertas ${noCarriedOut.length}`,
        choices: [...noCarriedOut]
    });
}

async function deleteMeta(){
    // o map mapeia o original, muda o antigo e troca para um novo
    const metasUnchecked = listMetas.map((meta) => {
        return {value: meta.value, checked: false};
    });

    const response = await checkbox({
        message: 'Selecione item para deletar',
        choices: [...metasUnchecked],
        instructions: false
    });

    if(response.length == 0){
        console.log('Nenhum item para deletar');
        return;
    }

    response.forEach((item) => {
        listMetas = listMetas.filter((meta) => {
            return meta.value != item;
        });
    });

    console.log('Meta(s) deleta(s) com sucesso!');
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
                {name: 'Metas realizadas', value:'realizadas'},
                {name: 'Metas abertas', value: 'abertas'},
                {name: 'Deletar metas', value: 'deletar'},
                {sair: 'Sair', value: 'sair'}
            ],
        });

        switch(option){

            case 'cadastrar':
                await register();
                console.log(listMetas);
                break;

            case 'listar': 
                console.log('vamos listar');
                await list();
                break;

            case 'realizadas':
                await carriedOut();
                break;

            case 'abertas':
                await noCarriedOut();
                return;

            case 'deletar':
                await deleteMeta();
                break;
            
            case 'sair': 
                console.log('Até a próxima!');
                return;
        }

    }

}

initStart();