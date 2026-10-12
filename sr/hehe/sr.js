(function() {
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.6;
        const colors = ['#FFB7C5', '#FF8DA9', '#D583FF', '#F6A7C1', '#FFE6F0'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.6 + 0.3;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
    }
}
for (let i = 0; i < 200; i++) {
    particles.push(new Particle());
}
function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
        p.update();
        p.draw();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
}
animateParticles();
const fireCanvas = document.getElementById('fireworks-canvas');
const fireCtx = fireCanvas.getContext('2d');
let fireWidth, fireHeight;
let fireworks = [];
let particlesFire = [];
function resizeFire() {
    fireWidth = window.innerWidth;
    fireHeight = window.innerHeight;
    fireCanvas.width = fireWidth;
    fireCanvas.height = fireHeight;
}
window.addEventListener('resize', resizeFire);
resizeFire();
class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x; this.y = y;
        this.targetX = targetX; this.targetY = targetY;
        this.speed = 5.5;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.radius = 2.8;
        this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
        this.exploded = false;
    }
    update() {
        if (!this.exploded) {
            this.x += this.vx;
            this.y += this.vy;
            const dx = this.x - this.targetX;
            const dy = this.y - this.targetY;
            if (Math.hypot(dx, dy) < 10) {
                this.exploded = true;
                this.createExplosion();
            }
        }
        return !this.exploded;
    }
    createExplosion() {
        const count = 48;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            particlesFire.push({
                x: this.targetX, y: this.targetY,
                vx: vx, vy: vy,
                life: 1.0,
                color: this.color,
                size: Math.random() * 5 + 2,
                gravity: 0.1,
            });
        }
    }
    draw() {
        if (!this.exploded) {
            fireCtx.beginPath();
            fireCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            fireCtx.fillStyle = this.color;
            fireCtx.fill();
        }
    }
}
function updateFireworks() {
    for (let i = fireworks.length-1; i >= 0; i--) {
        const alive = fireworks[i].update();
        if (!alive) fireworks.splice(i,1);
    }
    for (let i=0; i<particlesFire.length; i++) {
        const p = particlesFire[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= 0.02;
        if (p.life <= 0 || p.y > fireHeight+100) {
            particlesFire.splice(i,1);
            i--;
        }
    }
}
function drawFireworks() {
    fireCtx.clearRect(0, 0, fireWidth, fireHeight);
    for (let f of fireworks) f.draw();
    for (let p of particlesFire) {
        fireCtx.beginPath();
        fireCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        fireCtx.fillStyle = p.color;
        fireCtx.globalAlpha = p.life * 0.9;
        fireCtx.fill();
    }
    fireCtx.globalAlpha = 1;
}
function launchRandomFirework() {
    const startX = Math.random() * fireWidth;
    const startY = fireHeight;
    const targetX = Math.random() * fireWidth;
    const targetY = Math.random() * (fireHeight * 0.65) + 100;
    fireworks.push(new Firework(startX, startY, targetX, targetY));
}
setInterval(() => { if(document.visibilityState === 'visible') launchRandomFirework(); }, 1000);
setTimeout(() => { for(let i=0;i<4;i++) launchRandomFirework(); }, 300);
function fireworkLoop() {
    updateFireworks();
    drawFireworks();
    requestAnimationFrame(fireworkLoop);
}
fireworkLoop();
function burstFireworkAround(x, y) {
    for(let i=0;i<3;i++) {
        const offsetX = (Math.random() - 0.5) * 120;
        const offsetY = (Math.random() - 0.5) * 80 - 30;
        const targetX = x + offsetX;
        const targetY = y + offsetY - 20;
        const startX = Math.random() * fireWidth;
        const startY = fireHeight;
        fireworks.push(new Firework(startX, startY, targetX, targetY));
    }
}
let birthdayTarget = (function() {
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, 5, 5);
    return target;
})();
function updateCountdown() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const birthdayThisYear = new Date(now.getFullYear(), 5, 5);
    if (today.getTime() === birthdayThisYear.getTime()) {
        document.getElementById('days').innerText = '0';
        document.getElementById('hours').innerText = '00';
        document.getElementById('mins').innerText = '00';
        document.getElementById('secs').innerText = '00';
        if (!window._celebrated) {
            window._celebrated = true;
            for (let i = 0; i < 12; i++) setTimeout(() => launchRandomFirework(), i * 100);
        }
        return;
    }
    if (now > birthdayTarget) {
        birthdayTarget = new Date(now.getFullYear() + 1, 5, 5);
    }
    const diff = birthdayTarget - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('mins').innerText = mins < 10 ? '0' + mins : mins;
    document.getElementById('secs').innerText = secs < 10 ? '0' + secs : secs;
}
updateCountdown();
setInterval(updateCountdown,1000);
const card = document.getElementById('flipCard');
let hasFlipped = false;
function handleCardFlip(e) {
    if (hasFlipped) return;
    card.classList.add('flipped');
    hasFlipped = true;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for(let i=0;i<4;i++) {
        setTimeout(() => {
            burstFireworkAround(centerX, centerY);
        }, i * 100);
    }
    setTimeout(() => {
        for(let i=0;i<2;i++) launchRandomFirework();
    }, 200);
}
card.addEventListener('click', handleCardFlip);
let audio = null;
let isPlaying = false;
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
function initAudio() {
    if(audio) return;
    audio = new Audio('../music/sr.mp3');
    audio.loop = true;
    audio.volume = 0.4;
}
musicBtn.addEventListener('click', () => {
    initAudio();
    if(!isPlaying) {
        audio.play().then(()=> {
            isPlaying = true;
            musicIcon.className = 'fas fa-music';
            musicBtn.style.boxShadow = '0 0 20px #FFB7C5';
        }).catch(e=> console.log("²¥·ÅÒì³£"));
    } else {
        audio.pause();
        isPlaying = false;
        musicIcon.className = 'fas fa-play';
    }
});
const onePlay = () => {
    initAudio();
    if(!isPlaying && audio) {
        audio.play().then(()=> {
            isPlaying = true;
            musicIcon.className = 'fas fa-music';
        }).catch(()=>{});
    }
    document.removeEventListener('click', onePlay);
    document.removeEventListener('touchstart', onePlay);
};
document.addEventListener('click', onePlay);
document.addEventListener('touchstart', onePlay);
})();