// 隐私政策 - 滚动高亮
// 注意：目录的点击平滑滚动已由 public.js 的 addSmoothScroll() 统一处理
// （它接管所有 a[href^="#"]），这里只负责滚动高亮，不要再绑一次点击事件，
// 否则同一个点击会触发两次 scrollIntoView。
(function() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.policy-card');
    if (!tocLinks.length || !sections.length) return;

    // 滚动监听 - 当前章节高亮
    function updateActive() {
        const scrollPos = window.scrollY + 150;
        let currentId = '';

        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentId = section.id;
            }
        });

        // 滚到底部时，强制高亮最后一节
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
            currentId = sections[sections.length - 1].id;
        }

        tocLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-target') === currentId);
        });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
})();