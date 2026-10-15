// 端午节 · 液态玻璃版（浮动光斑 + 粽子交互 + 龙舟 + 卡片倾斜）
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
            this.hue = Math.random() > 0.5 ? 150 : 170;
            this.alpha = 0.04 + Math.random() * 0.06;
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            if (this.y < -this.radius * 2) this.reset();
        }
        draw() {
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            g.addColorStop(0, `hsla(${this.hue}, 55%, 45%, ${this.alpha})`);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 12; i++) orbs.push(new Orb());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        orbs.forEach(o => { o.update(); o.draw(); });
        requestAnimationFrame(animate);
    }
    animate();

    // ===== 粽子交互 =====
    const zongziTypes = [
        { icon: '🥟', name: '豆沙粽', desc: '甜而不腻，经典之选' },
        { icon: '🥟', name: '鲜肉粽', desc: '咸香四溢，肉质鲜嫩' },
        { icon: '🥟', name: '蛋黄肉粽', desc: '蛋黄流沙，肉香浓郁' },
        { icon: '🥟', name: '蜜枣粽', desc: '甜蜜软糯，枣香扑鼻' },
        { icon: '🥟', name: '八宝粽', desc: '食材丰富，营养美味' },
        { icon: '🥟', name: '清水粽', desc: '原汁原味，蘸糖食用' }
    ];

    let ziIdx = 0;
    const ziIcon = document.getElementById('ziIcon');
    const ziName = document.getElementById('ziName');
    const ziDesc = document.getElementById('ziDesc');
    const ziBtn = document.getElementById('ziBtn');

    function showZongzi(idx) {
        const z = zongziTypes[idx];
        ziIcon.style.transform = 'scale(0.8) rotate(-10deg)';
        setTimeout(() => {
            ziIcon.textContent = z.icon;
            ziName.textContent = z.name;
            ziDesc.textContent = z.desc;
            ziIcon.style.transform = 'scale(1.2) rotate(5deg)';
            setTimeout(() => { ziIcon.style.transform = ''; }, 300);
        }, 150);
    }

    ziBtn.addEventListener('click', () => {
        ziIdx = (ziIdx + 1) % zongziTypes.length;
        showZongzi(ziIdx);
    });

    ziIcon.addEventListener('click', () => {
        ziIdx = (ziIdx + 1) % zongziTypes.length;
        showZongzi(ziIdx);
    });

    // ===== 龙舟加速 =====
    const boat = document.getElementById('boat');
    const boatBtn = document.getElementById('boatBtn');
    let speeding = false;
    let speedTimer = null;

    boatBtn.addEventListener('click', () => {
        if (speeding) return;
        speeding = true;
        boat.classList.add('speed');
        boatBtn.textContent = '全速前进中... 🚀';
        clearTimeout(speedTimer);
        speedTimer = setTimeout(() => {
            boat.classList.remove('speed');
            boatBtn.textContent = '加速划桨！';
            speeding = false;
        }, 2000);
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
