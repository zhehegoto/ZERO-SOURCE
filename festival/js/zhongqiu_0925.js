// 中秋节 · 液态玻璃版（星空 + 流星 + 月亮交互 + 卡片倾斜）
(function() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ===== 星星 =====
    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 0.7;
            this.size = Math.random() * 2 + 0.5;
            this.twinkleSpeed = 0.02 + Math.random() * 0.03;
            this.phase = Math.random() * Math.PI * 2;
        }
        update() {
            this.phase += this.twinkleSpeed;
        }
        draw() {
            const alpha = 0.3 + Math.sin(this.phase) * 0.5;
            ctx.save();
            ctx.globalAlpha = Math.max(0.1, alpha);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#fff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    let stars = [];
    for (let i = 0; i < 100; i++) stars.push(new Star());

    // ===== 流星 =====
    class ShootingStar {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
            this.y = Math.random() * canvas.height * 0.3;
            this.length = 60 + Math.random() * 60;
            this.speed = 8 + Math.random() * 6;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
            this.active = false;
            this.life = 1;
        }
        launch() {
            this.reset();
            this.active = true;
        }
        update() {
            if (!this.active) return;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.life -= 0.015;
            if (this.life <= 0 || this.x > canvas.width || this.y > canvas.height) {
                this.active = false;
            }
        }
        draw() {
            if (!this.active) return;
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#fff';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
            ctx.stroke();
            ctx.restore();
        }
    }

    let shootingStars = [];
    for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());

    function scheduleShootingStar() {
        const delay = 3000 + Math.random() * 5000;
        setTimeout(() => {
            const ss = shootingStars.find(s => !s.active);
            if (ss) ss.launch();
            scheduleShootingStar();
        }, delay);
    }
    scheduleShootingStar();
    setTimeout(() => { const ss = shootingStars[0]; if (ss) ss.launch(); }, 1500);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => { s.update(); s.draw(); });
        shootingStars.forEach(s => { s.update(); s.draw(); });
        requestAnimationFrame(animate);
    }
    animate();

    // ===== 月亮放大 =====
    const bigMoon = document.getElementById('bigMoon');
    if (bigMoon) {
        bigMoon.addEventListener('click', () => {
            bigMoon.classList.toggle('zoomed');
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
