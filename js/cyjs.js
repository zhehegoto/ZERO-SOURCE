/* ============================================================
   零源机构 · 成员介绍 — 3D翻转卡牌交互
   完全创新设计 · 不沿用任何旧逻辑
   ============================================================ */

(function () {
    'use strict';

    const members = [
        {
            name: '辙嗬', code: 'Z℮R∅‑SOURCE｜联合创始人', role: '「技术锚点」',
            email: '有个简单的问题~', phone: '+86 什么是爱情~',
            avatar: '../images/zehe.jpg',
            desc: '我的世界迷；给我一个蓝图我将给你建造整个世界！',
            colors: ['#ff6b9d', '#c44dff']
        },
        {
            name: '盒盒', code: 'Z℮R∅‑SOURCE｜联合创始人', role: '「策划锚点」',
            email: '它是否是一种味道~', phone: '+86 还是引力~',
            avatar: '../images/hehe.jpg',
            desc: 'ZERO官方品牌负责人，你看到的文章大部分都是我写的。官方王牌驾驶员，拥有绝对的驾驶技术；',
            colors: ['#4dd0ff', '#c44dff']
        },
        {
            name: '丽丽', code: 'Z℮R∅‑SOURCE｜联合创始人', role: '「运营锚点」',
            email: '从我初恋那天起~', phone: '+86 先是甜蜜~',
            avatar: '../images/lili.jpg',
            desc: 'ZERO官方行动派，我推砂狼白子，所以我要写砂狼白子;',
            colors: ['#ff6b9d', '#ff8e53']
        },
        {
            name: '铃音', code: 'Z℮R∅‑SOURCE｜设计负责人', role: '「设计节点」',
            email: '然后紧接就会有~', phone: '+86 风雨~',
            avatar: '../images/ech0.jpg',
            desc: 'Z℮R∅‑SOURCE后端技术师，主要负责Z℮R∅‑SOURCE AI的维护与运行。擅长网络操作计算机检测。',
            colors: ['#4dd0ff', '#4dffb8']
        },
        {
            name: '狂飙', code: 'Z℮R∅‑SOURCE｜安全负责人', role: '「安全节点」',
            email: '爱就像~', phone: '+86 蓝天白云~',
            avatar: '../images/sur1.jpg',
            desc: '你说，叮咚鸡做梦会梦到哈基米被大狗嚼吗？',
            colors: ['#4dffb8', '#c44dff']
        }
    ];

    const cardGrid = document.getElementById('cardGrid');

    // ========== 创建3D翻转卡牌 ==========
    function createFlipCard(member, index) {
        const card = document.createElement('div');
        card.className = 'flip-card';
        card.dataset.index = index;
        card.style.setProperty('--card-color-1', member.colors[0]);
        card.style.setProperty('--card-color-2', member.colors[1]);

        card.innerHTML = `
            <div class="flip-card-inner">
                <!-- 正面 -->
                <div class="flip-card-front">
                    <div class="card-avatar-wrap">
                        <div class="card-avatar-ring"></div>
                        <div class="card-avatar">
                            <img src="${member.avatar}" alt="${member.name}" loading="lazy"
                                 onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,${member.colors[0]},${member.colors[1]});color:#fff;font-size:2rem;font-weight:700;font-family:Syne\\'>${member.code.charAt(0)}</div>'">
                        </div>
                    </div>
                    <div class="card-name">${member.name}</div>
                    <div class="card-code">${member.code}</div>
                    <div class="card-role">${member.role}</div>
                    <div class="card-flip-hint">
                        <i class="fa fa-refresh"></i>
                        <span>点击翻转</span>
                    </div>
                </div>
                <!-- 背面 -->
                <div class="flip-card-back">
                    <div class="back-header">
                        <div class="back-avatar">
                            <img src="${member.avatar}" alt="${member.name}" loading="lazy"
                                 onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,${member.colors[0]},${member.colors[1]});color:#fff;font-size:1.2rem;font-weight:700;font-family:Syne\\'>${member.code.charAt(0)}</div>'">
                        </div>
                        <div>
                            <div class="back-name">${member.name}</div>
                            <div class="back-code">${member.code} · ${member.role}</div>
                        </div>
                    </div>
                    <div class="back-info">
                        <div class="back-info-item">
                            <i class="fa fa-envelope"></i>
                            <a href="mailto:${member.email}">${member.email}</a>
                        </div>
                        <div class="back-info-item">
                            <i class="fa fa-phone"></i>
                            <span>${member.phone}</span>
                        </div>
                        <div class="back-info-item">
                            <i class="fa fa-quote-left"></i>
                            <span>${member.desc}</span>
                        </div>
                    </div>
                    <div class="back-actions">
                        <a href="mailto:${member.email}" class="back-btn primary">
                            <i class="fa fa-paper-plane"></i> 邮件
                        </a>
                    </div>
                </div>
            </div>
        `;

        // 点击翻转/再次点击翻回
        card.addEventListener('click', (e) => {
            // 点击邮件链接不触发翻转
            if (e.target.closest('a[href^="mailto"]')) {
                return;
            }
            toggleCard(card);
        });

        return card;
    }

    // ========== 切换卡牌翻转状态 ==========
    function toggleCard(card) {
        const wasFlipped = card.classList.contains('flipped');

        // 先翻回所有卡牌
        document.querySelectorAll('.flip-card.flipped').forEach(c => {
            c.classList.remove('flipped');
        });

        // 如果当前卡牌之前没翻转，则翻转
        if (!wasFlipped) {
            card.classList.add('flipped');
        }
    }

    // ========== 初始化 ==========
    function init() {
        // 生成卡牌
        members.forEach((member, i) => {
            const card = createFlipCard(member, i);
            cardGrid.appendChild(card);
        });

        // 点击外部翻回卡牌
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.flip-card')) {
                document.querySelectorAll('.flip-card.flipped').forEach(c => {
                    c.classList.remove('flipped');
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
