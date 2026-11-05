document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault(); 
    //O código acima impede a página de recarregar
    
    const nome = document.getElementById('nomeCadastro').value;
    const login = document.getElementById('loginDeRedeCadastro').value;
    const senha = document.getElementById('senhaCadastro').value;
    const email = document.getElementById('emailCorporativo').value;

    const dadosDoUsuarioSimulacao = {
        nome: nome,
        login: login,
        senha: senha,
        email: email
    };

    localStorage.setItem(login, JSON.stringify(dadosDoUsuarioSimulacao));

    alert("Cadastro realizado com sucesso! Clique em 'Ok' para ser redirecionado para o login...");
    window.location.href = "inicio.html";
});

//O código acima simula um registro localmente
