document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.projectDetailsContainer');
    const blackScreen = document.querySelector('.projectDetailsBlackScreen');
    const details = Array.from(document.querySelectorAll('.project-details'));

    details.forEach(function (detail) {
        detail.style.display = 'none';
        detail.setAttribute('aria-hidden', 'true');
    });
    if (container) {
        container.style.display = 'none';
        container.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.project').forEach(function (proj) {
        proj.addEventListener('click', function () {
            const projectId = proj.id.replace('project-', '');

            details.forEach(function (detail) {
                detail.style.display = 'none';
            });

            const detail = document.getElementById('project-details_' + projectId);
            if (detail) {
                if (container) {
                    container.style.display = 'block';
                    container.setAttribute('aria-hidden', 'false');
                }
                detail.style.display = 'block';
                detail.setAttribute('aria-hidden', 'false');
                // save and disable body scroll while modal is open
                if (typeof document.body.dataset._prevOverflow === 'undefined') {
                    document.body.dataset._prevOverflow = document.body.style.overflow || '';
                }
                document.body.style.overflow = 'hidden';
                // move focus to the detail for accessibility
                try { detail.setAttribute('tabindex', '-1'); detail.focus(); } catch (e) {}
            } else {
                if (container) container.style.display = 'none';
            }
        });
    });

    if (blackScreen) {
        blackScreen.addEventListener('click', function () {
            details.forEach(function (detail) {
                detail.style.display = 'none';
                detail.setAttribute('aria-hidden', 'true');
            });
            if (container) {
                container.style.display = 'none';
                container.setAttribute('aria-hidden', 'true');
            }
            // restore body scroll
            if (typeof document.body.dataset._prevOverflow !== 'undefined') {
                document.body.style.overflow = document.body.dataset._prevOverflow;
                delete document.body.dataset._prevOverflow;
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            details.forEach(function (detail) {
                detail.style.display = 'none';
                detail.setAttribute('aria-hidden', 'true');
            });
            if (container) {
                container.style.display = 'none';
                container.setAttribute('aria-hidden', 'true');
            }
            if (typeof document.body.dataset._prevOverflow !== 'undefined') {
                document.body.style.overflow = document.body.dataset._prevOverflow;
                delete document.body.dataset._prevOverflow;
            }
        }
    });

    (function(){
        var modal = document.getElementById('lightbox-modal');
        if(!modal) return;

        var modalImage = modal.querySelector('.lightbox-image');
        var counter = modal.querySelector('.lightbox-counter');
        var closeBtn = modal.querySelector('.lightbox-close');
        var prevBtn = modal.querySelector('.lightbox-prev');
        var nextBtn = modal.querySelector('.lightbox-next');

        function collectThumbnails(){
            return Array.prototype.slice.call(document.querySelectorAll('.project-details-screenshots'));
        }

        var thumbnailsGroups = collectThumbnails();
        var current = 0;
        var activeGroup = [];

        function imagesFromGroup(group){
            var imgs = Array.prototype.slice.call(group.querySelectorAll('img'));
            return imgs.map(function(img){
                return {src: img.getAttribute('src') || img.getAttribute('data-src'), alt: img.getAttribute('alt') || ''};
            });
        }

        function open(index){
            if(!activeGroup || activeGroup.length === 0) return;
            current = (index + activeGroup.length) % activeGroup.length;
            modalImage.src = activeGroup[current].src;
            modalImage.alt = activeGroup[current].alt;
            counter.textContent = (current + 1) + ' / ' + activeGroup.length;
            modal.setAttribute('aria-hidden','false');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function close(){
            modal.setAttribute('aria-hidden','true');
            document.body.style.overflow = '';
            modalImage.src = '';
        }

        function prev(){ open(current - 1); }
        function next(){ open(current + 1); }

        function attachHandlers(){
            thumbnailsGroups = collectThumbnails();
            thumbnailsGroups.forEach(function(group){
                var imgs = Array.prototype.slice.call(group.querySelectorAll('img'));
                imgs.forEach(function(img, idx){
                    img.style.cursor = 'zoom-in';
                    img.removeEventListener('click', img._lightboxHandler);
                    img._lightboxHandler = function(e){
                        e.preventDefault();
                        activeGroup = imagesFromGroup(group);
                        open(idx);
                    };
                    img.addEventListener('click', img._lightboxHandler);
                });
            });
        }

        attachHandlers();

        if(window.MutationObserver){
            var mo = new MutationObserver(function(){ attachHandlers(); });
            mo.observe(document.body, {childList:true, subtree:true});
        }

        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', prev);
        nextBtn.addEventListener('click', next);

        modal.addEventListener('click', function(e){ if(e.target === modal) close(); });

        document.addEventListener('keydown', function(e){
            if(modal.getAttribute('aria-hidden') === 'false'){
                if(e.key === 'Escape') close();
                if(e.key === 'ArrowLeft') prev();
                if(e.key === 'ArrowRight') next();
            }
        });
    })();
});

