document.addEventListener('DOMContentLoaded', function () {

    const CONFIG = {

        siteStartTime: '2025-11-16 00:00:00',
        changelogStart: '2025-11-16',
        birthdayPages: {
            '1-10': 'sr/liu/liu.html',
            '5-10': 'sr/li/li.html',
            '6-10': 'sr/hehe/hehe.html',
            '6-15': 'sr/goto/goto.html',
			'5-9': 'sr/hui/hui.html',
        },
        selectors: {
            secretClick: '#secretClick',
            runtime: '#runtime',
            navLinks: '.main-nav a',
            footerNavLinks: '.footer-nav a'
        }
    };

    let timerInterval = null;
    let clickTimer = null;

    init();

    function init() {
        try {

            window.__zeroScrollLock = false;
            insertHeaderAndFooter();
            highlightCurrentNav();
            startRunningTimer();
            addSecretFiveClick();
            addSmoothScroll();
            addBackToTop();
            addHeaderScrollEffect();
            console.log('站点加载成功');
        } catch (error) {
            console.error('加载失败:', error);
        }
    }

    function insertHeaderAndFooter() {
        if (document.getElementById('siteHeader')) return;
        const headerHTML = `
        <header class="site-header" id="siteHeader">
            <div class="header-inner">
                <div class="logo">
                    <span class="logo-text">零源机构</span>
                    <span class="logo-sub">|ZERO‑SOURCE</span>
                </div>
                <nav class="main-nav">
                    <ul>
                        <li><a href="index.html">首页</a></li>
                        <li><a href="body/sjz.html">时间轴</a></li>
                        <li><a href="body/cyjs.html">成员介绍</a></li>
                        <li><a href="body/ctjr.html">传统节日</a></li>
                        <li><a href="body/qxc.html">群相册</a></li>
                    </ul>
                </nav>
            </div>
        </header>`;
        const footerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-bottom">
                    <div class="footer-left">
                        <div class="footer-nav">
                            <a href="foot/yszc.html">隐私政策</a>
                            <a href="foot/sytk.html">使用条款</a>
                            <a href="foot/wzdt.html">网站地图</a>
                            <a href="foot/gxrz.html">更新日志</a>
                        </div>
                    </div>
                    <div class="footer-center">
                        <div class="copyright"><span id="secretClick">©&nbsp;2025&nbsp;零源机构ZERØ‑SOURCE</span></div>
                    </div>
                    <div class="footer-right">
                        <div id="runtime"></div>
                    </div>
                </div>
            </div>
        </footer>`;
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        document.body.insertAdjacentHTML('beforeend', footerHTML);

        fixAllLinks();
    }

    function addHeaderScrollEffect() {
        var h = document.getElementById('siteHeader');
        if (!h) return;
        window.addEventListener('scroll', function () {
            h.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    function getRootPrefix() {
        const segments = window.location.pathname.split('/').filter(Boolean);
        const parentDepth = Math.max(0, segments.length - 1);
        return '../'.repeat(parentDepth);
    }

    function fixAllLinks() {
        const prefix = getRootPrefix();

        function toRootRelative(raw) {
            let url;
            try { url = new URL(raw, window.location.href); } catch (e) { return null; }
            if (url.origin !== window.location.origin) return null;
            const dir = window.location.pathname.replace(/[^/]*$/, '');
            let rel;
            if (!dir || dir === '/') {
                rel = url.pathname;
            } else if (url.pathname === dir.replace(/\/$/, '') ||
                       url.pathname.indexOf(dir) === 0) {
                rel = (url.pathname === dir.replace(/\/$/, ''))
                    ? ''
                    : url.pathname.slice(dir.length);
            } else {
                return null;
            }
            if (!rel) rel = url.pathname.split('/').pop() || '';
            return prefix + rel.replace(/^\//, '');
        }

        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return;
            const fixed = toRootRelative(href);
            if (fixed && fixed !== href) link.setAttribute('href', fixed);
        });

        document.querySelectorAll('img[src]').forEach(img => {
            const src = img.getAttribute('src');
            if (/^(https?:|data:|\/)/i.test(src)) return;
            if (prefix && src.indexOf(prefix) === 0) return;
            img.setAttribute('src', prefix + src);
        });
    }

    function highlightCurrentNav() {
        const currentPath = window.location.pathname;
        const currentRelativePath = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        document.querySelectorAll(CONFIG.selectors.navLinks).forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkRelativePath = linkHref.substring(linkHref.lastIndexOf('/') + 1);
            if (linkRelativePath === currentRelativePath) {
                link.parentElement.classList.add('active');
            }
        });
        document.querySelectorAll(CONFIG.selectors.footerNavLinks).forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkRelativePath = linkHref.substring(linkHref.lastIndexOf('/') + 1);
            if (linkRelativePath === currentRelativePath) {
                link.classList.add('active');
            }
        });
    }

    function startRunningTimer() {
        const startTime = new Date(CONFIG.siteStartTime).getTime();

        function getUsage(from) {
            const base = from === undefined ? startTime : new Date(from).getTime();
            const diff = Math.max(0, Date.now() - base);
            return {
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000)
            };
        }

        window.ZeroSourceRuntime = {
            getUsage: getUsage,
            startTime: startTime,
            siteStartTime: CONFIG.siteStartTime,
            changelogStart: CONFIG.changelogStart
        };

        const runtimeEl = document.querySelector(CONFIG.selectors.runtime);
        if (!runtimeEl) return;

        function updateRuntime() {
            const t = getUsage();
            const format = (num) => num.toString().padStart(2, '0');
            runtimeEl.textContent = `已运行：${t.days}天 ${format(t.hours)}:${format(t.minutes)}:${format(t.seconds)}`;
        }

        function restartTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            updateRuntime();
            timerInterval = setInterval(updateRuntime, 1000);
        }

        restartTimer();
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
            } else {
                restartTimer();
            }
        });
    }

    function addSecretFiveClick() {
        let clickCount = 0;
        const secretEl = document.querySelector(CONFIG.selectors.secretClick);
        if (!secretEl) return;
        secretEl.style.cursor = "pointer";
        secretEl.title = "连续点击5次有惊喜哦~";
        secretEl.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { clickCount = 0; }, 3000);
            if (clickCount >= 5) {
                clickCount = 0;
                clearTimeout(clickTimer);
                openBirthdayPage();
            }
        });
        function openBirthdayPage() {
            const now = new Date();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const key = `${month}-${day}`;
            const isInSubdirectory = /\/(body|foot|sr)\//.test(window.location.pathname);
            const prefix = isInSubdirectory ? '../' : '';
            if (CONFIG.birthdayPages[key]) {
                window.open(prefix + CONFIG.birthdayPages[key], "_blank");
            } else {
                alert("最近没人过生日哦~ 下次再来试试吧！");
            }
        }
    }

    function addSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                if (!href || href === '#') return;
                let targetElement = null;
                try {
                    targetElement = document.querySelector(href);
                } catch (err) {
                    return;
                }
                if (!targetElement) return;
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    function addBackToTop() {
        if (document.querySelector('.back-to-top')) return;
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fa fa-arrow-up"></i>';
        backToTop.setAttribute('aria-label', '回到顶部');
        document.body.appendChild(backToTop);
        let scrollTimer = null;
        window.addEventListener('scroll', () => {
            if (scrollTimer) return;
            scrollTimer = setTimeout(() => {
                backToTop.classList.toggle('visible', window.pageYOffset > 300);
                scrollTimer = null;
            }, 80);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('beforeunload', () => {
        if (timerInterval) clearInterval(timerInterval);
        if (clickTimer) clearTimeout(clickTimer);
    });
});
