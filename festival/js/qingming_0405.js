// 清明节 · 液态玻璃版（细雨 + 浮动光斑 + 卡片倾斜）
(function() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ===== 细雨 =====
    class RainDrop {
        constructor() { this.reset(); this.y = Math.random() * canvas.height; }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.length = 12 + Math.random() * 18;
            this.speed = 5 + Math.random() * 5;
            this.opacity = 0.15 + Math.random() * 0.2;
            this.wind = 0.3 + Math.random() * 0.4;
        }
        update() {
            this.y += this.speed;
            this.x += this.wind;
            if (this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.save();
            ctx.strokeStyle = `rgba(120, 150, 140, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.wind * 1.5, this.y + this.length);
            ctx.stroke();
            ctx.restore();
        }
    }

    let drops = [];
    for (let i = 0; i < 100; i++) drops.push(new RainDrop());

    // ===== 浮动光斑 =====
    class Orb {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50;
            this.radius = 40 + Math.random() * 100;
            this.speed = 0.2 + Math.random() * 0.4;
            this.drift = (Math.random() - 0.5) * 0.3;
            this.alpha = 0.03 + Math.random() * 0.04;
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            if (this.y < -this.radius * 2) this.reset();
        }
        draw() {
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            g.addColorStop(0, `rgba(154, 186, 170, ${this.alpha})`);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let orbs = [];
    for (let i = 0; i < 8; i++) orbs.push(new Orb());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        orbs.forEach(o => { o.update(); o.draw(); });
        drops.forEach(d => { d.update(); d.draw(); });
        requestAnimationFrame(animate);
    }
    animate();

    // ===== 卡片3D倾斜 =====
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();
