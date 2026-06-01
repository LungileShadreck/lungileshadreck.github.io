/**
 * gallery.js — Lungile Shadreck Portfolio
 * Dynamically renders recursive portfolio structures.
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize Lightbox Modal
    const lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-img" src="" alt="Portfolio Image Enlarged" />
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    lightbox.addEventListener('click', function(e) {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    const galleryContainer = document.getElementById('dynamic-portfolio');
    if (!galleryContainer || typeof galleryData === 'undefined') return;

    // Recursive rendering function
    function buildCategoryHTML(folderArray, isTopLevel = true) {
        let html = '';
        
        folderArray.forEach(folder => {
            const displayTitle = folder.title;
            const featuredClass = folder.featured ? ' featured-project' : '';
            const featuredBadge = folder.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : '';

            if (isTopLevel) {
                // Top-level categories (e.g., Client Logos, Illustrations, Posters)
                html += `
                    <div class="gallery-category-block${featuredClass}" id="${folder.id}">
                        <h4 class="category-heading">${displayTitle} ${featuredBadge}</h4>
                `;
            } else {
                // Nested sub-categories (e.g. Surreal Posters)
                html += `
                    <div class="sub-category-block${featuredClass}" id="${folder.id}">
                        <h5 class="sub-category-heading">${displayTitle} ${featuredBadge}</h5>
                `;
            }

            // Render Images if any exist at this level
            if (folder.images && folder.images.length > 0) {
                html += `<div class="gallery-grid">`;
                folder.images.forEach(imgSrc => {
                    html += `
                        <div class="gallery-item">
                            <img src="${imgSrc}" alt="${displayTitle} artwork" loading="lazy" decoding="async" />
                        </div>
                    `;
                });
                html += `</div>`;
            }

            // Recursively render subfolders
            if (folder.subfolders && folder.subfolders.length > 0) {
                html += `<div class="nested-folders">`;
                html += buildCategoryHTML(folder.subfolders, false);
                html += `</div>`;
            }

            html += `</div>`; // Close block
        });

        return html;
    }

    // Master Render Function
    function renderGallerySystem() {
        let finalHTML = '';

        if (galleryData.clientLogos && galleryData.clientLogos.length > 0) {
            finalHTML += `
                <div class="master-section">
                    <h3 class="master-heading">Client Logos</h3>
                    ${buildCategoryHTML(galleryData.clientLogos)}
                </div>
            `;
        }

        if (galleryData.personal && galleryData.personal.length > 0) {
            finalHTML += `
                <div class="master-section">
                    <h3 class="master-heading">Personal & Studio Work</h3>
                    ${buildCategoryHTML(galleryData.personal)}
                </div>
            `;
        }
        
        galleryContainer.innerHTML = finalHTML;

        // Attach Lightbox Logic to new images
        const galleryItems = galleryContainer.querySelectorAll('.gallery-item img');
        galleryItems.forEach(img => {
            img.addEventListener('click', function() {
                lightboxImg.src = this.src;
                lightbox.classList.add('active');
            });
        });
    }

    renderGallerySystem();
});
