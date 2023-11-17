// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo realiza as operações de CRUD a partir de uma API baseada no JSONServer
// O servidor JSONServer fica hospedado na seguinte URL
// https://jsonserver.rommelpuc.repl.co/contatos
//
// Para fazer o seu servidor, acesse o projeto do JSONServer no Replit, faça o 
// fork do projeto e altere o arquivo db.json para incluir os dados do seu projeto.
// URL Projeto JSONServer: https://replit.com/@rommelpuc/JSONServer
//
// Autor: Rommel Vieira Carneiro
// Data: 03/10/2023

// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = "https://jsonserversprint2.mateusfaissal.repl.co/operacoes"; 

function displayMessage(mensagem) {
    msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

function readContato(processaDados) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            processaDados(data);
        })
        .catch(error => {
            console.error('Erro ao ler contatos via API JSONServer:', error);
            displayMessage("Erro ao ler operações");
        });
}

function createContato(contato, refreshFunction) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contato),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Operação inserida com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao inserir contato via API JSONServer:', error);
            displayMessage("Erro ao inserir operação");
        });
}

function updateContato(id, contato, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contato),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Operação alterada com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao atualizar contato via API JSONServer:', error);
            displayMessage("Erro ao atualizar operação");
        });
}

function deleteContato(id, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Operação removida com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao remover contato via API JSONServer:', error);
            displayMessage("Erro ao remover operação");
        });
}

function sortOperationsByValue() {
    readContato(dados => {
        let sortedData = dados.sort((a, b) => parseFloat(a.valor) - parseFloat(b.valor));
        exibeContatos(sortedData); // Passa os dados ordenados para a função de exibição
    });
}
// Função para filtrar operações por categoria
function filterOperationsByCategory() {
    let category = document.getElementById('filterCategoria').value;
    readContato(dados => {
        let filteredData = dados.filter(contato => contato.tipo.toLowerCase().includes(category.toLowerCase()));
        exibeContatos(filteredData); // Passa os dados filtrados para a função de exibição
    });
}

function showAllOperations() {
    exibeContatos(); 
}

function populaTabela(dados) {
    let tableContatos = document.getElementById("table-contatos");
    tableContatos.innerHTML = ""; // Limpa a tabela

    // Popula a tabela com os dados passados para a função
    dados.forEach(contato => {
        tableContatos.innerHTML += `<tr>
            <td scope="row">${contato.id}</td>
            <td>${contato.valor}</td>
            <td>${contato.descrição}</td>
            <td>${contato.categoria}</td>
            <td>${contato.tipo}</td>
        </tr>`;
    });
}

function exibeContatos(dados = null) {
    let tableContatos = document.getElementById("table-contatos");

    // Se nenhum dado for passado para a função, busca os dados
    if (!dados) {
        readContato(data => {
            populaTabela(data);
        });
    } else {
        // Se dados forem passados, apenas popula a tabela com eles
        populaTabela(dados);
    }
}

function init() {
    // Define uma variável para o formulário de contato
    formContato = document.getElementById("form-contato");

    // Adiciona funções para tratar os eventos 
    btnInsert = document.getElementById("btnInsert");
    btnInsert.addEventListener('click', function () {
        // Verifica se o formulário está preenchido corretamente
        if (!formContato.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        // Obtem os valores dos campos do formulário
        let campoNome = document.getElementById('inputNome').value;
        let campoTelefone = document.getElementById('inputTelefone').value;
        let campoCategoria = document.getElementById('inputCategoria').value;
        let campoSite = document.getElementById('inputSite').value;

        // Cria um objeto com os dados do contato
        let contato = {
            valor: campoNome,
            descrição: campoTelefone,
            categoria: campoCategoria,
            tipo: campoSite
        };

        // Cria o contato no banco de dados
        createContato(contato, exibeContatos);

        // Limpa o formulario
        formContato.reset()
    });

    // Trata o click do botão Alterar
    btnUpdate = document.getElementById("btnUpdate");
    btnUpdate.addEventListener('click', function () {
        // Obtem os valores dos campos do formulário
        let campoId = document.getElementById("inputId").value;
        if (campoId == "") {
            displayMessage("Selecione antes uma operação para ser alterada.");
            return;
        }

        // Obtem os valores dos campos do formulário
        let campoNome = document.getElementById('inputNome').value;
        let campoTelefone = document.getElementById('inputTelefone').value;
        let campoCategoria = document.getElementById('inputCategoria').value;
        let campoSite = document.getElementById('inputSite').value;

        // Cria um objeto com os dados do contato
        let contato = {
            valor: campoNome,
            descrição: campoTelefone,
            categoria: campoCategoria,
            tipo: campoSite
        };

        // Altera o contato no banco de dados
        updateContato(parseInt(campoId), contato, exibeContatos);

        // Limpa o formulario
        formContato.reset()
    });

    // Trata o click do botão Excluir
    btnDelete = document.getElementById('btnDelete');
    btnDelete.addEventListener('click', function () {
        let campoId = document.getElementById('inputId').value;
        if (campoId == "") {
            displayMessage("Selecione uma operação a ser excluída.");
            return;
        }

        // Exclui o contato no banco de dados
        deleteContato(parseInt(campoId), exibeContatos);

        // Limpa o formulario
        formContato.reset()
    });

    // Trata o click do botão Listar Contatos
    btnClear = document.getElementById('btnClear');
    btnClear.addEventListener('click', function () {
        formContato.reset()
    });

    // Oculta a mensagem de aviso após alguns 5 segundos
    msg = document.getElementById('msg');
    msg.addEventListener("DOMSubtreeModified", function (e) {
        if (e.target.innerHTML == "") return;
        setTimeout(function () {
            alert = msg.getElementsByClassName("alert");
            alert[0].remove();
        }, 5000);
    })

    // Preenche o formulário quando o usuario clicar em uma linha da tabela 
    gridContatos = document.getElementById("grid-contatos");
    gridContatos.addEventListener('click', function (e) {
        if (e.target.tagName == "TD") {

            // Obtem as colunas da linha selecionada na tabela
            let linhaContato = e.target.parentNode;
            colunas = linhaContato.querySelectorAll("td");

            // Preenche os campos do formulário com os dados da linha selecionada na tabela
            document.getElementById('inputId').value = colunas[0].innerText;
            document.getElementById('inputNome').value = colunas[1].innerText;
            document.getElementById('inputTelefone').value = colunas[2].innerText;
            document.getElementById('inputCategoria').value = colunas[3].innerText;
            document.getElementById('inputSite').value = colunas[4].innerText;

        }
    });

    exibeContatos();
    document.getElementById('btnSort').addEventListener('click', sortOperationsByValue);
document.getElementById('btnFilter').addEventListener('click', filterOperationsByCategory);
document.getElementById('btnShowAll').addEventListener('click', showAllOperations);

}

