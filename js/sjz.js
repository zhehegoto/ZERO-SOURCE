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

(function() {
    var pages = document.querySelectorAll('.page-section');
    if (pages.length === 0) return;

    var currentPage = 0;
    var isLocked = false;
    var totalPages = pages.length;

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

        setTimeout(function() {
            isLocked = false;
        }, 1000);
    }

    function getLastPageBottom() {
        var last = pages[totalPages - 1];
        return last.offsetTop + last.offsetHeight;
    }

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

    function onWheel(e) {

        if (window.__zeroScrollLock) return;
        if (e.target && e.target.nodeType === 1 &&
            (e.target.closest('.detail-modal, .modal-panel, .fw-widget-panel') ||
             hasScrollableParent(e.target))) {
            return;
        }
        var scrollY = window.scrollY;
        var viewportH = window.innerHeight;
        var lastBottom = getLastPageBottom();

        if (scrollY > lastBottom - viewportH + 50) {

            if (e.deltaY < 0 && scrollY <= lastBottom - viewportH + 100) {

                e.preventDefault();
                if (!isLocked) {
                    goToPage(totalPages - 1);
                }
            }
            return;
        }

        if (scrollY <= 0 && e.deltaY < 0) {
            return;
        }

        if (isLocked) {
            e.preventDefault();
            return;
        }

        e.preventDefault();

        if (e.deltaY > 0) {

            if (currentPage < totalPages - 1) {
                goToPage(currentPage + 1);
            } else {

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

            if (currentPage > 0) {
                goToPage(currentPage - 1);
            }
        }
    }

    window.addEventListener('wheel', onWheel, { passive: false });

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

    window.addEventListener('load', function() {
        var items = pages[0].querySelectorAll('.anim-item');
        items.forEach(function(item, idx) {
            setTimeout(function() {
                item.classList.add('visible');
            }, idx * 120 + 300);
        });
    });
})();
