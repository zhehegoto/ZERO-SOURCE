// 网站地图 - 地图探索交互
(function() {
    const explorer = document.getElementById('mapExplorer');
    const grid = explorer.querySelector('.map-grid');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const toast = document.getElementById('copyToast');

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // 更新网格变换
    function updateGrid() {
        grid.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // 拖拽
    explorer.addEventListener('mousedown', (e) => {
        if (e.target.closest('.zoom-btn') || e.target.closest('.baidumap-btn') || e.target.closest('.map-pin-wrap')) return;
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        explorer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateGrid();
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        explorer.style.cursor = 'grab';
    });

    // 缩放
    zoomIn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.min(scale + 0.15, 2);
        updateGrid();
    });

    zoomOut.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.max(scale - 0.15, 0.6);
        updateGrid();
    });

    // 滚轮缩放
    explorer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.max(0.6, Math.min(2, scale + delta));
        updateGrid();
    }, { passive: false });

    // 已经是当前网站的链接：点击时提示，不再重复跳转
    // （域名从卡片自己的 href 解析，因此本地 127.0.0.1:5500 调试时不会被误判为已在官网）
    function stripWww(host) {
        return String(host || '').replace(/^www\./i, '').toLowerCase();
    }
    const here = stripWww(location.hostname);

    document.querySelectorAll('.platform-card[href]').forEach(card => {
        const href = card.getAttribute('href') || '';
        let target = null;
        try { target = new URL(href, location.href); } catch (e) { return; }
        if (stripWww(target.hostname) !== here) return;   // 外站链接保持正常跳转

        card.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('你已经在当前网站上了');
        });
    });

    // 点击复制（.stream-card 与 .platform-card 共用同一套逻辑），
    // 放在「当前网站」检测之后：两类卡片互斥，上面命中时下面不会再绑一次
    const copyCards = document.querySelectorAll('.stream-card[data-copy], .platform-card[data-copy]');
    copyCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const text = card.getAttribute('data-copy');
            if (!text) return;
            // 卡片可能是 <a href="#">，阻止空锚点把页面滚回顶部
            e.preventDefault();
            const tip = card.getAttribute('data-copy-tip');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast(tip);
                }).catch(() => {
                    fallbackCopy(text, tip);
                });
            } else {
                fallbackCopy(text, tip);
            }
        });
    });

    function fallbackCopy(text, tip) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showToast(tip);
        } catch (e) {}
        document.body.removeChild(ta);
    }

    let toastTimer = null;
    function showToast(message) {
        if (message) toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }
})();
