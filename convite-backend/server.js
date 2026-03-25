const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Libera o acesso para o seu frontend
app.use(express.json()); // Permite que o Node leia dados em formato JSON

// Banco de dados temporário na memória do servidor
let listaConfirmados = [];

// 📥 ROTA 1: Recebe a confirmação do site (POST)
app.post('/confirmar', (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: "Nome é obrigatório!" });
    }

    const novoConvidado = {
        id: listaConfirmados.length + 1,
        nome: nome,
        dataHora: new Date().toLocaleString('pt-BR')
    };

    listaConfirmados.push(novoConvidado);

    console.log(`✅ Nova presença confirmada: ${nome}`);
    
    res.status(201).json({ 
        sucesso: true, 
        mensagem: "Presença confirmada no banco de dados!" 
    });
});

// 📤 ROTA 2: Mostra a lista de quem já confirmou (GET)
app.get('/lista', (req, res) => {
    res.json(listaConfirmados);
});

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend rodando liso em http://localhost:${PORT}`);
    console.log(`📋 Veja a lista de confirmados em http://localhost:${PORT}/lista`);
});