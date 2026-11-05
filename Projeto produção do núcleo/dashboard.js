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
});

/*
function inicializarDashboard() {
    //Essa constantes vai puxar os dados que persistentes presentes na página inicial
    const atividades = JSON.parse(localStorage.getItem("atividades")) || [];
    
    const atividadesFinalizadas = atividades.filter(tarefa => tarefa.status === "Finalizada" &&
        a.tempoGastoMinutos !== undefined);

    //Atualizando os cards superiores
    document.getElementById("totalAtividades").textContent = atividadesFinalizadas.length;

    if(atividadesFinalizadas.length > 0){
        const tempoTotal = atividadesFinalizadas.reduce((acc, curr) => acc + curr.tempoGastoMinutos,0);
        const tempoMedio = Math.round(tempoTotal/atividadesFinalizadas.length);
        document.getElementById("tempoMedioGeral").textContent = `${tempoMedio} min`;
    }

    //prepara dados para os gráficos
    renderizarGraficos(atividadesFinalizadas);
}

function renderizarGraficos(dados){
    const corBase = 'rgba(102, 0, 153, 0.7)';
    const corBorda = 'rgba(102, 0, 153, 1)';

    const contagemAtividades = {};
    dados.forEach(d => {
        (contagemAtividades[d.atividade] || 0) + 1;
    });

    const ctxSemanas = document.getElementById('graficoSemanas').getContext('2d');
    new Chart(ctxSemanas, {
        type:'bar',
        data: {
            labels: Object.keys(contagemAtividades),
            datasets: [{
                label: 'Quantidade Concluída',
                data: Object.values(contagemAtividades),
                backgroundColor: corBase,
                borderColor: corBorda,
                borderWidth: 1
            }]
        },
    })
}
*/