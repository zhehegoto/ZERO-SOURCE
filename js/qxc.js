(function () {
    'use strict';

    const MAX_IMAGE = 118;
    const PAGE_SIZE = 15;
    const IMG_PATH = '../images/zerozhandui/照片 ';

    let currentPage = 0;
    let loadedPhotos = [];
    let currentPreviewIndex = -1;
    let masonryColumns = [];

    const photoDesk = document.getElementById('photoDesk');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const immersivePreview = document.getElementById('immersivePreview');
    const previewImg = document.getElementById('previewImg');
    const previewLoader = document.getElementById('previewLoader');
    const captionTitle = document.getElementById('captionTitle');
    const captionIndex = document.getElementById('captionIndex');

    function generateScatterTransform(index) {

        const rotate = (Math.random() - 0.5) * 10;

        return { rotate };
    }

    function createScatterPhoto(globalIndex) {
        const num = MAX_IMAGE - globalIndex;
        const t = generateScatterTransform(loadedPhotos.length);

        const photo = document.createElement('div');
        photo.className = 'scatter-photo';
        photo.dataset.index = globalIndex;
        photo.style.transform = `rotate(${t.rotate}deg)`;
        photo.style.zIndex = Math.floor(Math.random() * 10) + 1;
        photo.style.animationDelay = `${(loadedPhotos.length % PAGE_SIZE) * 0.06}s`;

        photo.dataset.origTransform = photo.style.transform;

        photo.innerHTML = `
            <img src="${IMG_PATH}(${num}).jpeg" alt="记忆碎片 #${num}"
                 onerror="this.style.display='none';this.parentElement.querySelector('.photo-placeholder').style.display='flex'">
            <div class="photo-placeholder" style="display:none;"><i class="fa fa-image"></i></div>
            <span class="photo-label">碎片 #${num}</span>
        `;

        photo.addEventListener('click', () => openPreview(globalIndex));

        const img = photo.querySelector('img');
        const loadPromise = new Promise((resolve) => {
            const preloader = new Image();
            preloader.onload = resolve;
            preloader.onerror = resolve;
            preloader.src = img.src;
        });

        return { photo, loadPromise };
    }

    function distributePhoto(photo) {
        if (!masonryColumns.length) return;
        let minHeight = Infinity;
        let minCol = masonryColumns[0];
        for (const col of masonryColumns) {
            const h = col.offsetHeight;
            if (h < minHeight) {
                minHeight = h;
                minCol = col;
            }
        }
        minCol.appendChild(photo);
    }

    function createMasonryColumns() {

        masonryColumns.forEach(col => col.remove());
        masonryColumns = [];
        const colCount = 3;
        for (let i = 0; i < colCount; i++) {
            const col = document.createElement('div');
            col.className = 'masonry-column';
            photoDesk.appendChild(col);
            masonryColumns.push(col);
        }
    }

    function loadBatch() {
        const start = currentPage * PAGE_SIZE;
        const end = Math.min(start + PAGE_SIZE, MAX_IMAGE);
        const batch = [];

        for (let i = start; i < end; i++) {
            const { photo, loadPromise } = createScatterPhoto(i);
            loadedPhotos.push(photo);
            batch.push({ photo, loadPromise });
        }

        Promise.all(batch.map(b => b.loadPromise)).then(() => {
            batch.forEach(b => distributePhoto(b.photo));
        });

        currentPage++;

        if (currentPage * PAGE_SIZE >= MAX_IMAGE) {
            loadMoreBtn.style.display = 'none';
        }
    }

    function openPreview(index) {
        currentPreviewIndex = index;
        const num = MAX_IMAGE - index;

        immersivePreview.classList.add('active');
        document.body.style.overflow = 'hidden';
        previewLoader.style.display = 'flex';
        previewImg.style.opacity = '0';
        captionTitle.textContent = `记忆碎片 #${num}`;
        captionIndex.textContent = `${index + 1} / ${MAX_IMAGE}`;

        const img = new Image();
        img.src = `${IMG_PATH}(${num}).jpeg`;

        img.onload = function () {
            previewImg.src = img.src;
            previewImg.style.opacity = '1';
            previewLoader.style.display = 'none';
        };

        img.onerror = function () {
            previewLoader.innerHTML = '<i class="fa fa-exclamation-circle"></i><span style="margin-top:8px;">这张碎片找不到了</span>';
            previewLoader.style.flexDirection = 'column';
        };
    }

    function closePreview() {
        immersivePreview.classList.remove('active');
        document.body.style.overflow = '';
        currentPreviewIndex = -1;
    }

    function navigatePreview(direction) {
        if (currentPreviewIndex < 0) return;
        let newIndex = currentPreviewIndex + direction;
        if (newIndex < 0) newIndex = Math.min(loadedPhotos.length - 1, MAX_IMAGE - 1);
        if (newIndex >= MAX_IMAGE) newIndex = 0;

        if (newIndex >= loadedPhotos.length) {
            loadBatch();
        }
        openPreview(newIndex);
    }

    function bindEvents() {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.disabled = true;
            loadingIndicator.style.display = 'block';
            setTimeout(() => {
                loadBatch();
                loadMoreBtn.disabled = false;
                loadingIndicator.style.display = 'none';
            }, 500);
        });

        document.getElementById('previewClose').addEventListener('click', closePreview);
        document.getElementById('previewPrev').addEventListener('click', () => navigatePreview(-1));
        document.getElementById('previewNext').addEventListener('click', () => navigatePreview(1));
        immersivePreview.querySelector('.preview-bg').addEventListener('click', closePreview);

        document.addEventListener('keydown', (e) => {
            if (!immersivePreview.classList.contains('active')) return;
            if (e.key === 'Escape') closePreview();
            if (e.key === 'ArrowLeft') navigatePreview(-1);
            if (e.key === 'ArrowRight') navigatePreview(1);
        });

        let wheelLock = false;
        immersivePreview.addEventListener('wheel', (e) => {
            if (wheelLock) return;
            wheelLock = true;
            setTimeout(() => { wheelLock = false; }, 400);
            if (e.deltaY > 0) navigatePreview(1);
            else navigatePreview(-1);
        });
    }

    function init() {
        createMasonryColumns();
        loadBatch();
        bindEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
