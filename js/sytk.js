// 使用条款 - 手风琴展开/收起
(function() {
    const items = document.querySelectorAll('.accordion-item');

    items.forEach((item, index) => {
        const header = item.querySelector('.accordion-header');

        // 默认展开第一个
        if (index === 0) {
            item.classList.add('active');
        }

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // 关闭所有
            items.forEach(i => i.classList.remove('active'));

            // 如果当前不是展开状态，则展开当前
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
})();
