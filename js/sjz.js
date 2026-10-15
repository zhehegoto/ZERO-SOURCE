(function() {
    var c = document.getElementById('heroParticles');
    if (!c) return;
    for (var i = 0; i < 30; i++) {
        var p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 8 + 6) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        var size = (Math.random() * 3 + 1) + 'px';
        p.style.width = size;
        p.style.height = size;
        p.style.opacity = Math.random() * 0.5 + 0.2;
        c.appendChild(p);
    }
})();
(function() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.anim-item').forEach(function(el) {
            el.classList.add('visible');
        });
        return;
    }

    var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.anim-item').forEach(function(el, i) {
        if (el.classList.contains('milestone-card')) {
            el.style.transitionDelay = (i % 3) * 0.15 + 's';
        }
        obs.observe(el);
    });
})();

/* 全屏翻页 - 滚轮控制 */
(function() {
    var pages = document.querySelectorAll('.page-section');
    if (pages.length === 0) return;

    var currentPage = 0;
    var isLocked = false;
    var totalPages = pages.length;

    // 创建侧边指示器
    var indicator = document.createElement('div');
    indicator.className = 'page-indicator';
    pages.forEach(function(_, i) {
        var dot = document.createElement('div');
        dot.className = 'page-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', function() {
            goToPage(parseInt(this.getAttribute('data-index')));
        });
        indicator.appendChild(dot);
    });
    document.body.appendChild(indicator);

    var dots = indicator.querySelectorAll('.page-dot');

    function updateDots() {
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentPage);
        });
    }

    function getPageTop(index) {
        return pages[index].offsetTop;
    }

    function goToPage(index) {
        if (index < 0 || index >= totalPages) return;
        if (isLocked) return;

        isLocked = true;
        currentPage = index;
        updateDots();

        var targetTop = getPageTop(index);
        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });

        // 触发动画
        var items = pages[index].querySelectorAll('.anim-item');
        items.forEach(function(item) {
            item.classList.remove('visible');
            void item.offsetWidth;
        });
        setTimeout(function() {
            items.forEach(function(item, idx) {
                setTimeout(function() {
                    item.classList.add('visible');
                }, idx * 120);
            });
        }, 200);

        // 解锁
        setTimeout(function() {
            isLocked = false;
        }, 1000);
    }

    // 获取最后一页底部位置
    function getLastPageBottom() {
        var last = pages[totalPages - 1];
        return last.offsetTop + last.offsetHeight;
    }

    // 判断该元素自身（或祖先）是否是一个可滚动的容器。
    // 若是，则滚轮应该交给它自己滚动，而不是被整页翻页抢走。
    function hasScrollableParent(el) {
        var node = el;
        var limit = 0;
        while (node && node.nodeType === 1 && node !== document.body && limit < 12) {
            var style = window.getComputedStyle(node);
            var oy = style.overflowY;
            if ((oy === 'auto' || oy === 'scroll') &&
                node.scrollHeight > node.clientHeight + 1) {
                return true;
            }
            node = node.parentElement;
            limit++;
        }
        return false;
    }

    // 滚轮事件
    function onWheel(e) {
        // 弹窗/可滚动区域打开时，不接管滚轮，交给内部滚动
        if (window.__zeroScrollLock) return;
        if (e.target && e.target.nodeType === 1 &&
            (e.target.closest('.detail-modal, .modal-panel, .fw-widget-panel') ||
             hasScrollableParent(e.target))) {
            return;
        }
        var scrollY = window.scrollY;
        var viewportH = window.innerHeight;
        var lastBottom = getLastPageBottom();

        // 已经在底部区域（超过最后一页），正常滚动不拦截
        if (scrollY > lastBottom - viewportH + 50) {
            // 向上滚且接近最后一页时，才接管
            if (e.deltaY < 0 && scrollY <= lastBottom - viewportH + 100) {
                // 滚回最后一页
                e.preventDefault();
                if (!isLocked) {
                    goToPage(totalPages - 1);
                }
            }
            return;
        }

        // 在第一页且向上滚，不拦截
        if (scrollY <= 0 && e.deltaY < 0) {
            return;
        }

        // 锁定中，拦截
        if (isLocked) {
            e.preventDefault();
            return;
        }

        // 翻页区域内，拦截并翻页
        e.preventDefault();

        if (e.deltaY > 0) {
            // 向下滚
            if (currentPage < totalPages - 1) {
                goToPage(currentPage + 1);
            } else {
                // 最后一页，滚到底部
                isLocked = true;
                window.scrollTo({
                    top: lastBottom - viewportH + 80,
                    behavior: 'smooth'
                });
                setTimeout(function() {
                    isLocked = false;
                }, 1000);
            }
        } else {
            // 向上滚
            if (currentPage > 0) {
                goToPage(currentPage - 1);
            }
        }
    }

    window.addEventListener('wheel', onWheel, { passive: false });

    // 键盘支持
    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentPage < totalPages - 1) {
                goToPage(currentPage + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentPage > 0) {
                goToPage(currentPage - 1);
            }
        }
    });

    // 初始化第一页动画
    window.addEventListener('load', function() {
        var items = pages[0].querySelectorAll('.anim-item');
        items.forEach(function(item, idx) {
            setTimeout(function() {
                item.classList.add('visible');
            }, idx * 120 + 300);
        });
    });
})();
