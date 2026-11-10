document.addEventListener("DOMContentLoaded", () => {
    const checkTemaEscuro = document.getElementById("checkTemaEscuro");
    const botaoSair = document.getElementById("botaoSair");

    //abaixo serve para verificar se já tem um tema salvo na sessão atual
    //impedindo assim de trocar de aba e sair do tema escuro (ou claro)
    const temaSalvo = sessionStorage.getItem("temaSite");

    if(temaSalvo === "dark"){
        document.body.classList.add("dark-mode");
        if(checkTemaEscuro) checkTemaEscuro.checked = true;
    }

    //Abaixo vai "escutar" a troca manual do tema claro para tema escuro
    checkTemaEscuro.addEventListener("change", () => {
        if(checkTemaEscuro.checked){
            document.body.classList.add("dark-mode");
            sessionStorage.setItem("temaSite", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            sessionStorage.setItem("temaSite", "light");
        }
    });

    if(botaoSair){
        botaoSair.addEventListener("click", () => {
            sessionStorage.removeItem("temaSite");
            document.body.classList.remove("dark-mode");
            checkTemaEscuro.checked = false;
        });
    }

    const areaColaboradores = document.querySelector(".areaColaboradores");
    const botaoExcluir = document.getElementById("botaoExcluir");
    const modalConfirmacao = document.getElementById("janelaConfirmacao");
    const confirmarExclusao = document.getElementById("confirmarExclusao");
    const cancelarExclusao = document.getElementById("negarExclusao");

    let colaboradorSelecionado = null;
    let modoExclusao = false;

    let colaboradores = JSON.parse(localStorage.getItem("equipeColaboradores"));

    if(!colaboradores || colaboradores.lenght === 0)
    {
        colaboradores = [
        {id: 1, nome: "Eduardo Batista Oliveira"},
        {id: 2, nome: "Elias da SIlva Melo"},
        {id:3, nome: "Elisa Manuela Xavier"},
        {id: 4, nome: "Fabio dos Santos Gomides"}    
        ];

        localStorage.setItem("equipeColaboradores", JSON.stringify(colaboradores));
    }


    function renderizarColaboradores() {
        
        areaColaboradores.innerHTML = "";

        colaboradores.forEach(colaborador => {
            const card = document.createElement("div");
            card.classList.add("cardColaborador");

            card.innerHTML = `
            <span class="nomeColaborador">
                ${colaborador.nome}
            </span>
            
            <button
                class="botaoRemover"
                data-id="${colaborador.id}">
                X
            </button>
        `;

        areaColaboradores.appendChild(card);
        });
        adicionarEventosDeExclusao();
    }

    function adicionarEventosDeExclusao(){
        const botoesRemover = document.querySelectorAll(".botaoRemover");
    
        botoesRemover.forEach(botao => {
            botao.addEventListener("click", () => {
                colaboradorSelecionado = Number(botao.dataset.id);

                modalConfirmacao.classList.add("ativo");
            });
        });
    }

    botaoExcluir.addEventListener("click", () => {
        modoExclusao = !modoExclusao;

        if(modoExclusao){
            areaColaboradores.classList.add("modoExclusao");
            botaoExcluir.innerHTML = "<b>Cancelar</b>";
            botaoExcluir.style.backgroundColor = "#555";
        } else {
            areaColaboradores.classList.remove("modoExclusao");
                botaoExcluir.innerHTML = "<b>Excluir</b>";
                botaoExcluir.style.backgroundColor = "";
        }
    });

    //O código abaixo é quando o usuário clica em "Não" no modal
    cancelarExclusao.addEventListener("click", () => {
        modalConfirmacao.classList.remove("ativo");
        colaboradorSelecionado = null;
    });

    //O código abaixo é quando o usuário clica em "Sim" no modal
    confirmarExclusao.addEventListener("click", () => {
            const indice = colaboradores.findIndex(
            colaborador => colaborador.id === colaboradorSelecionado);

        if(indice !== -1){
            //remove 1 item a partir da lista de índices encontrados
            colaboradores.splice(indice, 1);

            localStorage.setItem("equipeColaboradores", JSON.stringify(colaboradores));

            //atualiza a tela
            renderizarColaboradores();
        }

        //as próximas duas linhas fecham o modal e atualizam a tela
        modalConfirmacao.classList.remove("ativo");
        colaboradorSelecionado = null; 
    });

    //inicializa a tela desenhando os cards
    renderizarColaboradores();
});

//Abaixo vai mudar a mensagem de "olá colaborador" para pegar apenas o primeiro nome
    //da pessoa cadastrada que entrou na aplicação
    const msgBoasVindas = document.querySelector('.msgBoasVindas');
    const usuarioLogadoString = sessionStorage.getItem('usuarioLogado');

    if(usuarioLogadoString && msgBoasVindas)
    {
        try
        {
            const usuarioObjeto = JSON.parse(usuarioLogadoString);
            const nomeCompleto = usuarioObjeto.nome || usuarioObjeto.login;
            const primeiroNome = nomeCompleto.split(' ')[0];
            msgBoasVindas.textContent = `Olá, ${primeiroNome}`;
        } catch (e) 
        {
            const primeiroNome = usuarioLogadoString.split(' ')[0];
            msgBoasVindas.textContent = `Olá, ${primeiroNome}`;
        }
    }