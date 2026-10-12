document.addEventListener('DOMContentLoaded', function () {

    const CONFIG = {
        // 站点的「两个起算点」，全站只在这里定义一次：
        // siteStartTime   —— 站点头上线时间，用于首页「天运行」统计卡与页脚「已运行」
        // changelogStart  —— 更新日志开始记录的时间，用于更新日志页的「运行天数」
        // 注意：两者不一致是设计如此，但不要在其他 js 里再写死一遍。
        siteStartTime: '2026-05-05 00:00:10',
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

    // ==================== 初始化 ====================

    init();

    function init() {
        try {
            // 全局滚动锁：弹窗打开时由 index.js / sjz.js 置 true，
            // 页面翻页逻辑会因此放行滚轮事件，交给弹窗内部自己滚动。
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
                    <span class="logo-sub">|Z℮R∅‑SOURCE</span>
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
        // 立即把注入的站内链接转成正确的相对路径。
        // 不能等 init() 里的 fixAllLinks()：index.js / ctjr.js 等页面脚本可能在
        // DOMContentLoaded 之前就读取了这些链接（例如节日卡片是动态生成的）。
        fixAllLinks();
    }

    // ==================== 页眉滚动 ====================

    function addHeaderScrollEffect() {
        var h = document.getElementById('siteHeader');
        if (!h) return;
        window.addEventListener('scroll', function () {
            h.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ==================== 链接修正 ====================

    // 当前页面所在目录距站点根目录的层数：
    //   /index.html        -> 0 层，前缀 ''
    //   /body/sjz.html     -> 1 层，前缀 '../'
    //   /sr/li/li.html     -> 2 层，前缀 '../../'
    //   /festival/webpage/x.html -> 2 层，前缀 '../../'
    // 注意：这里假定站点部署在域名根目录（如 https://zerozd.eu.cc/）。
    // 若部署在子目录（如 /site/），层数会偏大，需要改用 <base> 标签或
    // 在页面里显式声明站点根，不能靠路径名推断。
    function getRootPrefix() {
        const segments = window.location.pathname.split('/').filter(Boolean);
        const parentDepth = Math.max(0, segments.length - 1);
        return '../'.repeat(parentDepth);
    }

    function fixAllLinks() {
        const prefix = getRootPrefix();
        // 站内规则：页面里以 ../ 开头的相对路径（如 ../css/sjz.css）是相对「当前目录」写的，
        // 而下面注入的站内链接是以站点根为基准写的。两种写法混用时不能简单地各加一层前缀：
        // 用 new URL() 统一按当前文档解析，再统一重写到「站点根 + 相对路径」。
        function toRootRelative(raw) {
            let url;
            try { url = new URL(raw, window.location.href); } catch (e) { return null; }
            if (url.origin !== window.location.origin) return null;   // 外链不动
            const dir = window.location.pathname.replace(/[^/]*$/, '');   // 当前目录，如 /body/
            let rel;
            if (!dir || dir === '/') {
                rel = url.pathname;                                   // 已在站点根
            } else if (url.pathname === dir.replace(/\/$/, '') ||
                       url.pathname.indexOf(dir) === 0) {             // 注意边界，避免 /body/ 误配 /bodyxxx
                rel = (url.pathname === dir.replace(/\/$/, ''))
                    ? ''
                    : url.pathname.slice(dir.length);
            } else {
                return null;                                          // 不在当前目录之下，保持原样
            }
            if (!rel) rel = url.pathname.split('/').pop() || '';       // 指向目录本身时退回文件名
            return prefix + rel.replace(/^\//, '');
        }

        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return;
            const fixed = toRootRelative(href);
            if (fixed && fixed !== href) link.setAttribute('href', fixed);
        });

        // <img> 保留原有约定：只补一层前缀，且避免重复补
        document.querySelectorAll('img[src]').forEach(img => {
            const src = img.getAttribute('src');
            if (/^(https?:|data:|\/)/i.test(src)) return;
            if (prefix && src.indexOf(prefix) === 0) return;
            img.setAttribute('src', prefix + src);
        });
    }

    // ==================== 导航高亮 ====================

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

    // ==================== 运行计时 ====================

    function startRunningTimer() {
        const startTime = new Date(CONFIG.siteStartTime).getTime();

        // 统一的时间计算入口：首页统计卡的「天运行」与页脚的「已运行」
        // 都走这里，避免两处各算一套导致数字不一致。
        function getUsage(from) {
            const base = from === undefined ? startTime : new Date(from).getTime();
            const diff = Math.max(0, Date.now() - base);   // 起点在未来时保护为 0
            return {
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000)
            };
        }
        // 暴露给其他页面脚本复用（index.js 的 #runtimeDays、gxrz.js 的 #totalDays）
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

        // 关键修复：每次都先清掉旧句柄，否则切标签页会不断新建 interval，
        // 定时器越滚越多（页面越用越卡），且多个 interval 之间会出现数字跳变。
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

    // ==================== 五连击彩蛋 ====================

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

    // ==================== 平滑滚动 ====================

    function addSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // href="#" 或 href="" 不是页内锚点：一旦 preventDefault 会吞掉点击，
                // 且 querySelector('#') 会抛 SyntaxError。这里直接放行。
                if (!href || href === '#') return;
                let targetElement = null;
                try {
                    targetElement = document.querySelector(href);
                } catch (err) {
                    return;   // 非法选择器（如 href="#/xxx"），交回浏览器默认行为
                }
                if (!targetElement) return;
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    // ==================== 回到顶部 ====================

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

    // ==================== 页面卸载 ====================

    window.addEventListener('beforeunload', () => {
        if (timerInterval) clearInterval(timerInterval);
        if (clickTimer) clearTimeout(clickTimer);
    });
});
