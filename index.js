// biblioteca externa, inquire, instalar com npm install inquire
const {select, input, checkbox} = require('@inquirer/prompts');
const fs = require('fs').promises;

let mensagem = 'Bem-vindo ao App de metas!';

let listMetas

async function loadMetas(){
    // primeiro a função tenta
    try {

        const date = await fs.readFile('metas.json', 'utf-8');
        listMetas = JSON.parse(date);

    } catch {
        listMetas = [];
        // retorna um erro caso der errado
    }
}

loadMetas();

async function saveMetas(){
    await fs.writeFile('metas.json', JSON.stringify(listMetas, null, 2));
}

// função que limpa o terminal
function visibilyMessage(){
    console.clear();

    if(mensagem != ''){
        console.log(mensagem);
        console.log('');
        mensagem = '';
    }
}

async function register(){
    const meta = await input({message: 'Digite a meta:'});

    // length, diz que há mais de um caractér.
    if(meta.length == 0){
        mensagem = 'A meta não pode ser vazia!';
        return;
    }

    listMetas.push(
        {value: meta, checked: false}
    );

    mensagem = 'Meta cadastrada com sucesso!';
}

async function list(){
    if(listMetas.length == 0){
        mensagem = 'Não existem metas!';
        return;
    }

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
        mensagem = 'Nenhuma meta selecionada!';
        return;
    }

    answers.forEach((answer) => {
        // no find, procura-se a meta que é igual a resposta
        const metaChosen = listMetas.find((meta) => {
            return meta.value == answer;
        });

        metaChosen.checked = true;
    });

    mensagem = 'Meta(s) marcada(s) como concluída(s)';
}

async function carriedOut(){
    const carriedOut = listMetas.filter((meta) => {
        return meta.checked;
    });

    if(carriedOut.length == 0){
        mensagem = 'Não existe metas realizadas! :(';
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
        mensagem = 'Todas as metas estão realizadas! :)';
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
        mensagem = 'Nenhum item para deletar';
        return;
    }

    response.forEach((item) => {
        listMetas = listMetas.filter((meta) => {
            return meta.value != item;
        });
    });

    mensagem = 'Meta(s) deleta(s) com sucesso!';
}

// toda vez que usar await deve usar async antes da função
async function initStart(){
    await loadMetas();

    while(true){
        visibilyMessage();
        await saveMetas();
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
                break;

            case 'listar': 
                await list();
                await saveMetas();
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