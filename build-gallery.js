const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, 'images', 'Core Projects');
const OUTPUT_FILE = path.join(__dirname, 'assets', 'js', 'gallery-data.js');

// Helper to get all images in a flat folder
function getImagesInDir(dirPath, relativeRoot) {
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .sort()
        .map(file => path.posix.join(relativeRoot, file));
}

// Function to recursively or semi-recursively parse folders.
// The user asked to preserve hierarchy for Personal > Posters > ...
function parseFolderDeep(currentPath, relativePath) {
    if (!fs.existsSync(currentPath)) return null;

    const items = fs.readdirSync(currentPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    // Check if this directory directly contains images
    const images = getImagesInDir(currentPath, relativePath);
    
    // Check if it has subfolders
    const subfolders = items.map(subName => {
        return parseFolderDeep(
            path.join(currentPath, subName),
            path.posix.join(relativePath, subName)
        );
    }).filter(Boolean);

    // Read .meta.json for custom ordering and featured flags
    let meta = { order: 99, featured: false };
    const metaPath = path.join(currentPath, '.meta.json');
    if (fs.existsSync(metaPath)) {
        try {
            const rawMeta = fs.readFileSync(metaPath, 'utf8');
            meta = { ...meta, ...JSON.parse(rawMeta) };
        } catch (e) {
            console.error(`Error reading meta in ${currentPath}:`, e);
        }
    }

    // Sort subfolders by manual order, fallback to alphabetical
    subfolders.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

    return {
        id: path.basename(currentPath).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: path.basename(currentPath),
        order: meta.order,
        featured: meta.featured,
        images: images,
        subfolders: subfolders
    };
}

try {
    // 1. Parse Client Logos
    const clientLogosPath = path.join(ROOT_DIR, 'Client Logos');
    const clientLogos = parseFolderDeep(clientLogosPath, 'images/Core Projects/Client Logos');

    // 2. Parse Personal (which contains Posters > Branding, etc.)
    const personalPath = path.join(ROOT_DIR, 'personal');
    const personal = parseFolderDeep(personalPath, 'images/Core Projects/personal');
    
    const galleryData = {
        clientLogos: clientLogos ? clientLogos.subfolders : [],
        personal: personal ? personal.subfolders : []
    };
    
    const fileContent = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Run 'node build-gallery.js' to update this file when you add new images.
const galleryData = ${JSON.stringify(galleryData, null, 4)};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
    console.log('✅ Successfully built recursive gallery data: assets/js/gallery-data.js');
} catch (error) {
    console.error('❌ Error building gallery data:', error);
}
