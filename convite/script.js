const boxConvite = document.getElementById("box");
const boxAgradecimento = document.getElementById("box-agradecimento");
const container = document.getElementById("texto");
const somDigitar = document.getElementById("typingSound");
const musicaFundo = document.getElementById("musicaFundo");

const textoPartes = [
    "Com muita alegria no coração, queremos convidar toda a família para um momento muito especial: a comemoração dos **92 anos** da nossa querida **Maria Amélia**.",
    "São **92 anos** de história, amor, ensinamentos e uma vida que é exemplo para todos nós. Uma mulher forte, sábia e cheia de luz, que construiu uma família linda e merece toda a nossa homenagem.",
    "Nos reuniremos com muito carinho no dia **28/03/2026**, a partir das **12h**, na **casa da Irma**, para celebrarmos juntos essa trajetória tão linda.",
    "Preparamos tudo com muito carinho — terá almoço, bolo e aquele clima gostoso de união que ela tanto ama. Mas o presente mais importante será a presença de cada um de vocês, celebrando juntos essa vida tão precisa.",
    "Venham compartilhar esse dia inesquecível conosco. Tenho certeza de que ela ficará imensamente feliz em ver a família reunida, como sempre sonhou.",
    "Esperamos vocês com muito amor! 💖",
    "**Por isso, nesta data tão especial, contamos com o seu carinho e a sua presença.**",
    "**Você vem?**"
];

let parteAtual = 0;
let charIndex = 0;
let paragrafoAtual = null;
let conviteAberto = false;
let emDestaque = false;

boxConvite.addEventListener("click", abrirConvite);

function abrirConvite() {
    if (conviteAberto) return;
    conviteAberto = true;

    boxConvite.removeEventListener("click", abrirConvite);
    boxConvite.style.cursor = "default";

    boxConvite.classList.remove("fechado");
    boxConvite.classList.add("aberto");
    boxConvite.style.height = "150px";

    musicaFundo.volume = 0.05;
    musicaFundo.play().catch(() => { });

    const btnPular = document.getElementById("btn-pular");
    if (btnPular) btnPular.classList.remove("hidden");

    const boxListaInicial = document.getElementById("box-lista-inicial");
    if (boxListaInicial) boxListaInicial.classList.add("hidden");

    setTimeout(digitar, 800);
}

function atualizarAlturaSuave(alvo = boxConvite) {
    if (!alvo) return;

    const paddingExtra = 60;
    let alturaNecessaria = 0;

    if (alvo === boxConvite) {
        if (!container) return;
        const tituloPrincipal = document.getElementById("titulo-principal");
        const alturaTitulo = tituloPrincipal ? tituloPrincipal.getBoundingClientRect().height : 0;
        alturaNecessaria = alturaTitulo + container.scrollHeight + paddingExtra;
    } else {
        const conteudoInterno = alvo.querySelector('.conteudo-agradecimento');
        if (conteudoInterno) {
            alturaNecessaria = conteudoInterno.scrollHeight + paddingExtra;
        } else {
            return;
        }
    }

    const limiteMaximoPixels = window.innerHeight * 0.8;

    if (alturaNecessaria < limiteMaximoPixels) {
        alvo.style.height = alturaNecessaria + "px";
        alvo.style.overflowY = "hidden";
    } else {
        alvo.style.height = limiteMaximoPixels + "px";
        alvo.style.overflowY = "auto";
    }

    requestAnimationFrame(() => {
        alvo.scrollTop = alvo.scrollHeight;
    });
}

function digitar() {
    if (parteAtual >= textoPartes.length) {
        somDigitar.pause();
        mostrarInputsConfirmacao();
        return;
    }

    if (!paragrafoAtual) {
        paragrafoAtual = document.createElement("p");
        if (parteAtual >= textoPartes.length - 2) {
            paragrafoAtual.className = "texto-final-centralizado ouro-brilhante";
        }
        container.appendChild(paragrafoAtual);

        somDigitar.currentTime = 0;
        somDigitar.volume = 0.4;
        somDigitar.play().catch(() => { });
    }

    const textoAtual = textoPartes[parteAtual];

    if (charIndex < textoAtual.length) {
        if (textoAtual.substring(charIndex, charIndex + 2) === "**") {
            emDestaque = !emDestaque;
            charIndex += 2;
            digitar();
            return;
        }

        const char = textoAtual.charAt(charIndex);

        if (emDestaque) {
            paragrafoAtual.innerHTML += `<span class="ouro-brilhante">${char}</span>`;
        } else {
            paragrafoAtual.innerHTML += char;
        }

        requestAnimationFrame(() => atualizarAlturaSuave(boxConvite));

        let delay = 35;
        if (char === ",") delay = 300;
        else if (char === "." || char === "!" || char === "💖") delay = 700;

        charIndex++;
        setTimeout(digitar, delay);
    } else {
        somDigitar.pause();

        parteAtual++;
        charIndex = 0;
        paragrafoAtual = null;
        emDestaque = false;

        setTimeout(digitar, 1000);
    }
}

