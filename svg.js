const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const ImageTracer = require("imagetracerjs");

(async () => {
  const img = await loadImage("Amity.jpg");

  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);

  // ✅ CORRECT FUNCTION (Node)
  const svg = ImageTracer.imagedataToSVG(imageData, {
    numberofcolors: 8,
    scale: 1,
    strokewidth: 0,
  });

  fs.writeFileSync("Amity.svg", svg);
  console.log("✅ Amity.svg created successfully");
})();
