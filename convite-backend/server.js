require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 📥 ROUT 1: Receive the confirmation from the website (POST)
app.post('/confirmar', async (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: "Nome é obrigatório!" });
    }

    const { data, error } = await supabase
        .from('Confirmados')
        .insert([{ nome: nome}]);

    if (error) {
        console.error("Erro ao salvar no Supabase:", error);
        return res.status(500).json({ erro: "Erro ao salvar no banco de dados." });
    }

    res.status(201).json({ 
        sucesso: true, 
        mensagem: "Presença salva com sucesso no banco de dados!" 
        });

});

// 📤 ROUT 2: Show a list of confirmed people (GET)
app.get('/lista', async (req, res) => {
    const { data, error } = await supabase
        .from('Confirmados')
        .select('*');

    if (error) { return res.status(400).json({erro: error.message});}    
    
    res.json(data);
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend on fire on http://localhost:${PORT}`);
    console.log(`📋 See the list on http://localhost:${PORT}/lista`);
});