function mostrarInputsConfirmacao() {
    const btnPular = document.getElementById("btn-pular");
    if (btnPular) btnPular.classList.add("hidden");

    const acao = document.getElementById("acao");
    acao.classList.remove("hidden");
    atualizarAlturaSuave(boxConvite);
}

const SUPABASE_URL = "https://ltkbnyxvdnfwhxjlbosy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MXC0U_eup-xDZF4WIgXdhw_eYdcfjrJ";

async function confirmar() {
    const nomeInput = document.getElementById("nome");
    const nomeCompleto = nomeInput.value.trim();

    const partesDoNome = nomeCompleto.split(/\s+/);
    if (partesDoNome.length < 2 || partesDoNome[1] === "") {
        return alert("Por favor, digite seu Nome e pelo menos um Sobrenome (Ex: João Silva).");
    }

    const btnAcao = document.querySelector("#acao button");
    if (btnAcao) {
        btnAcao.disabled = true;
        btnAcao.innerText = "Enviando...";
    }

    try {
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { data, error } = await supabaseClient
            .from('Confirmados')
            .insert([{ nome: nomeCompleto }]);

        if (error) throw error;

        let primeiroNome = nomeCompleto;

        if (nomeCompleto.includes(" ")) {
            primeiroNome = nomeCompleto.split(" ")[0];
        }

        primeiroNome = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();

        const spanNome = document.getElementById("nome-confirmado");
        if (spanNome) {
            spanNome.innerText = primeiroNome;
        }

        boxConvite.style.opacity = "0";
        boxConvite.style.transform = "translateY(-20px)";

        setTimeout(() => {
            boxConvite.classList.add("hidden");
            boxAgradecimento.classList.remove("hidden");

            void boxAgradecimento.offsetWidth;

            boxAgradecimento.classList.remove("fechado");
            boxAgradecimento.classList.add("aberto");

            atualizarAlturaSuave(boxAgradecimento);
        }, 600);

    } catch (err) {
        console.error(err);
        alert("Erro ao salvar no banco de dados. Tente novamente!");
        if (btnAcao) {
            btnAcao.disabled = false;
            btnAcao.innerText = "Confirmar Presença";
        }
    }
}

function mostrarNovoInput() {
    document.getElementById("pergunta-bloco").classList.add("hidden");

    const blocoNovo = document.getElementById("novo-registro");
    blocoNovo.classList.remove("hidden");

    atualizarAlturaSuave(boxAgradecimento);

    document.getElementById("nome-novo").focus();
}

async function confirmarNovo() {
    const nomeInputNovo = document.getElementById("nome-novo");
    const nomeNovo = nomeInputNovo.value.trim();

    const partesDoNomeNovo = nomeNovo.split(/\s+/);
    if (partesDoNomeNovo.length < 2 || partesDoNomeNovo[1] === "") {
        return alert("Por favor, digite o Nome e Sobrenome da outra pessoa.");
    }

    const btnNovo = document.querySelector("#novo-registro button");
    if (btnNovo) {
        btnNovo.disabled = true;
        btnNovo.innerText = "Enviando...";
    }

    try {
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { data, error } = await supabaseClient
            .from('Confirmados')
            .insert([{ nome: nomeNovo }]);

        if (error) throw error;

        let primeiroNomeNovo = nomeNovo;

        if (nomeNovo.includes(" ")) {
            primeiroNomeNovo = nomeNovo.split(" ")[0];
        }

        primeiroNomeNovo = primeiroNomeNovo.charAt(0).toUpperCase() + primeiroNomeNovo.slice(1).toLowerCase();

        const spanNome = document.getElementById("nome-confirmado");
        if (spanNome) {
            spanNome.innerText = primeiroNomeNovo;
        }

        document.getElementById("novo-registro").classList.add("hidden");
        document.getElementById("pergunta-bloco").classList.remove("hidden");
        nomeInputNovo.value = "";

        atualizarAlturaSuave(boxAgradecimento);

    } catch (err) {
        console.error(err);
        alert("Erro ao salvar no banco de dados. Tente novamente!");
    } finally {
        if (btnNovo) {
            btnNovo.disabled = false;
            btnNovo.innerText = "Confirmar Presença";
        }
    }
}

