document.addEventListener("DOMContentLoaded", () => {
    const checkTemaEscuro = document.getElementById("checkTemaEscuro");
    const botaoSair = document.getElementById("botaoSair");

    //abaixo serve para verificar se já tem um tema salvo na sessão atual
    //impedindo assim de trocar de aba e sair do tema escuro (ou claro)
    const temaSalvo = sessionStorage.getItem("temaSite");

    if(temaSalvo === "dark"){
        document.body.classList.add("dark-mode");
        checkTemaEscuro.checked = true;
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
