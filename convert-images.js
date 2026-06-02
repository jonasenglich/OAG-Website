const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = __dirname;

// All images that need WebP versions for the website
const images = [
  // US2 gallery (artikel-4)
  'US2-1.png', 'US2-2.png', 'US2-3.png', 'US2-5.png', 'US2-9.png', 'US2-10.png',
  // US2-5 also used as card image
  // urban sketching gallery (artikel-1)
  'urban sketching 3.png', 'urban sketching 4.png', 'urban sketching 5.png',
  'urban sketching 6.png', 'urban sketching 7.png', 'urban sketching 8.png',
  'urban sketching 9.png', 'urban sketching 10.png', 'urban sketching 11.png',
  // freies zeichnen gallery (artikel-2)
  'freies zeichnen lieblingseck 1.png', 'freies zeichnen lieblingseck 2.png',
  'freies zeichnen lieblingseck 3.png', 'freies zeichnen lieblingseck 4.png',
  'freies zeichnen lieblingseck 6.png', 'freies zeichnen lieblingseck 7.png',
  'freies zeichnen lieblingseck 8.png', 'freies zeichnen lieblingseck 9.png',
  'freies zeichnen lieblingseck 10.png', 'freies zeichnen lieblingseck 11.png',
  'freies zeichnen lieblingseck 12.png', 'freies zeichnen lieblingseck 13.png',
  // collage workshop gallery (artikel-3)
  'collage workshop1.png', 'collage workshop2.png', 'collage workshop3.png',
  'collage workshop4.png', 'collage workshop5.png', 'collage workshop6.png',
  // Inline images in articles
  'Insta OAG Collagen Workshop.png',
  'Insta OAG Urban Sketching Teil 2.png',
  'Plakat OAG Urban Sketching.png',
  'Plakat OAG Freies Zeichnen Lieblingseck.png',
];

async function convert() {
  for (const file of images) {
    const src = path.join(dir, file);
    const webpName = file.replace(/\.png$/i, '.webp');
    const dest = path.join(dir, webpName);

    if (!fs.existsSync(src)) {
      console.log(`SKIP (not found): ${file}`);
      continue;
    }

    try {
      const sizeBefore = fs.statSync(src).size;
      await sharp(src)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(dest);
      const sizeAfter = fs.statSync(dest).size;
      const pct = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
      console.log(`OK: ${file} (${(sizeBefore/1024/1024).toFixed(1)}MB -> ${(sizeAfter/1024).toFixed(0)}KB, -${pct}%)`);
    } catch (err) {
      console.log(`ERROR: ${file} - ${err.message}`);
    }
  }
  console.log('\nDone!');
}

convert();
