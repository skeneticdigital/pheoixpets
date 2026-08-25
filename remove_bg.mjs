import { Jimp } from "jimp";

async function removeBackground() {
  try {
    const image = await Jimp.read('./public/phoenix_pets_logo_new.jpg');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If pixel is very close to black, make it transparent
      if (red < 20 && green < 20 && blue < 20) {
        this.bitmap.data[idx + 3] = 0; // Alpha channel
      }
    });
    
    await image.write('./public/phoenix_pets_logo.png');
    console.log('Successfully saved to phoenix_pets_logo.png');
  } catch (err) {
    console.error('Error:', err);
  }
}

removeBackground();
