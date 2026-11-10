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

//Definição do peso de cada atividade individualmente
//Se alguma atividade não estiver aqui, o JavaScript vai entender como se fosse 1.0 automaticamente.
const pesosAtividades = {
    "carimboFibrasil":2.0,
    "postarRsnac": 2.0,
    "rsnacRisco": 2.0,
    "oltComutada": 2.0,
    "reportDwdm": 1.0,
    "carimboDwdm": 2.0,
    "comiteHL4": 5.0,
    "comiteOLT": 3.0,
    "reportP1": 1.0,
    "reportGestao": 2.0,
    "acionamentoAlarme": 2.0,
    "escalonamentoFalha": 1.0,
    "escalonamentoRisco": 1.0,
    "escalonamentoIsolamento": 1.0,
    "reportDomus": 1.0,
    "escalonamentoHL5D": 1.0,
    "acionamentoDesvio": 2.0,
    "reportOlt": 3.0,
    "atualizacaoDeStatus": 1.0,
    "suporte": 4.0,
    "acionamentoSwap": 1.0,
    "acionamentoSwapCedente": 2.0,
    "escalonamentoHL5DIsolado": 1.0,
    "escalonamentoDesvioDeSites": 1.0,
    "escalonamentoOltMaior8": 1.0,
    "escalonamentoOutlier": 1.0
};

//Essa variável é global, e ela guarda a instância do gráfico
let meuGrafico = null;

function inicializarDashboard() {

    //vai "ouvir" as mudanças no filtro de tempo
    const filtroTempo = document.getElementById("filtroTempo");
    const filtroColaborador = document.getElementById("filtroColaborador");
    const filtroAtividade = document.getElementById("filtroAtividade");

    //Essa função vai ler o valor dos 3 e vai mandar filtrar
    function dispararFiltros(){
        carregarEFiltrarDados(
            parseInt(filtroTempo.value),
            filtroColaborador.value,
            filtroAtividade.value
        );
    }

    filtroTempo.addEventListener("change", dispararFiltros);
    filtroColaborador.addEventListener("change", dispararFiltros);
    filtroAtividade.addEventListener("change", dispararFiltros);
    
    dispararFiltros();
    };


    function carregarEFiltrarDados(diasRetroativos, colaboradorSelecionado, atividadeSelecionada){
        const todasAtividades = JSON.parse(localStorage.getItem("atividades")) || [];

        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - diasRetroativos);

        //Filtra apenas os mais recentes desde que esteja com tempo válido e a data definida pelo filtro
        const atividadesValidas = todasAtividades.filter(tarefa => {
        const dataDaTarefa = new Date(tarefa.data);
        
        //Está finalizada ???
        const statusValido = tarefa.status === "Finalizada" && tarefa.tempoGastoMinutos !== undefined;

        //Está dentro do tempo que foi selecionado no filtro ???
        const tempoValido = dataDaTarefa >= dataLimite;

        //Bate com o colaborador selecionado ? 
        const colabValido = (colaboradorSelecionado === "todas") || (tarefa.colaborador === colaboradorSelecionado);

        //Bate com a atividade selecionada ?
        const ativValida = (atividadeSelecionada === "todas") || (tarefa.atividade === atividadeSelecionada);

        return statusValido && tempoValido && colabValido && ativValida;
        });

        document.getElementById("totalAtividades").textContent = atividadesValidas.length;

        //Atualiza os cards superiores
        if(atividadesValidas.length > 0)
        {
            const tempoTotal = atividadesValidas.reduce((acc, curr) => acc + curr.tempoGastoMinutos, 0);
            const tempoMedio = Math.round(tempoTotal/atividadesValidas.length);
            document.getElementById("tempoMedioGeral").textContent = `${tempoMedio} min`;
        } else {
            document.getElementById("tempoMedioGeral").textContent = `0 min`;
        }
            //Prepara todos os dados para os gráficos e o debaixo prepara todos os dados para tabelas
            renderizarGrafico(atividadesValidas);
            renderizarTabela(atividadesValidas);
    }

    function renderizarGrafico(dados){
        const contagemAtividades = {};

        dados.forEach(dadoAtividade => {
            contagemAtividades[dadoAtividade.atividade] = (contagemAtividades[dadoAtividade.atividade] || 0) + 1;
        });

        const contextAtv = document.getElementById('graficoSemanas').getContext('2d');
        
        //Essa condicional faz com que o gráfico anterior seja destruído para surgir um novo.
        //Isso impede que o chart.js tenha algum bug, então ele destrói o gráfico anterior
        if(meuGrafico !== null){
            meuGrafico.destroy();
        }

        meuGrafico = new Chart(contextAtv, {
            type:'bar',
            data:{
                labels: Object.keys(contagemAtividades),
                datasets: [{
                    label: 'Volume de Produção',
                    data: Object.values(contagemAtividades),
                    backgroundColor: 'rgba(102,0,153,1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options:{
                responsive:true,
                scales: { y: {beginAtZero: true}}
            }
        });
    }
function renderizarTabela(dados){
    const corpoTabela = document.getElementById("corpoTabela");
    corpoTabela.innerHTML = "";//Limpa a tabela

    if(dados.length === 0)
    {
        corpoTabela.innerHTML = `<tr><td colspan="5" style="text-align: center;"> Nenhum dado encontrado neste período</td></tr>`;
        return;
    }

    const dadosPorColaborador = {};

    //O forEach abaixo vai agrupar dados por colaborador
    dados.forEach(tarefa => {
        const colab = tarefa.colaborador;
        //pega o peso do dicionário definido anteriormente, caso não esteja registrado lá, 
        //ele categoriza como 1.0
        const peso = pesosAtividades[tarefa.atividade] || 1.0;

        if(!dadosPorColaborador[colab])
        {
            dadosPorColaborador[colab] = { producao: 0, tempoTotal: 0, somaPesos: 0, tempoPonderado: 0 };
        }

        dadosPorColaborador[colab].producao += 1;
        dadosPorColaborador[colab].tempoTotal += tarefa.tempoGastoMinutos;
        dadosPorColaborador[colab].somaPesos += peso;

        dadosPorColaborador[colab].tempoPonderado += (tarefa.tempoGastoMinutos / peso);
    });

    //As linhas HTML serão criadas devido ao código abaixo:
    for(const [nome, metricas] of Object.entries(dadosPorColaborador))
    {
        const tmaReal = (metricas.tempoTotal / metricas.producao).toFixed(1);
        const pesoMedio = (metricas.somaPesos / metricas.producao).toFixed(1);
        const tmaPorPeso = (metricas.tempoPonderado / metricas.producao).toFixed(1);

        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td><strong>${nome}</strong></td>
        <td>${metricas.producao}</td>
        <td>${pesoMedio}</td>
        <td>${tmaReal} min</td>
        <td><strong style ="color: #660099;">${tmaPorPeso} min</strong></td>
        `;
        corpoTabela.appendChild(tr);
    }
}

inicializarDashboard();
});