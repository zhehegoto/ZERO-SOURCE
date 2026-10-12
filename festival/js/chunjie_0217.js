// 春节 · 液态玻璃版（烟花粒子 + 福字翻转 + 卡片倾斜）
(function() {
    // ===== 背景浮动光斑 =====
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let orbs = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Orb {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50;
            this.radius = 30 + Math.random() * 80;
            this.speed = 0.3 + Math.random() * 0.6;
            this.drift = (Math.random() - 0.5) * 0.5;
            this.hue = Math.random() > 0.5 ? 350 : 30;
            this.alpha = 0.04 + Math.random() * 0.06;
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            if (this.y < -this.radius * 2) this.reset();
        }
        draw() {
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            g.addColorStop(0, `hsla(${this.hue}, 90%, 65%, ${this.alpha})`);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 12; i++) orbs.push(new Orb());

    function animateBg() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        orbs.forEach(o => { o.update(); o.draw(); });
        requestAnimationFrame(animateBg);
    }
    animateBg();

    // ===== 烟花粒子（点击触发） =====
    let particles = [];
    const fwColors = ['#ff4d6d', '#ff8c42', '#ffd166', '#fff', '#ff6b9d', '#ffa94d'];

    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.color = color;
            this.life = 1;
            this.decay = 0.01 + Math.random() * 0.012;
            this.size = 2 + Math.random() * 3;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.06;
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.life -= this.decay;
            return this.life > 0;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function launchFirework(x, y) {
        const color = fwColors[Math.floor(Math.random() * fwColors.length)];
        const count = 50 + Math.floor(Math.random() * 30);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    function animateFw() {
        particles = particles.filter(p => {
            const alive = p.update();
            if (alive) p.draw();
            return alive;
        });
        requestAnimationFrame(animateFw);
    }
    animateFw();

    // 按钮放烟花
    const fwBtn = document.getElementById('fireworkBtn');
    if (fwBtn) {
        fwBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = fwBtn.getBoundingClientRect();
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    launchFirework(
                        rect.left + Math.random() * rect.width,
                        rect.top - Math.random() * 100
                    );
                }, i * 150);
            }
        });
    }

    // 点击页面任意位置放小烟花
    document.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('.fu-card')) return;
        launchFirework(e.clientX, e.clientY);
    });

    // ===== 福字翻转 =====
    const fuCard = document.getElementById('fuCard');
    if (fuCard) {
        fuCard.addEventListener('click', () => {
            fuCard.classList.toggle('flipped');
            // 翻转时放烟花
            const rect = fuCard.getBoundingClientRect();
            launchFirework(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }

    // ===== 卡片3D倾斜 =====
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();