async function abrirListaConfirmados() {
    const modal = document.getElementById("modal-lista");
    const containerLista = document.getElementById("lista-nomes");
    const obsOrdem = document.getElementById("obs-ordem");
    const contadorTotal = document.getElementById("contador-total");

    if (!modal || !containerLista) return;

    modal.classList.remove("hidden");

    if (obsOrdem) obsOrdem.innerText = "";
    if (contadorTotal) contadorTotal.innerText = "...";
    containerLista.innerHTML = "<p style='color: #fff; text-align: center;'>Carregando lista...</p>";

    try {
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // 🛠️ ADICIONADO: o 'count' aqui na captura do resultado!
        const { data, error, count } = await supabaseClient
            .from('Confirmados')
            .select('nome', { count: 'exact' })
            .order('created_at', { ascending: true });

        if (error) throw error;

        // 📊 ADICIONADO: Coloca o número na tela!
        if (contadorTotal) {
            contadorTotal.innerText = count !== null ? count : data.length;
        }

        if (data.length === 0) {
            containerLista.innerHTML = "<p style='color: #fff; text-align: center;'>Ninguém confirmou ainda. Seja o primeiro!</p>";
            return;
        }

        containerLista.innerHTML = "";
        data.forEach(item => {
            containerLista.innerHTML += `<div class="nome-item">✅ ${item.nome}</div>`;
        });

        if (obsOrdem) {
            obsOrdem.innerText = "📋 A lista está em ordem de confirmação.";
        }

    } catch (err) {
        console.error(err);
        containerLista.innerHTML = "<p style='color: #fff; text-align: center;'>Erro ao carregar os nomes. Tente novamente.</p>";
    }
}

function fecharListaConfirmados() {
    const modal = document.getElementById("modal-lista");
    if (modal) modal.classList.add("hidden");
}

function pularTexto() {
    somDigitar.pause();

    const btnPular = document.getElementById("btn-pular");
    if (btnPular) btnPular.classList.add("hidden");

    const boxListaInicial = document.getElementById("box-lista-inicial");
    if (boxListaInicial) boxListaInicial.classList.add("hidden");

    container.innerHTML = "";

    textoPartes.forEach((parte, index) => {
        const p = document.createElement("p");

        if (index >= textoPartes.length - 2) {
            p.className = "texto-final-centralizado ouro-brilhante";
        }

        let textoFormatado = parte;
        let toggleDestaque = false;

        while (textoFormatado.includes("**")) {
            if (!toggleDestaque) {
                textoFormatado = textoFormatado.replace("**", '<span class="ouro-brilhante">');
                toggleDestaque = true;
            } else {
                textoFormatado = textoFormatado.replace("**", "</span>");
                toggleDestaque = false;
            }
        }

        p.innerHTML = textoFormatado;
        container.appendChild(p);
    });

    parteAtual = textoPartes.length;
    mostrarInputsConfirmacao();
}

function voltarAoInicio() {
    boxAgradecimento.classList.add("hidden");
    boxAgradecimento.classList.remove("aberto");

    boxConvite.classList.remove("hidden");
    boxConvite.classList.add("fechado");
    boxConvite.classList.remove("aberto");
    boxConvite.style.height = "150px";
    boxConvite.style.opacity = "1";
    boxConvite.style.transform = "translateY(0)";

    container.innerHTML = "";

    parteAtual = 0;
    charIndex = 0;
    paragrafoAtual = null;
    conviteAberto = false;
    emDestaque = false;

    boxConvite.addEventListener("click", abrirConvite);
    boxConvite.style.cursor = "pointer";

    const boxListaInicial = document.getElementById("box-lista-inicial");
    if (boxListaInicial) boxListaInicial.classList.remove("hidden");

    const acao = document.getElementById("acao");
    if (acao) acao.classList.add("hidden");
}