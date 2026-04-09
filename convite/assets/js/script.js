const boxConvite = document.getElementById("box");
const boxAgradecimento = document.getElementById("box-agradecimento");
const container = document.getElementById("texto");
const somDigitar = document.getElementById("typingSound");
const musicaFundo = document.getElementById("musicaFundo");

const textoPartes = [
    "Bem-vindo ao meu **espaço de evolução**...",
    "O que você vê aqui é o resultado de **código, café e persistência**.",
    "Neste ambiente, transformo desafios em **soluções interativas**.",
    "Este projeto utiliza **Vanilla JS** e **Supabase** para criar experiências imersivas.",
    "Se você chegou até aqui, deixe sua marca na minha **História como DEV**"
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

    const paddingExtra = (alvo === boxAgradecimento) ? 20 : 60;
    let alturaNecessaria = 0;

    if (alvo === boxConvite) {
        if (!container) return;
        const tituloPrincipal = document.getElementById("titulo-principal");
        const alturaTitulo = tituloPrincipal ? tituloPrincipal.getBoundingClientRect().height : 0;
        alturaNecessaria = alturaTitulo + container.scrollHeight + paddingExtra;
    } else {
        const conteudoInterno = alvo.querySelector('.conteudo-agradecimento');
        if (!conteudoInterno) return;
        alturaNecessaria = conteudoInterno.scrollHeight + paddingExtra;
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
        alvo.scrollTo({
            top: alvo.scrollHeight,
            behavior: 'smooth'
        });
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

const SB_URL = "https://ltkbnyxvdnfwhxjlbosy.supabase.co/rest/v1/Confirmados";
const SB_KEY = "sb_publishable_MXC0U_eup-xDZF4WIgXdhw_eYdcfjrJ";

async function confirmar() {
    
    const nomeInput = document.getElementById("nome");
    const nomeCompleto = nomeInput.value.trim();

    const partesDoNome = nomeCompleto.split(/\s+/);
    if (partesDoNome.length < 1 || partesDoNome[0] === "") {
        return alert("Por favor, digite seu nome.");
    }

    const btnAcao = document.querySelector("#acao button");
    if (btnAcao) {
        btnAcao.disabled = true;
        btnAcao.innerText = "Enviando...";
    }

    try {
        const response = await fetch(SB_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY,
            'Authorization': 'Bearer ' + SB_KEY,
            'Prefer': 'return=minimal' },
            body: JSON.stringify({ nome: nomeCompleto })
        });

        if (!response.ok) throw new Error("Erro ao salvar sua presença no BDD");

        let primeiroNome = nomeCompleto.split(" ")[0];
        primeiroNome = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();

        const spanNome = document.getElementById("nome-confirmado");
        if (spanNome) spanNome.innerText = primeiroNome;

        boxConvite.style.opacity = "0";
        setTimeout(() => {
            boxConvite.classList.add("hidden");
            boxAgradecimento.classList.remove("hidden");
            boxAgradecimento.classList.add("aberto");
            atualizarAlturaSuave(boxAgradecimento);
        }, 600);

    } catch (err) {
        console.error(err);
        alert("Erro: " + err.message);
        if (btnAcao) {
            btnAcao.disabled = false;
            btnAcao.innerText = "Deixar sua marca";
        }
    }
}

async function abrirListaConfirmados() {
    const modal = document.getElementById("modal-lista");
    const containerLista = document.getElementById("lista-nomes");
    const contadorTotal = document.getElementById("contador-total");

    if (!modal || !containerLista) return;
    modal.classList.remove("hidden");
    containerLista.innerHTML = "<p style='color: #fff; text-align: center;'>Carregando lista...</p>";

    try {
        const response = await fetch(`${SB_URL}?select=*`, {
            method: 'GET',
            headers: { 
                'apikey': SB_KEY,
                'Authorization': `Bearer ${SB_KEY}`
            }
        });

        if (!response.ok) throw new Error("Não foi possível carregar a lista.");

        const data = await response.json();
        if (contadorTotal) { contadorTotal.innerText = data.length; }

        if (data.length === 0) {
            containerLista.innerHTML = "<p style='color: #fff; text-align: center;'>Ninguém confirmou ainda.</p>";
            return;
        }

        const htmlLista = data.map(item => `
            <div class="nome-item">✅ ${item.nome}</div>
        `).join('');

        containerLista.innerHTML = htmlLista;
        } catch (err) {
        console.error("Erro ao carregar lista:", err);
        containerLista.innerHTML = `
            <p style="color: #ff4d4d; text-align: center; padding: 20px;">
                Não foi possível carregar a lista agora.
            </p>
        `;
    }
}

function fecharListaConfirmados() {
    const modal = document.getElementById("modal-lista");
    if (modal) modal.classList.add("hidden");
}

function pularTexto() {
    somDigitar.pause();

    document.getElementById("btn-pular")?.classList.add("hidden");
    document.getElementById("box-lista-inicial")?.classList.add("hidden");

    container.innerHTML = "";

    textoPartes.forEach((parte, index) => {
        const p = document.createElement("p");
        if (index === textoPartes.length - 1) {
            p.className = "texto-final-centralizado";
        }

        p.innerHTML = parte.replace(/\*\*(.*?)\*\*/g, '<span class="ouro-brilhante">$1</span>');
        
        container.appendChild(p);
    });

    parteAtual = textoPartes.length;
    mostrarInputsConfirmacao();
    atualizarAlturaSuave(boxConvite);
}

function voltarAoInicio() {
    
    fecharListaConfirmados();

    boxAgradecimento.classList.add("hidden");
    boxAgradecimento.classList.remove("aberto");

    boxConvite.classList.add("fechado");
    boxConvite.classList.remove("hidden", "aberto");

    boxConvite.style.height = "150px";
    boxConvite.style.opacity = "1";
    boxConvite.style.transform = "translateY(0)";
    boxConvite.style.cursor = "pointer";

    container.innerHTML = "";
    document.getElementById("nome").value = "";

    parteAtual = 0;
    charIndex = 0;
    paragrafoAtual = null;
    conviteAberto = false;
    emDestaque = false;

    boxConvite.addEventListener("click", abrirConvite);

    document.getElementById("box-lista-inicial")?.classList.remove("hidden");

    document.getElementById("acao")?.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById("btn-fechar-modal")?.addEventListener("click", fecharListaConfirmados);

    document.getElementById("btn-ver-lista")?.addEventListener("click", abrirListaConfirmados);
});