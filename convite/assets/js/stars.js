const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let stars = [];
const starCount = 200;
let isResizing = false;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function criarEstrelas() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: random(0, width),
            y: random(0, height),
            radius: random(0.5, 2),
            alpha: random(0.1, 1),
            delta: random(0.005, 0.02) * (Math.random() > 0.5 ? 1 : -1)
        });
    }
}

function animarEstrelas() {
    if (isResizing) {
        requestAnimationFrame(animarEstrelas);
        return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        star.alpha += star.delta;

        if (star.alpha <= 0) {
            star.alpha = 0;
            star.delta = Math.abs(random(0.005, 0.02));
        } else if (star.alpha >= 1) {
            star.alpha = 1;
            star.delta = -Math.abs(random(0.005, 0.02));
        }
    }
    requestAnimationFrame(animarEstrelas);
}

let resizeTimeout;

window.addEventListener('resize', () => {
    isResizing = true;

    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        ctx.clearRect(0, 0, width, height);
        criarEstrelas();

        isResizing = false;
    }, 100);
});

window.addEventListener('load', () => {
    criarEstrelas();
    animarEstrelas();
});