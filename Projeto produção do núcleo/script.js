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

    // Desempacota o JSON para pegar só o nome em vez de mostrar o objeto inteiro
    if (usuarioLogadoString) {
        try {
            const usuarioObjeto = JSON.parse(usuarioLogadoString);
            // Salva apenas o nome do colaborador
            nomeDoColaborador = usuarioObjeto.nome || usuarioObjeto.login;
        } catch (e) {
            nomeDoColaborador = usuarioLogadoString;
        }
    }

    // 3. LÓGICA DO MODAL E ATIVIDADES

    const modal = document.getElementById('modalAtividade');
    const botaoNova = document.getElementById('botaoNovaAtividade');
    const botaoCancelar = document.getElementById('botaoCancelar');
    const botaoLancar = document.getElementById('botaoLancar');
    const inputNome = document.getElementById('nomeAtividade'); // Antigo matriculaAtividade
    const gridAtividades = document.getElementById('gridAtividades');

    // Carrega as atividades salvas e redesenha a tela assim que a página abre
    carregarAtividadesSalvas();

    // Abrir modal e preencher a data e hora atual
    if(botaoNova){

        botaoNova.addEventListener('click', () => {
            const agora = new Date();
            const dataFormatada = agora.toISOString().split('T')[0];
            const horaFormatada = agora.toTimeString().split(' ')[0].substring(0,5);

            document.getElementById('dataAtividade').value = dataFormatada;
            document.getElementById('horaAtividade').value = horaFormatada;

            

            if(inputNome) {

                inputNome.value = nomeDoColaborador; // Preenche só com o nome agora

            }

            

            modal.style.display = 'flex';

        });

    }

    

    // Fecha o modal

    if(botaoCancelar){

        botaoCancelar.addEventListener('click', () => {

            modal.style.display = 'none';

        });

    }

    

    // Lança a atividade

    if(botaoLancar){

        botaoLancar.addEventListener('click', () => {

            const nomeAtividade = document.getElementById('selectAtividade').value;

            const horaInicio = document.getElementById('horaAtividade').value;

            const dataIso = new Date().toISOString(); // Guarda o exato milissegundo de início

            

            const novaAtividade = {

                colaborador: nomeDoColaborador,

                atividade: nomeAtividade,

                horaVisor: horaInicio,

                data: dataIso, // Crucial para o tempo real

                status: "Em andamento"

            };



            // Salva no LocalStorage

            let atividadesSalvas = JSON.parse(localStorage.getItem("atividades")) || [];

            atividadesSalvas.push(novaAtividade);

            localStorage.setItem("atividades", JSON.stringify(atividadesSalvas));

            

            modal.style.display = 'none';

            

            // Desenha o card novo na tela

            renderizarCard(novaAtividade);

        });

    }

    

    // Função que carrega o histórico

    function carregarAtividadesSalvas() {

        let atividadesSalvas = JSON.parse(localStorage.getItem("atividades")) || [];

        // Para cada atividade salva, desenha o card

        atividadesSalvas.forEach(atividade => {

            renderizarCard(atividade);

        });

    }



    // Função unificada para desenhar qualquer card (novo ou resgatado da memória)

    function renderizarCard(atividadeObjeto) {

        const card = document.createElement('div');
        card.className = 'card-atividade';        

        // Estrutura básica
        card.innerHTML = `
            <h4>${atividadeObjeto.atividade}</h4>
            <span style="font-size: 12px; color: gray;">Colaborador: ${atividadeObjeto.colaborador} | Início: ${atividadeObjeto.horaVisor}</span>
            <div class="tempo-execucao">00:00:00</div>
            <button class="botaoAcao botaoEncerrar">Encerrar Atividade</button>
        `;

        if(gridAtividades) gridAtividades.prepend(card);
        
        const visorTempo = card.querySelector('.tempo-execucao');
        const botaoEncerrar = card.querySelector('.botaoEncerrar');

        // Se a atividade já estiver finalizada no banco
        if (atividadeObjeto.status === "Finalizada") {
            card.classList.add('atividade-encerrada');
            botaoEncerrar.textContent = 'Finalizado';
            botaoEncerrar.disabled = true;
            visorTempo.textContent = atividadeObjeto.tempoGastoFormatado || "00:00:00";
            return; // Sai da função, não precisa rodar relógio
        }

        

        // Se estiver "Em andamento", liga o relógio baseado na data salva
        const tempoInicioReal = new Date(atividadeObjeto.data).getTime();
        const intervalo = setInterval(() => {
           const decorrido = Date.now() - tempoInicioReal;
           const horas = Math.floor(decorrido / 3600000).toString().padStart(2, '0');
           const minutos = Math.floor((decorrido % 3600000) / 60000).toString().padStart(2,'0');
           const segundos = Math.floor((decorrido % 60000) / 1000).toString().padStart(2, '0');

           visorTempo.textContent = `${horas}:${minutos}:${segundos}`;
        }, 1000);

        // Ação ao clicar em "Encerrar"
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
            
            // Vai no LocalStorage e atualiza o status desta atividade específica
            let atividadesSalvas = JSON.parse(localStorage.getItem("atividades")) || [];
            for (let i = atividadesSalvas.length - 1; i >= 0; i--) {

                // Procura a atividade que tenha exatamente a mesma data de início para alterar
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