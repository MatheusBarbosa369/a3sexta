let clientes = [];
let itensCardapio = [];
let carrinho = [];
let clienteAtual = null;

// Função para carregar o cardápio do servidor JSON
function carregarCardapio() {
    fetch('http://localhost:3000/cardapio') // Rota para o JSON Server
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o cardápio');
            }
            return response.json();
        })
        .then(data => {
            itensCardapio = data; // Armazena os dados no array global
            atualizarMenu(); // Atualiza o menu com os itens recebidos
        })
        .catch(error => console.error('Erro:', error));
}

// Função para cadastrar cliente
function cadastrarCliente() {
    const nome = document.getElementById('nomeCliente').value;
    const endereço = document.getElementById('endereçoCliente').value;

    if (nome && endereço) {
        clienteAtual = { nome, endereço };
        clientes.push(clienteAtual);
        alert(`Cliente cadastrado: ${nome}, endereço: ${endereço}`);
    } else {
        alert('Por favor, insira um nome e endereço correto');
    }
}

// Atualiza a lista de itens no menu
function atualizarMenu() {
    const lista = document.getElementById('itensMenu');
    lista.innerHTML = '';

    itensCardapio.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.nome} - R$ ${item.preco} - Estoque: ${item.estoque}
            <button onclick="adicionarCarrinho(${item.id})">Adicionar</button>`;
        lista.appendChild(li);
    });
}

// Adiciona um item ao carrinho
function adicionarCarrinho(itemId) {
    const item = itensCardapio.find(i => i.id === itemId);

    if (item && item.estoque > 0) {
        item.estoque--;
        const carrinhoItem = carrinho.find(i => i.id === itemId);

        if (carrinhoItem) {
            carrinhoItem.quantidade++;
        } else {
            carrinho.push({ ...item, quantidade: 1 });
        }

        alert(`${item.nome} adicionado ao carrinho.`);
        atualizarMenu();
        atualizarCarrinho();
    } else {
        alert('Estoque insuficiente.');
    }
}

// Remove um item do carrinho
function removerCarrinho(itemId) {
    const itemIndex = carrinho.findIndex(i => i.id === itemId);

    if (itemIndex !== -1) {
        const item = carrinho[itemIndex];
        carrinho.splice(itemIndex, 1);
        itensCardapio.find(i => i.id === itemId).estoque += item.quantidade;

        alert(`${item.nome} removido do carrinho.`);
        atualizarMenu();
        atualizarCarrinho();
    }
}

// Atualiza a lista de itens no carrinho
function atualizarCarrinho() {
    const listaCarrinho = document.getElementById('itensCarrinho');
    listaCarrinho.innerHTML = '';

    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)} 
            <button onclick="removerCarrinho(${item.id})">Remover</button>`;
        listaCarrinho.appendChild(li);
    });

    calcularTotalCarrinho();
}

// Calcula o total do carrinho
function calcularTotalCarrinho() {
    const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    document.getElementById('totalCarrinho').textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Finaliza o pedido
function finalizarPedido() {
    if (carrinho.length > 0 && clienteAtual) {
        const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
        alert(`Pedido do cliente: ${clienteAtual.nome} finalizado! Total a pagar: R$ ${total.toFixed(2)}`);

        carrinho = [];
        atualizarCarrinho();
    } else {
        alert('Carrinho vazio ou cliente não cadastrado.');
    }
}

// Inicializa o menu ao carregar a página
document.addEventListener('DOMContentLoaded', carregarCardapio);
