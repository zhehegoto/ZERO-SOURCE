(function () {
    'use strict';

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
            tag: '线下活动',
            title: '青海湖环线自驾游圆满结束',
            desc: '零源机构 2026 年首次青海湖环线自驾游顺利收官，由辙嗬、盒盒、铃音、丽丽四人共同完成。',
            img: 'images/dt/zx-2.jpg',
            date: '2026-07-26',
            content: '零源机构 2026 年青海湖环线自驾游圆满结束！\n\n本次自驾游由辙嗬、盒盒、铃音、丽丽四人共同参与。路线从西宁出发，途径海北藏族自治州、海南藏族自治州、贵德，最后经湟源、湟中返回。\n\n行程小插曲：原计划前往金银滩原子城，但为了更好的观景体验，大家临时决定更改路线，直奔同宝山。站在同宝山上俯瞰，视野开阔，风光绝佳。\n\n感谢四位伙伴的参与，期待下一次的自驾旅行！'
        },
        {
            id: 3,
            tag: '网站更新',
            title: '官网全新液态玻璃设计上线',
            desc: '零源机构官网迎来全面视觉升级，采用全新液态玻璃设计语言，带来更沉浸的浏览体验。',
            img: 'images/dt/zx-3.jpg',
            date: '2026-09-23',
            content: '零源机构官网全新改版上线！\n\n本次更新采用全新的液态玻璃设计语言，完全放弃了旧版的布局和视觉风格。\n\n主要更新内容：\n· 全新液态玻璃卡片设计\n· 多色流动渐变背景\n· 不规则有机圆角\n· 全新交互体验\n· 全站响应式优化\n\n欢迎各位成员体验并反馈！'
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
            tag: '重要',
            tagClass: 'important',
            title: '移动端网站 v1.0 基础版本发布',
            desc: '移动端网站基础版本 v1.0 正式上线！根据 PC 端 V4.7 核心架构搭建，并同步修复了大量移动端体验与交互问题。',
            date: '2026-10-12',
            content: '移动端网站基础版本发布，根据 PC 端 V4.7 核心架构搭建与优化。\n\n本次更新包含以下重要修复与调整：\n· 移动端同步 PC 端 v4.7 修复\n· 统一节日页面公共样式与页脚脚本\n· 隐私政策与使用条款指向「网站地图」\n· 统一更新日志运行天数计算入口并修复日期读取错误\n· 清理不再执行的冗余代码与重复事件绑定\n· 修复首页数据面板计数动画提前播放问题\n· 修复时间轴页面矮屏下内容被裁切的问题，改为自适应高度\n· 微信公众号改为点击复制账号名，并提示去微信搜一搜关注\n\n感谢各位成员体验，如有问题欢迎反馈！'
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

    function rootPrefix() {
        const depth = window.location.pathname.split('/').filter(Boolean).length - 1;
        return '../'.repeat(Math.max(0, depth));
    }

    function setModalState(modal, open) {
        modal.classList.toggle('active', open);
        const anyOpen = document.querySelector('.detail-modal.active') !== null;
        document.body.style.overflow = anyOpen ? 'hidden' : '';
        window.__zeroScrollLock = anyOpen;
    }

    function openNewsModal(item) {
        const imgEl = document.getElementById('newsModalImg');
        if (item.img) {

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

    const SITE_START_TIME = '2025-11-16 00:00:00';

    function getRuntimeDays() {

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

        window.__zeroStartStats = startStatsCountUp;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startStatsCountUp();
                    observer.disconnect();
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

(function liquidPageScroll() {
    const sectionIds = ['hero', 'news', 'bottom', 'stats'];
    let currentIndex = 0;
    let isAnimating = false;
    const animDuration = 800;

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

        if (index === 0) {
            document.body.classList.remove('show-chrome');
        } else {
            document.body.classList.add('show-chrome');
        }

        currentIndex = index;

        if (sectionIds[index] === 'stats' && typeof window.__zeroStartStats === 'function') {
            setTimeout(window.__zeroStartStats, 350);
        }

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
