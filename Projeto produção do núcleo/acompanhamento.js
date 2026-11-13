document.addEventListener("DOMContentLoaded", () => {
    const checkTemaEscuro = document.getElementById("checkTemaEscuro");
    const botaoSair = document.getElementById("botaoSair");
    const temaSalvo = sessionStorage.getItem("temaSite");



    if (temaSalvo === "dark") {
        document.body.classList.add("dark-mode");
        if (checkTemaEscuro) checkTemaEscuro.checked = true;
    }



    if (checkTemaEscuro) {
        checkTemaEscuro.addEventListener("change", () => {
            if (checkTemaEscuro.checked) {
                document.body.classList.add("dark-mode");
                sessionStorage.setItem("temaSite", "dark");
            } else {
                document.body.classList.remove("dark-mode");
                sessionStorage.setItem("temaSite", "light");
            }
        });
    }



    if (botaoSair) {
        botaoSair.addEventListener("click", () => {
            sessionStorage.removeItem("temaSite");
            document.body.classList.remove("dark-mode");
            if (checkTemaEscuro) checkTemaEscuro.checked = false;
        });
    }



    // Saudação com primeiro nome
    const msgBoasVindas = document.querySelector('.msgBoasVindas');
    const usuarioLogadoString = sessionStorage.getItem('usuarioLogado');



    if (usuarioLogadoString && msgBoasVindas) {
        try {
            const usuarioObjeto = JSON.parse(usuarioLogadoString);
            const nomeCompleto = usuarioObjeto.nome || usuarioObjeto.login;
            const primeiroNome = nomeCompleto.split(' ')[0];
            msgBoasVindas.textContent = `Olá, ${primeiroNome}`;
        } catch (e) {
            const primeiroNome = usuarioLogadoString.split(' ')[0];
            msgBoasVindas.textContent = `Olá, ${primeiroNome}`;
        }
    }



    const colaboradoresEquipe = [
        "EDUARDO BATISTA OLIVEIRA DE SOUZA",
        "ELIAS DA SILVA MELO",
        "ELISA MANUELA XAVIER DA SILVA",
        "FABIO DOS SANTOS GOMIDES",
        "LUCAS MACHADO RIBEIRO",
        "PATRÍCIA GONÇALVEZ PEREIRA",
        "SILVANA ANTONIA DE SOUZA BARCELOS",
        "TIAGO MAIAN GOMES SOARES PITOMBO",
        "WALLACE MAESSE RIBEIRO DIMAS"
    ];



    const selectData = document.getElementById('selectData');
    const timelineHeader = document.getElementById('timelineHeader');
    const timelineBody = document.getElementById('timelineBody');
    const tooltip = document.getElementById('tooltipAcompanhamento');



    // Converte objeto Date para YYYY-MM-DD no fuso horário local
    function obterDataLocalISO(dataObj) {
        const ano = dataObj.getFullYear();
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const dia = String(dataObj.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }



    // 1. Desenha a régua de 24 horas (Corrigido: h < 24)
    function desenharRegua() {
        let htmlRegua = `<div class="coluna-info" style="border: none; background: transparent;"></div><div class="coluna-tempo">`;
        for (let h = 0; h < 24; h++) {
            htmlRegua += `<div class="hora-marcador">${String(h).padStart(2, '0')}:00</div>`;
        }
        htmlRegua += `</div>`;
        timelineHeader.innerHTML = htmlRegua;
    }



    // 2. Carrega datas disponíveis no dropdown
    function preencherDropdownDatas(atividades) {
        const datasUnicas = new Set();
        atividades.forEach(atividade => {
            if (atividade.data) {
                const dataLocal = obterDataLocalISO(new Date(atividade.data));
                datasUnicas.add(dataLocal);
            }
        });



        const dataHoje = obterDataLocalISO(new Date());
        datasUnicas.add(dataHoje);



        const arrayDatas = Array.from(datasUnicas).sort((a, b) => new Date(b) - new Date(a));



        selectData.innerHTML = '';
        arrayDatas.forEach(data => {
            const opt = document.createElement('option');
            opt.value = data;
            opt.textContent = data.split('-').reverse().join('/');
            selectData.appendChild(opt);
        });
    }



    // 3. Renderiza o acompanhamento
    function renderizarAcompanhamento() {
        // Corrigido: localStorage.getItem
        const todasAtividades = JSON.parse(localStorage.getItem('atividades')) || [];
        const dataSelecionada = selectData.value;



        const atividadesDoDia = todasAtividades.filter(atividade => {
            if (!atividade.data) return false;
            return obterDataLocalISO(new Date(atividade.data)) === dataSelecionada;
        });



        timelineBody.innerHTML = '';



        colaboradoresEquipe.forEach(colaboradorNome => {
            // Filtra e ordena da mais antiga para a mais recente para a mais nova sobrepor a anterior
            const tarefasDele = atividadesDoDia
                .filter(tarefa => tarefa.colaborador && tarefa.colaborador.trim().toUpperCase() === colaboradorNome.toUpperCase())
                .sort((a, b) => new Date(a.data) - new Date(b.data));



            let htmlBlocos = '';
            let somaMinutosTotais = 0;



            tarefasDele.forEach((tarefa, index) => {
                const inicioDate = new Date(tarefa.data);
                const minutosInicio = (inicioDate.getHours() * 60) + inicioDate.getMinutes();



                let minutosFim = 0;
                let classeStatus = 'bloco-atividade';
                let duracaoTexto = '';



                if (tarefa.status === 'Finalizada') {
                    const duracao = parseFloat(tarefa.tempoGastoMinutos) || 0;
                    minutosFim = minutosInicio + duracao;
                    somaMinutosTotais += duracao;
                    duracaoTexto = tarefa.tempoGastoFormatado || '00:00:00';
                } else {
                    const agora = new Date();
                    if (obterDataLocalISO(agora) === dataSelecionada) {
                        minutosFim = (agora.getHours() * 60) + agora.getMinutes() + (agora.getSeconds() / 60);
                    } else {
                        minutosFim = 1440;
                    }



                    const duracaoEmAndamento = Math.max(0, minutosFim - minutosInicio);
                    somaMinutosTotais += duracaoEmAndamento;
                    // Corrigido: espaço antes de bloco-em-andamento
                    classeStatus += ' bloco-em-andamento';



                    const horaDuracao = Math.floor(duracaoEmAndamento / 60).toString().padStart(2, '0');
                    const minutoDuracao = Math.floor(duracaoEmAndamento % 60).toString().padStart(2, '0');
                    duracaoTexto = `${horaDuracao}:${minutoDuracao}:00 (em execução)`;
                }



                const posicaoLeft = (minutosInicio / 1440) * 100;
                let larguraWidth = ((minutosFim - minutosInicio) / 1440) * 100;
                if (larguraWidth < 0.6) larguraWidth = 0.6;



                const horaInicioTxt = `${String(inicioDate.getHours()).padStart(2, '0')}:${String(inicioDate.getMinutes()).padStart(2, '0')}`;
                // Corrigido: infoTooltip
                const infoTooltip = `<strong>${tarefa.atividadeLabel || tarefa.atividade}</strong><br>Início: ${horaInicioTxt} | Tempo: ${duracaoTexto}`;



                // z-index crescente garante que tarefas mais recentes fiquem por cima das anteriores
                htmlBlocos += `<div class="${classeStatus}" style="left: ${posicaoLeft}%; width: ${larguraWidth}%; z-index: ${index + 1};" data-tooltip="${infoTooltip}"></div>`;
            });



            const horasTotais = Math.floor(somaMinutosTotais / 60).toString().padStart(2, '0');
            const minutosTotais = Math.floor(somaMinutosTotais % 60).toString().padStart(2, '0');



            // Corrigido: linhaHtml
            const linhaHtml = `
                <div class="timeline-row">
                    <div class="coluna-info">
                        <div class="nome">${colaboradorNome}</div>
                        <div class="tempo-soma">Acumulado: ${horasTotais}h ${minutosTotais}m</div>
                    </div>
                    <div class="coluna-tempo">
                        ${htmlBlocos}
                    </div>
                </div>
            `;
            timelineBody.insertAdjacentHTML('beforeend', linhaHtml);
        });



        adicionarEventosHover();
    }



    // 4. Hover que detecta inclusive tarefas simultâneas sobrepostas
    function adicionarEventosHover() {
        const trilhos = document.querySelectorAll('.coluna-tempo');



        trilhos.forEach(trilho => {
            trilho.addEventListener('mousemove', (e) => {
                // Pega todos os elementos sob o ponteiro do mouse e filtra apenas os blocos de atividade
                const elementosSobMouse = document.elementsFromPoint(e.clientX, e.clientY)
                    .filter(el => el.classList.contains('bloco-atividade'))
                    .reverse(); // Ordena da mais antiga (esquerda) para a mais recente



                if (elementosSobMouse.length > 0) {
                    const textos = elementosSobMouse.map(bloco => bloco.getAttribute('data-tooltip'));
                    tooltip.innerHTML = textos.join('<hr style="margin: 6px 0; border: none; border-top: 1px solid #444;">');
                    tooltip.classList.remove('tooltip-oculto');
                    tooltip.classList.add('tooltip-ativo');



                    tooltip.style.left = (e.clientX + 15) + 'px';
                    tooltip.style.top = (e.clientY + 15) + 'px';
                } else {
                    tooltip.classList.add('tooltip-oculto');
                    tooltip.classList.remove('tooltip-ativo');
                }
            });



            trilho.addEventListener('mouseleave', () => {
                tooltip.classList.add('tooltip-oculto');
                tooltip.classList.remove('tooltip-ativo');
            });
        });
    }



    // Inicialização
    desenharRegua();
    const atividadesIniciais = JSON.parse(localStorage.getItem('atividades')) || [];
    preencherDropdownDatas(atividadesIniciais);
    renderizarAcompanhamento();



    selectData.addEventListener('change', renderizarAcompanhamento);



    // Atualiza o gráfico e o tempo acumulado a cada 15 segundos
    setInterval(renderizarAcompanhamento, 15000);



    // Atualiza instantaneamente se uma tarefa for iniciada ou finalizada na aba Tarefas
    window.addEventListener('storage', () => {
        const atividadesAtualizadas = JSON.parse(localStorage.getItem('atividades')) || [];
        const dataAtual = selectData.value;
        preencherDropdownDatas(atividadesAtualizadas);
        if (dataAtual) selectData.value = dataAtual;
        renderizarAcompanhamento();
    });
});