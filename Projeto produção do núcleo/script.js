document.addEventListener("DOMContentLoaded", () => {
    // 1. LÓGICA DO TEMA ESCURO (DARK MODE)
    const checkTemaEscuro = document.getElementById("checkTemaEscuro");
    const botaoSair = document.getElementById("botaoSair");
    const temaSalvo = sessionStorage.getItem("temaSite");



    if(temaSalvo === "dark"){
        document.body.classList.add("dark-mode");
        if(checkTemaEscuro) checkTemaEscuro.checked = true;
    }



    if(checkTemaEscuro){
        checkTemaEscuro.addEventListener("change", () => {
            if(checkTemaEscuro.checked){
                document.body.classList.add("dark-mode");
                sessionStorage.setItem("temaSite", "dark");
            } else {
                document.body.classList.remove("dark-mode");
                sessionStorage.setItem("temaSite", "light");
            }
        });
    }



    if(botaoSair){
        botaoSair.addEventListener("click", () => {
            sessionStorage.removeItem("temaSite");
            document.body.classList.remove("dark-mode");
            if(checkTemaEscuro) checkTemaEscuro.checked = false;
        });
    }



    // 2. RECUPERAR NOME DO USUÁRIO LOGADO
    let nomeDoColaborador = 'Sem matrícula';
    const usuarioLogadoString = sessionStorage.getItem('usuarioLogado');

    // 3. LÓGICA DE INICIAR ATIVIDADE E CARDS
    const gridAtividades = document.getElementById('gridAtividades');
    const botoesDeAtividades = document.querySelectorAll('.botaoAtividade');



    // Carrega o histórico de cards salvos antes de tudo
    carregarAtividadesSalvas();



    // Loop que adiciona o 'click' para iniciar a contagem em TODOS os 26 botões
    botoesDeAtividades.forEach(botao => {
        botao.addEventListener('click', () => {
            const nomeAtividade = botao.getAttribute('data-value'); // Ex: "carimboFibrasil"
            const tituloVisual = botao.textContent; // O nome bonitão pra tela



            const agora = new Date();
            // Pega a hora no formato 00:00 direto do sistema na hora do clique
            const horaInicio = agora.toTimeString().split(' ')[0].substring(0,5); 
            const dataIso = agora.toISOString(); 
            
            const novaAtividade = {
                colaborador: nomeDoColaborador,
                atividade: nomeAtividade,     
                atividadeLabel: tituloVisual, 
                horaVisor: horaInicio,
                data: dataIso, 
                status: "Em andamento"
            };



            let atividadesSalvas = JSON.parse(localStorage.getItem("atividades")) || [];
            atividadesSalvas.push(novaAtividade);
            localStorage.setItem("atividades", JSON.stringify(atividadesSalvas));
            
            // Joga o card pra tela
            renderizarCard(novaAtividade);
        });
    });



    // Função que carrega o histórico do banco e renderiza
    function carregarAtividadesSalvas() {
        let atividadesSalvas = JSON.parse(localStorage.getItem("atividades")) || [];
        atividadesSalvas.forEach(atividade => {
            renderizarCard(atividade);
        });
    }



    // Função que desenha o card e roda o cronômetro
    function renderizarCard(atividadeObjeto) {
        const card = document.createElement('div');
        card.className = 'card-atividade';      



        const tituloVisor = atividadeObjeto.atividadeLabel || atividadeObjeto.atividade;



        card.innerHTML = `
            <h4>${tituloVisor}</h4>
            <span style="font-size: 12px; color: gray;">Colaborador: ${atividadeObjeto.colaborador} | Início: ${atividadeObjeto.horaVisor}</span>
            <div class="tempo-execucao">00:00:00</div>
            <button class="botaoAcao botaoEncerrar">Encerrar Atividade</button>
        `;



        // Prepend joga os novos cards sempre no topo da lista
        if(gridAtividades) gridAtividades.prepend(card);
        
        const visorTempo = card.querySelector('.tempo-execucao');
        const botaoEncerrar = card.querySelector('.botaoEncerrar');



        if (atividadeObjeto.status === "Finalizada") {
            card.classList.add('atividade-encerrada');
            botaoEncerrar.textContent = 'Finalizado';
            botaoEncerrar.disabled = true;
            visorTempo.textContent = atividadeObjeto.tempoGastoFormatado || "00:00:00";
            return; 
        }



        const tempoInicioReal = new Date(atividadeObjeto.data).getTime();
        const intervalo = setInterval(() => {
           const decorrido = Date.now() - tempoInicioReal;
           const horas = Math.floor(decorrido / 3600000).toString().padStart(2, '0');
           const minutos = Math.floor((decorrido % 3600000) / 60000).toString().padStart(2,'0');
           const segundos = Math.floor((decorrido % 60000) / 1000).toString().padStart(2, '0');



           visorTempo.textContent = `${horas}:${minutos}:${segundos}`;
        }, 1000);



        botaoEncerrar.addEventListener('click', () => {
            clearInterval(intervalo);
            const tempoFimReal = Date.now();
            const decorrido = tempoFimReal - tempoInicioReal;



            const horas = Math.floor(decorrido / 3600000).toString().padStart(2, '0');
            const minutos = Math.floor((decorrido % 3600000) / 60000).toString().padStart(2,'0');
            const segundos = Math.floor((decorrido % 60000) / 1000).toString().padStart(2, '0');
            
            const tempoExatoFormatado = `${horas}:${minutos}:${segundos}`;
            const tempoGastoEmMinutosParaGrafico = decorrido / 60000;
            
            botaoEncerrar.textContent = 'Finalizado';
            botaoEncerrar.disabled = true;
            card.classList.add('atividade-encerrada');
            
            visorTempo.textContent = tempoExatoFormatado;
           
            let atividadesSalvas = JSON.parse(localStorage.getItem("atividades")) || [];
            for (let i = atividadesSalvas.length - 1; i >= 0; i--) {
                if (atividadesSalvas[i].data === atividadeObjeto.data) {
                    atividadesSalvas[i].status = "Finalizada";
                    atividadesSalvas[i].tempoGastoMinutos = tempoGastoEmMinutosParaGrafico;
                    atividadesSalvas[i].tempoGastoFormatado = tempoExatoFormatado;
                    break;
                }
            }
            localStorage.setItem("atividades", JSON.stringify(atividadesSalvas));
        });
    }
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