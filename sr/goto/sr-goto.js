(function() {
    // ===================== 基础配置（之前缺失了，必须加上） =====================
    const PARTICLE_COUNT = 250; // 粒子数量
    const MAX_CONNECT_DISTANCE = 120; // 粒子连线最大距离
    const FIREWORK_INTERVAL = 800; // 烟花发射间隔（毫秒）
    const BIRTHDAY_MONTH = 5; // 6月（月份从0开始）
    const BIRTHDAY_DAY = 15;  // 15号（你的生日）

    // ===================== 粒子画布（带连线） =====================
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

    // 粒子类（修复了缺失的alpha和alphaSpeed属性）
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 4 + 1;
            this.speedX = (Math.random() - 0.5) * 1.0;
            this.speedY = (Math.random() - 0.5) * 0.8;
            const colors = ['#D8B4FE', '#8B5CF6', '#EC4899', '#FF8DA9', '#C084FC'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.7 + 0.2; // 修复：添加alpha属性
            this.alphaSpeed = (Math.random() - 0.5) * 0.01; // 修复：添加alphaSpeed属性
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            this.alpha += this.alphaSpeed;
            if (this.alpha > 0.9) this.alpha = 0.9;
            if (this.alpha < 0.2) this.alpha = 0.2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 18;
            ctx.shadowColor = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawParticleLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MAX_CONNECT_DISTANCE) {
                    const opacity = (1 - distance / MAX_CONNECT_DISTANCE) * p1.alpha * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(216, 180, 254, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        drawParticleLines();
        for (let p of particles) {
            p.update();
            p.draw();
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===================== 烟花画布（多形态） =====================
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

    // 烟花类（修复了缺失的radius属性和count变量）
    class Firework {
        constructor(x, y, targetX, targetY, type = 'circle') {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = 6.5;
            this.angle = Math.atan2(targetY - y, targetX - x);
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.radius = 3.2; // 修复：添加radius属性
            this.hue = Math.random() * 360;
            this.color = `hsl(${this.hue}, 100%, 65%)`;
            this.exploded = false;
            this.explosionType = type;
        }

        update() {
            if (!this.exploded) {
                this.vx *= 1.01;
                this.vy *= 1.01;
                this.x += this.vx;
                this.y += this.vy;
                const dx = this.x - this.targetX;
                const dy = this.y - this.targetY;
                if (Math.hypot(dx, dy) < 12) {
                    this.exploded = true;
                    this.createExplosion();
                }
            }
            return !this.exploded;
        }

        createExplosion() {
            const count = 60; // 修复：添加count变量
            const baseHue = this.hue;

            switch (this.explosionType) {
                case 'circle':
                    for (let i = 0; i < count; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 7 + 3;
                        const vx = Math.cos(angle) * speed;
                        const vy = Math.sin(angle) * speed;
                        this.addExplosionParticle(vx, vy, baseHue);
                    }
                    break;
                case 'heart':
                    for (let i = 0; i < count; i++) {
                        const t = Math.random() * Math.PI * 2;
                        const x = 16 * Math.pow(Math.sin(t), 3);
                        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
                        const speed = Math.random() * 6 + 2;
                        const vx = (x / 16) * speed;
                        const vy = (y / 16) * speed;
                        this.addExplosionParticle(vx, vy, baseHue);
                    }
                    break;
                case 'star':
                    for (let i = 0; i < count; i++) {
                        const angle = (i / count) * Math.PI * 2;
                        const starAngle = angle * 5;
                        const speed = Math.random() * 8 + 2;
                        const vx = Math.cos(starAngle) * speed;
                        const vy = Math.sin(starAngle) * speed;
                        this.addExplosionParticle(vx, vy, baseHue);
                    }
                    break;
            }
        }

        addExplosionParticle(vx, vy, baseHue) {
            const hueOffset = Math.random() * 30 - 15;
            particlesFire.push({
                x: this.targetX,
                y: this.targetY,
                vx: vx,
                vy: vy,
                life: 1.2,
                color: `hsl(${baseHue + hueOffset}, 100%, 65%)`,
                size: Math.random() * 6 + 2,
                gravity: 0.12,
                airResistance: 0.98 // 修复：添加airResistance属性
            });
        }

        draw() {
            if (!this.exploded) {
                fireCtx.beginPath();
                fireCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                const gradient = fireCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, `hsl(${this.hue}, 100%, 45%)`);
                fireCtx.fillStyle = gradient;
                fireCtx.fill();
                fireCtx.beginPath();
                fireCtx.moveTo(this.x - this.vx * 3, this.y - this.vy * 3);
                fireCtx.lineTo(this.x, this.y);
                fireCtx.strokeStyle = `hsl(${this.hue}, 100%, 55%)`;
                fireCtx.lineWidth = 1.5;
                fireCtx.stroke();
            }
        }
    }

    function updateFireworks() {
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const alive = fireworks[i].update();
            if (!alive) fireworks.splice(i, 1);
        }

        for (let i = particlesFire.length - 1; i >= 0; i--) {
            const p = particlesFire[i];
            p.vx *= p.airResistance;
            p.vy *= p.airResistance;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life -= 0.018;
            const hueMatch = p.color.match(/hsl\((\d+),/);
            const hue = hueMatch ? hueMatch[1] : 280;
            p.color = `hsl(${hue}, 100%, ${65 - (1 - p.life) * 40}%)`;
            if (p.life <= 0 || p.y > fireHeight + 150) {
                particlesFire.splice(i, 1);
            }
        }
    }

    function drawFireworks() {
        fireCtx.clearRect(0, 0, fireWidth, fireHeight);
        for (let f of fireworks) f.draw();
        for (let p of particlesFire) {
            fireCtx.beginPath();
            fireCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            const hueMatch = p.color.match(/hsl\((\d+),/);
            const hue = hueMatch ? hueMatch[1] : 280;
            const gradient = fireCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * p.life);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, `hsla(${hue}, 100%, 40%, 0)`);
            fireCtx.fillStyle = gradient;
            fireCtx.globalAlpha = p.life * 0.9;
            fireCtx.fill();
        }
        fireCtx.globalAlpha = 1;
    }

    function launchRandomFirework() {
        if (document.visibilityState !== 'visible') return;
        const startX = Math.random() * fireWidth;
        const startY = fireHeight;
        const targetX = Math.random() * fireWidth;
        const targetY = Math.random() * (fireHeight * 0.6) + 80;
        const types = ['circle', 'heart', 'star'];
        const type = types[Math.floor(Math.random() * types.length)];
        fireworks.push(new Firework(startX, startY, targetX, targetY, type));
    }

    document.addEventListener('click', (e) => {
        const startX = e.clientX;
        const startY = fireHeight;
        const targetX = e.clientX + (Math.random() - 0.5) * 100;
        const targetY = e.clientY + (Math.random() - 0.5) * 80;
        const types = ['circle', 'heart', 'star'];
        const type = types[Math.floor(Math.random() * types.length)];
        fireworks.push(new Firework(startX, startY, targetX, targetY, type));
    });

    setInterval(launchRandomFirework, FIREWORK_INTERVAL);
    setTimeout(() => { for (let i = 0; i < 6; i++) launchRandomFirework(); }, 300);

    function fireworkLoop() {
        updateFireworks();
        drawFireworks();
        requestAnimationFrame(fireworkLoop);
    }
    fireworkLoop();

    function burstFireworkAround(x, y) {
        for (let i = 0; i < 5; i++) {
            const offsetX = (Math.random() - 0.5) * 150;
            const offsetY = (Math.random() - 0.5) * 100 - 30;
            const targetX = x + offsetX;
            const targetY = y + offsetY - 20;
            const startX = Math.random() * fireWidth;
            const startY = fireHeight;
            const types = ['circle', 'heart', 'star'];
            const type = types[Math.floor(Math.random() * types.length)];
            fireworks.push(new Firework(startX, startY, targetX, targetY, type));
        }
    }

    // ===================== 生日倒计时（独立运行版） =====================
    function padZero(num) {
        return num < 10 ? '0' + num : num.toString();
    }

    function updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let birthday = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
        
        if (now > birthday) {
            birthday = new Date(currentYear + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY);
        }
        
        const diff = birthday - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = padZero(hours);
        document.getElementById('mins').textContent = padZero(mins);
        document.getElementById('secs').textContent = padZero(secs);
        
        if (days === 0 && hours === 0 && mins === 0 && secs === 0 && !window._celebrated) {
            window._celebrated = true;
            for (let i = 0; i < 20; i++) {
                setTimeout(() => launchRandomFirework(), i * 150);
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ===================== 卡片翻转（修复了语法错误） =====================
    const card = document.getElementById('flipCard');
    let hasFlipped = false;

    function typewriterEffect(element, text, speed = 50) {
        let i = 0;
        element.innerText = '';
        function type() {
            if (i < text.length) {
                element.innerText += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    function handleCardFlip(e) {
        if (hasFlipped) return;
        card.classList.add('flipped');
        hasFlipped = true;

        // 修复：把文字用变量包裹起来
        const messageText = '🎂 生 日 快 乐 🎂';
        const blessText = `愿你的前路如星辰璀璨，步履皆坦途
破风前行，不负热爱
「Zero · 零号」
🎂 永远热烈 永远闪耀 🎂`;

        typewriterEffect(document.getElementById('typewriterText'), messageText, 80);
        setTimeout(() => {
            typewriterEffect(document.getElementById('blessTypewriter'), blessText, 40);
        }, 1000);

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                burstFireworkAround(centerX, centerY);
            }, i * 150);
        }
        setTimeout(() => {
            for (let i = 0; i < 4; i++) launchRandomFirework();
        }, 500);
    }
    card.addEventListener('click', handleCardFlip);

    // ===================== 音乐控制 =====================
    let audio = null;
    let isPlaying = false;
    const musicBtn = document.getElementById('musicBtn');
    const musicIcon = document.getElementById('musicIcon');
    const volumeControl = document.getElementById('volumeControl');

    function initAudio() {
        if (audio) return;
        audio = new Audio('../music/sr.mp3');
        audio.loop = true;
        audio.volume = parseFloat(volumeControl.value);
        audio.onerror = () => {
            musicIcon.textContent = '♪';
        };
    }

    volumeControl.addEventListener('input', () => {
        if (audio) {
            audio.volume = parseFloat(volumeControl.value);
        }
    });

    musicBtn.addEventListener('click', () => {
        initAudio();
        if (!isPlaying) {
            audio.play().then(() => {
                isPlaying = true;
                musicIcon.textContent = '♪';
                musicBtn.style.boxShadow = '0 0 30px #8B5CF6';
            }).catch(e => {
                musicIcon.textContent = '×';
            });
        } else {
            audio.pause();
            isPlaying = false;
            musicIcon.textContent = '▶';
            musicBtn.style.boxShadow = '0 0 20px #8B5CF6';
        }
    });

    const onePlay = () => {
        initAudio();
        if (!isPlaying && audio) {
            audio.play().then(() => {
                isPlaying = true;
                musicIcon.textContent = '♪';
                musicBtn.style.boxShadow = '0 0 30px #8B5CF6';
            }).catch(() => {});
        }
        document.removeEventListener('click', onePlay);
        document.removeEventListener('touchstart', onePlay);
    };
    document.addEventListener('click', onePlay);
    document.addEventListener('touchstart', onePlay);

    // ===================== 鼠标跟随星星 =====================
    const cursorStars = document.querySelector('.cursor-stars');
    let stars = [];

    class Star {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 4;
            this.speed = Math.random() * 0.5 + 0.2;
            this.alpha = Math.random() * 0.8 + 0.2;
            this.rotation = Math.random() * 360;
            this.element = document.createElement('div');
            this.element.style.position = 'absolute';
            this.element.style.left = `${x}px`;
            this.element.style.top = `${y}px`;
            this.element.style.fontSize = `${this.size}px`;
            this.element.style.color = `rgba(216, 180, 254, ${this.alpha})`;
            this.element.style.opacity = this.alpha;
            this.element.style.transition = 'all 0.2s ease';
            this.element.style.pointerEvents = 'none';
            this.element.textContent = '✦'; // 用emoji代替Font Awesome图标，彻底解决字体问题
            cursorStars.appendChild(this.element);
        }

        update(x, y) {
            this.x += (x - this.x) * this.speed;
            this.y += (y - this.y) * this.speed;
            this.rotation += 5;
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            this.element.style.transform = `rotate(${this.rotation}deg)`;
            this.alpha -= 0.01;
            this.element.style.opacity = this.alpha;
            return this.alpha > 0;
        }

        remove() {
            this.element.remove();
        }
    }

    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) {
            stars.push(new Star(e.clientX, e.clientY));
        }
        stars = stars.filter(star => {
            const alive = star.update(e.clientX, e.clientY);
            if (!alive) star.remove();
            return alive;
        });
    });
})();