(function() {
    const items = document.querySelectorAll('.accordion-item');

    items.forEach((item, index) => {
        const header = item.querySelector('.accordion-header');

        if (index === 0) {
            item.classList.add('active');
        }

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            items.forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
})();
