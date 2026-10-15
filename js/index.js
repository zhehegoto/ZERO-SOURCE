(function () {
    'use strict';

    // ========== 数据 ==========
    const newsData = [
        {
            id: 1,
            tag: '线下活动',
            title: '团队线下聚会圆满结束',
            desc: '零源机构 2026 年第一次线下会面，由盒盒、铃音、丽丽完成此次活动。本次举行了线下聚餐、游戏等多项活动。',
            img: 'images/dt/zx-1.jpg',
            date: '2026-01-01',
            content: '零源机构 ZERO-SOURCE 2026 年第一次线下会面圆满结束！\n\n本次活动由盒盒、铃音、丽丽三位成员参与，举行了线下聚餐、游戏等多项活动。\n\n大家在轻松愉快的氛围中交流了近期的工作和生活，也对团队未来的发展方向进行了深入讨论。\n\n感谢每一位伙伴的付出，期待下一次相聚！'
        },
        {
            id: 2,
            tag: '网站更新',
            title: '官网全新液态玻璃设计上线',
            desc: '零源机构官网迎来全面视觉升级，采用全新液态玻璃设计语言，带来更沉浸的浏览体验。',
            img: 'images/dt/zx-2.jpg',
            date: '2026-09-23',
            content: '零源机构官网全新改版上线！\n\n本次更新采用全新的液态玻璃设计语言，完全放弃了旧版的布局和视觉风格。\n\n主要更新内容：\n· 全新液态玻璃卡片设计\n· 多色流动渐变背景\n· 不规则有机圆角\n· 全新交互体验\n· 全站响应式优化\n\n欢迎各位成员体验并反馈！'
        },
        {
            id: 3,
            tag: 'xxx',
            title: 'xxx',
            desc: 'xxx',
            img: 'xxx',
            date: 'xxx',
            content: 'xxx'
        },
        {
            id: 4,
            tag: 'xxx',
            title: 'xxx',
            desc: 'xxx',
            img: 'xxx',
            date: 'xxx',
            content: 'xxx'
        },
        {
            id: 5,
            tag: 'xxx',
            title: 'xxx',
            desc: 'xxx',
            img: 'xxx',
            date: 'xxx',
            content: 'xxx'
        }
    ];

    const announcementData = [
        {
            id: 1,
            tag: '重要',
            tagClass: 'important',
            title: '网站全新改版上线',
            desc: '零源机构官网迎来全面升级，整体视觉与交互体验大幅优化，欢迎各位成员体验！',
            date: '2026-09-23',
            content: '零源机构官网全新改版上线！\n\n本次更新采用全新的液态玻璃设计语言，完全放弃了旧版的布局和视觉风格，从零开始创作。\n\n主要更新：\n· 液态玻璃卡片设计\n· 多色流动渐变背景\n· 全新页面布局\n· 优化的交互体验\n· 全站响应式适配\n\n如有任何问题或建议，欢迎通过问题反馈页面告诉我们。'
        },
        {
            id: 2,
            tag: 'xxx',
            tagClass: 'info',
            title: 'xxx',
            desc: 'xxx',
            date: 'xxx',
            content: 'xxx'
        },
        {
            id: 3,
            tag: 'xxx',
            tagClass: 'info',
            title: 'xxx',
            desc: 'xxx',
            date: 'xxx',
            content: 'xxx'
        },
        {
            id: 4,
            tag: 'xxx',
            tagClass: 'info',
            title: 'xxx',
            desc: 'xxx',
            date: 'xxx',
            content: 'xxx'
        }
    ];

    const newsTrack = document.getElementById('newsTrack');
    const newsPrev = document.getElementById('newsPrev');
    const newsNext = document.getElementById('newsNext');
    const annTimeline = document.getElementById('announcementTimeline');
    const newsModal = document.getElementById('newsModal');
    const annModal = document.getElementById('annModal');

    function renderNews() {
        if (!newsTrack) return;
        newsTrack.innerHTML = newsData.map(item => `
            <article class="news-card" data-id="${item.id}">
                <div class="news-card-img">
                    <img src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.style.background='rgba(255,255,255,0.45)';this.style.border='1px solid rgba(255,255,255,0.6)';this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 200%22></svg>'">
                    <span class="news-card-tag">${item.tag}</span>
                </div>
                <div class="news-card-body">
                    <h3 class="news-card-title">${item.title}</h3>
                    <p class="news-card-desc">${item.desc}</p>
                    <div class="news-card-meta">
                        <span class="news-card-time"><i class="fa fa-calendar"></i>${item.date}</span>
                        <span class="news-card-more">查看详情 <i class="fa fa-arrow-right"></i></span>
                    </div>
                </div>
            </article>
        `).join('');

		newsTrack.querySelectorAll('.news-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const item = newsData.find(n => n.id === id);
                if (item) openNewsModal(item);
            });
        });
    }

    function renderAnnouncements() {
        if (!annTimeline) return;
        const list = announcementData.slice(0, 3);
        annTimeline.innerHTML = list.map(item => `
            <div class="ann-item" data-id="${item.id}">
                <div class="ann-meta">
                    <span class="ann-tag ${item.tagClass}">${item.tag}</span>
                    <span class="ann-time"><i class="fa fa-calendar"></i>${item.date}</span>
                </div>
                <h3 class="ann-title">${item.title}</h3>
                <p class="ann-desc">${item.desc}</p>
            </div>
        `).join('');

        annTimeline.querySelectorAll('.ann-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const ann = announcementData.find(a => a.id === id);
                if (ann) openAnnModal(ann);
            });
        });
    }

    const historyModal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');

    function openHistoryModal() {
        if (!historyList) return;
        historyList.innerHTML = announcementData.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-item-date">${item.date}</div>
                <div class="history-item-content">
                    <span class="history-item-tag ${item.tagClass}">${item.tag}</span>
                    <div class="history-item-title">${item.title}</div>
                    <div class="history-item-desc">${item.desc}</div>
                </div>
            </div>
        `).join('');

        historyList.querySelectorAll('.history-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = parseInt(el.dataset.id);
                const ann = announcementData.find(a => a.id === id);
                if (ann) {
                    closeModal(historyModal);
                    setTimeout(() => openAnnModal(ann), 200);
                }
            });
        });

        setModalState(historyModal, true);
    }

    // 与 public.js 的 getRootPrefix() 同一套规则：按当前路径的层数补足 ../。
    // 首页在根目录，结果恒为 ''；但 index.js 若被复用到子目录页面也能正确工作。
    function rootPrefix() {
        const depth = window.location.pathname.split('/').filter(Boolean).length - 1;
        return '../'.repeat(Math.max(0, depth));
    }

    // 弹窗开合统一入口：锁定/释放页面滚动，并通知翻页逻辑放行滚轮事件。
    // 原实现只设置了 body.overflow，但整页翻页的 wheel 监听在 window 上，
    // 它会 preventDefault，导致弹窗内超出屏幕的内容无法用滚轮滚动。
    function setModalState(modal, open) {
        modal.classList.toggle('active', open);
        const anyOpen = document.querySelector('.detail-modal.active') !== null;
        document.body.style.overflow = anyOpen ? 'hidden' : '';
        window.__zeroScrollLock = anyOpen;
    }

    function openNewsModal(item) {
        const imgEl = document.getElementById('newsModalImg');
        if (item.img) {
            // 数据里的 img 是相对站点根写的（如 images/dt/zx-1.jpg），
            // 从子目录页面打开弹窗时必须补上级数，否则图片 404。
            const imgPath = /^(https?:|data:|\/)/i.test(item.img)
                ? item.img
                : rootPrefix() + item.img;
            imgEl.style.backgroundImage = `url(${imgPath})`;
        } else {
            imgEl.style.backgroundImage = '';
        }
        document.getElementById('newsModalTag').textContent = item.tag;
        document.getElementById('newsModalTitle').textContent = item.title;
        document.getElementById('newsModalMeta').innerHTML = `<i class="fa fa-calendar"></i>${item.date}`;
        document.getElementById('newsModalContent').textContent = item.content;
        setModalState(newsModal, true);
    }

    function openAnnModal(item) {
        document.getElementById('annModalTag').textContent = item.tag;
        document.getElementById('annModalTag').className = `modal-tag ${item.tagClass === 'important' ? '' : ''}`;
        document.getElementById('annModalTitle').textContent = item.title;
        document.getElementById('annModalMeta').innerHTML = `<i class="fa fa-calendar"></i>${item.date}`;
        document.getElementById('annModalContent').textContent = item.content;
        setModalState(annModal, true);
    }

    function closeModal(modal) {
        setModalState(modal, false);
    }

    function scrollNews(direction) {
        if (!newsTrack) return;
        const scrollAmount = 360;
        newsTrack.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }

    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // 只保留页面真实存在的卡片：.nav-card / .cta-card 在重构后已无任何 HTML 生成
        document.querySelectorAll('.news-card, .ann-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            observer.observe(el);
        });
    }

    function bindEvents() {
        if (newsPrev) newsPrev.addEventListener('click', () => scrollNews(-1));
        if (newsNext) newsNext.addEventListener('click', () => scrollNews(1));

        document.getElementById('newsModalClose')?.addEventListener('click', () => closeModal(newsModal));
        document.getElementById('annModalClose')?.addEventListener('click', () => closeModal(annModal));
        document.getElementById('historyModalClose')?.addEventListener('click', () => closeModal(historyModal));

        [newsModal, annModal, historyModal].forEach(modal => {
            modal.querySelector('.modal-backdrop')?.addEventListener('click', () => closeModal(modal));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal(newsModal);
                closeModal(annModal);
                closeModal(historyModal);
            }
        });

        const historyBtn = document.getElementById('historyAnnBtn');
        if (historyBtn) {
            historyBtn.addEventListener('click', openHistoryModal);
        }
    }

    function animateNumber(el, target, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * easeOut);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

    // 与 public.js 的 CONFIG.siteStartTime 保持一致；这里只作为 public.js
    // 尚未执行时的兜底（两者必须相同，否则页脚与统计卡会显示不同天数）。
    const SITE_START_TIME = '2026-05-05 00:00:10';

    function getRuntimeDays() {
        // 优先复用 public.js 暴露的统一时间计算，保证两处数字完全一致
        if (window.ZeroSourceRuntime && typeof window.ZeroSourceRuntime.getUsage === 'function') {
            return window.ZeroSourceRuntime.getUsage().days;
        }
        const diff = Math.max(0, Date.now() - new Date(SITE_START_TIME).getTime());
        return Math.floor(diff / 86400000);
    }

    function initStatsAnimation() {
        const runtimeDaysEl = document.getElementById('runtimeDays');
        if (runtimeDaysEl) {
            runtimeDaysEl.dataset.target = getRuntimeDays();
        }

        const statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;

        // 播一次计数动画：先把数字清零，再逐帧涨到 data-target。
        // 之前这里靠 IntersectionObserver 触发，但首页四个 section 是
        // position:fixed + opacity:0 的翻页结构，IntersectionObserver 不看
        // opacity，页面一加载就认为已经「进入视口」，于是 1.5 秒的动画在
        // 不可见状态下就播完了 —— 翻到「零源数据」那页时只剩终值。
        function startStatsCountUp() {
            statNumbers.forEach(el => {
                if (el.dataset.infinity) {
                    el.textContent = '∞';
                    return;
                }
                el.textContent = '0';
                const target = parseInt(el.dataset.target, 10) || 0;
                animateNumber(el, target, 1500);
            });
        }

        // 翻页时由 liquidPageScroll 调用（见下方 goToPage）
        window.__zeroStartStats = startStatsCountUp;

        // 兜底：窗口较窄时页面走原生滚动，IntersectionObserver 仍然有效。
        // threshold 提到 0.6，减少「还没看见就播完」的概率。
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startStatsCountUp();
                    observer.disconnect();   // 只兜底一次，之后交给翻页逻辑
                }
            });
        }, { threshold: 0.6 });

        statNumbers.forEach(num => observer.observe(num));
    }

    function init() {
        renderNews();
        renderAnnouncements();
        bindEvents();
        initStatsAnimation();
        setTimeout(initScrollAnimations, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();



// ========== 液态缩放翻页 ==========
(function liquidPageScroll() {
    const sectionIds = ['hero', 'news', 'bottom', 'stats'];
    let currentIndex = 0;
    let isAnimating = false;
    const animDuration = 800;

    // 初始化第一页
    const heroEl = document.getElementById('hero');
    if (heroEl) heroEl.classList.add('active');

    function goToPage(index) {
        if (index < 0 || index >= sectionIds.length || isAnimating) return;
        if (index === currentIndex) return;

        isAnimating = true;
        const currentEl = document.getElementById(sectionIds[currentIndex]);
        const nextEl = document.getElementById(sectionIds[index]);

        if (currentEl) currentEl.classList.remove('active');
        if (nextEl) nextEl.classList.add('active');

        // 第一页隐藏页眉页脚，第二三页显示
        if (index === 0) {
            document.body.classList.remove('show-chrome');
        } else {
            document.body.classList.add('show-chrome');
        }

        currentIndex = index;

        // 翻到「零源数据」页时重播计数动画（每次翻到都重播）。
        // 等翻页过渡走完再播，否则动画会在透明度过渡期间进行，看起来像没动。
        if (sectionIds[index] === 'stats' && typeof window.__zeroStartStats === 'function') {
            setTimeout(window.__zeroStartStats, 350);
        }

        // 背景blob视差
        const blobs = document.querySelectorAll('.hero-blob');
        blobs.forEach((blob, i) => {
            const speed = 20 + i * 15;
            blob.style.transform = 'translate(' + (index * speed) + 'px, ' + (index * speed * 0.5) + 'px)';
        });

        setTimeout(() => { isAnimating = false; }, animDuration);
    }

    function isInModal(target) {
        return target.closest('.detail-modal, .history-list, .modal-panel');
    }

    // 滚轮翻页
    window.addEventListener('wheel', (e) => {
        if (isInModal(e.target)) return;
        e.preventDefault();
        if (isAnimating) return;
        if (e.deltaY > 30) {
            goToPage(currentIndex + 1);
        } else if (e.deltaY < -30) {
            goToPage(currentIndex - 1);
        }
    }, { passive: false });

    // 键盘翻页
    window.addEventListener('keydown', (e) => {
        if (isInModal(e.target)) return;
        if (e.key === 'PageDown' || e.key === 'ArrowDown') {
            e.preventDefault();
            goToPage(currentIndex + 1);
        } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
            e.preventDefault();
            goToPage(currentIndex - 1);
        }
    });
})();
