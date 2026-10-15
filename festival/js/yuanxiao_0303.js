// 元宵节 · 液态玻璃版（浮动光斑 + 灯谜 + 卡片倾斜）
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
            this.hue = Math.random() > 0.5 ? 30 : 45;
            this.alpha = 0.04 + Math.random() * 0.06;
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            if (this.y < -this.radius * 2) this.reset();
        }
        draw() {
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            g.addColorStop(0, `hsla(${this.hue}, 95%, 60%, ${this.alpha})`);
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

    // ===== 灯谜 =====
    const riddles = [
        { q: '千条线，万条线，掉到水里看不见。', a: '谜底：雨' },
        { q: '身穿绿衣裳，肚里水汪汪，生的子儿多，个个黑脸膛。', a: '谜底：西瓜' },
        { q: '像猫不是猫，身穿皮袄花。山中称霸王，寅年它当家。', a: '谜底：老虎' },
        { q: '一位公公精神好，从早到晚不睡觉，身体虽小力气大，千人万人推不倒。', a: '谜底：不倒翁' },
        { q: '有面没有口，有脚没有手，虽有四只脚，自己不会走。', a: '谜底：桌子' },
        { q: '白嫩小宝宝，洗澡吹泡泡，洗洗身体小，再洗不见了。', a: '谜底：香皂' },
        { q: '身穿花衣裳，飞在花丛中，采蜜又授粉，功劳真不小。', a: '谜底：蜜蜂' },
        { q: '一个黑孩，从不开口，要是开口，掉出舌头。', a: '谜底：瓜子' },
        { q: '人脱衣服，它穿衣服，人脱帽子，它戴帽子。', a: '谜底：衣帽架' },
        { q: '弟兄七八个，围着柱子坐，大家一分手，衣服就扯破。', a: '谜底：大蒜' },
        { q: '独木造高楼，没瓦没砖头，人在水下走，水在人上流。', a: '谜底：雨伞' },
        { q: '正月十五闹花灯，家家户户笑盈盈。打一节日。', a: '谜底：元宵节' }
    ];

    let currentIdx = 0;
    let answerShown = false;

    const riddleQuestion = document.getElementById('riddleQuestion');
    const riddleAnswer = document.getElementById('riddleAnswer');
    const riddleCount = document.getElementById('riddleCount');
    const riddleCard = document.getElementById('riddleCard');
    const showAnswerBtn = document.getElementById('showAnswerBtn');
    const nextBtn = document.getElementById('nextRiddleBtn');

    function showRiddle(idx) {
        currentIdx = idx;
        riddleQuestion.textContent = riddles[idx].q;
        riddleAnswer.textContent = riddles[idx].a;
        riddleAnswer.style.display = 'none';
        answerShown = false;
        riddleCount.textContent = `${idx + 1} / ${riddles.length}`;
        showAnswerBtn.textContent = '显示谜底';
    }

    function toggleAnswer() {
        answerShown = !answerShown;
        riddleAnswer.style.display = answerShown ? 'block' : 'none';
        showAnswerBtn.textContent = answerShown ? '隐藏谜底' : '显示谜底';
    }

    showAnswerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAnswer();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showRiddle((currentIdx + 1) % riddles.length);
    });

    riddleCard.addEventListener('click', toggleAnswer);

    showRiddle(0);

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
