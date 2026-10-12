// 国庆节 · 液态玻璃版（烟花 + 浮动光斑 + 卡片倾斜）
(function() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let rockets = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const fwColors = ['#ffd700', '#ff4444', '#ff8800', '#ffffff', '#ff66cc', '#ffaa00'];

    // ===== 烟花火箭 =====
    class Rocket {
        constructor(x, targetY) {
            this.x = x;
            this.y = canvas.height;
            this.targetY = targetY;
            this.speed = 8 + Math.random() * 4;
            this.color = fwColors[Math.floor(Math.random() * fwColors.length)];
            this.trail = [];
        }
        update() {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 10) this.trail.shift();
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
                return false;
            }
            return true;
        }
        explode() {
            const count = 60 + Math.floor(Math.random() * 40);
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count;
                const speed = 2 + Math.random() * 4;
                particles.push(new Particle(
                    this.x, this.y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    this.color
                ));
            }
        }
        draw() {
            ctx.save();
            this.trail.forEach((p, i) => {
                ctx.globalAlpha = i / this.trail.length * 0.5;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Particle {
        constructor(x, y, vx, vy, color) {
            this.x = x; this.y = y;
            this.vx = vx; this.vy = vy;
            this.color = color;
            this.life = 1;
            this.decay = 0.012 + Math.random() * 0.008;
            this.size = 2 + Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.05;
            this.vx *= 0.99;
            this.vy *= 0.99;
            this.life -= this.decay;
            return this.life > 0;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(107, 0, 16, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        rockets = rockets.filter(r => {
            const alive = r.update();
            if (alive) r.draw();
            return alive;
        });

        particles = particles.filter(p => {
            const alive = p.update();
            if (alive) p.draw();
            return alive;
        });

        requestAnimationFrame(animate);
    }
    animate();

    // 自动放烟花
    function autoFirework() {
        const x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
        const targetY = Math.random() * canvas.height * 0.4 + 50;
        rockets.push(new Rocket(x, targetY));
    }
    for (let i = 0; i < 3; i++) setTimeout(autoFirework, i * 700);
    setInterval(autoFirework, 3000);

    // 按钮放烟花
    const fwBtn = document.getElementById('fwBtn');
    if (fwBtn) {
        fwBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
                    const targetY = Math.random() * canvas.height * 0.5 + 50;
                    rockets.push(new Rocket(x, targetY));
                }, i * 180);
            }
        });
    }

    // 点击页面任意位置放烟花
    document.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        rockets.push(new Rocket(e.clientX, e.clientY));
    });

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
