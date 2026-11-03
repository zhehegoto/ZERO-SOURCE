(function() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.policy-card');
    if (!tocLinks.length || !sections.length) return;

    function updateActive() {
        const scrollPos = window.scrollY + 150;
        let currentId = '';

        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentId = section.id;
            }
        });

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
