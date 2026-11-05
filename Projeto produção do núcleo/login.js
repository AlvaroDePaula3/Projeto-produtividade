//teste local para a aplicação simular um login

document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault(); 
            //O código acima impede a página de recarregar

            //abaixo guarda o login e a senha em uma variável constante
            const loginDigitado = document.getElementById('loginDeRede').value;
            const senhaDigitada = document.getElementById('senha').value;

            //Abaixo vai procurar no banco de dados um login e senha
            const usuarioSalvoLocal = localStorage.getItem(loginDigitado);

            //abaixo vai verificar se o usuário realmente existe
            if(usuarioSalvoLocal)
                {
                const usuarioSalvo = JSON.parse(usuarioSalvoLocal);

                //vericar se a senha está correta
                if(senhaDigitada === usuarioSalvo.senha)
                {
                    //se a senha estiver correta:
                    sessionStorage.setItem(
                        'usuarioLogado', 
                        JSON.stringify(usuarioSalvo)
                );
                    window.location.href = "paginaInicial.html"
                } else {
                    //se a senha estiver errada:
                    alert("Senha incorreta, tente novamente")
                }
            } else {
                alert("O usuário não foi encontrado, ou não existe, tente novamente ou faça o cadastro.")
            }
        });