// Data for the gallery
const imagesData = [
    { id: 1, title: 'Mountain Peak', category: 'Nature', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
    { id: 2, title: 'City Skyline', category: 'Architecture', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
    { id: 3, title: 'Modern Setup', category: 'Technology', src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80' },
    { id: 4, title: 'Forest Path', category: 'Nature', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' },
    { id: 5, title: 'Glass Building', category: 'Architecture', src: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&q=80' },
    { id: 6, title: 'Coding Interface', category: 'Technology', src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80' }
];

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const filterButtons = document.querySelectorAll('.filter-buttons button');
const modal = document.getElementById('lightboxModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const modalCounter = document.getElementById('modalCounter');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fileUpload = document.getElementById('fileUpload');

let currentCategory = 'All';
let filteredImages = [];
let currentIndex = 0;

// Initialize Gallery
function initGallery() {
    filterImages('All');
    setupEventListeners();
}

// Render Images
function renderImages(images) {
    galleryGrid.innerHTML = '';
    
    if (images.length === 0) {
        galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">No images found in this category.</p>';
        return;
    }

    images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${img.src}" alt="${img.title}" loading="lazy">
            <div class="overlay">
                <h3>${img.title}</h3>
                <p>${img.category}</p>
            </div>
        `;
        item.addEventListener('click', () => openModal(index));
        galleryGrid.appendChild(item);
    });
}

// Filter Images
function filterImages(category) {
    currentCategory = category;
    filteredImages = category === 'All' 
        ? imagesData 
        : imagesData.filter(img => img.category === category);
    renderImages(filteredImages);
}

// Open Modal
function openModal(index) {
    currentIndex = index;
    updateModalContent();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close Modal
function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Update Modal Content
function updateModalContent() {
    const imgData = filteredImages[currentIndex];
    modalImg.src = imgData.src;
    modalImg.alt = imgData.title;
    modalCaption.textContent = imgData.title;
    modalCounter.textContent = `${currentIndex + 1} of ${filteredImages.length}`;
}

// Navigate Modal
function navigateModal(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = filteredImages.length - 1;
    } else if (currentIndex >= filteredImages.length) {
        currentIndex = 0;
    }
    updateModalContent();
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterImages(e.target.dataset.filter);
        });
    });

    // Modal Navigation & Closing
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateModal(-1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateModal(1); });

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') navigateModal(-1);
        if (e.key === 'ArrowRight') navigateModal(1);
    });

    // --- LOCAL DEVICE UPLOAD LOGIC ---
    fileUpload.addEventListener('change', function(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Loop through all selected files
        Array.from(files).forEach(file => {
            // Ensure it's an image
            if (!file.type.startsWith('image/')) return;

            // Create a temporary local URL for the device image
            const imageUrl = URL.createObjectURL(file);

            // Create a new image object for our data array
            const newImageData = {
                id: Date.now() + Math.random(), // Unique ID
                title: file.name.split('.')[0], // Use filename as title
                category: 'Device Photos',
                src: imageUrl
            };

            // Add to the beginning of the gallery array
            imagesData.unshift(newImageData);
        });

        // Automatically switch to the 'Device Photos' filter tab to show new uploads
        const devicePhotosBtn = Array.from(filterButtons).find(btn => btn.dataset.filter === 'Device Photos');
        if (devicePhotosBtn) {
            filterButtons.forEach(b => b.classList.remove('active'));
            devicePhotosBtn.classList.add('active');
            filterImages('Device Photos');
        } else {
            // Fallback if button isn't found
            filterImages('All'); 
        }

        // Reset the input so you can upload the same files again if needed
        fileUpload.value = '';
    });
}

// Run Initialization
initGallery();