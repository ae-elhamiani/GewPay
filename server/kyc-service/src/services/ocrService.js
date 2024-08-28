const { createWorker, PSM } = require('tesseract.js');
const sharp = require('sharp');

class OCRService {
  constructor() {
    this.worker = null;
  }

  async initializeWorker() {
    if (!this.worker) {
      this.worker = await createWorker();
      await this.worker.loadLanguage('fra+ara');
      await this.worker.initialize('fra+ara');
      await this.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/.-',
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
    }
  }

  async preprocessImage(imageBuffer) {
    return await sharp(imageBuffer)
      .greyscale()
      .normalise()
      .sharpen()
      .threshold(128)
      .toBuffer();
  }

  async processImage(imageBuffer) {
    await this.initializeWorker();
    const processedBuffer = await this.preprocessImage(imageBuffer);
    
    const { data } = await this.worker.recognize(processedBuffer);
    
    console.log('OCR Result:', data.text);
    console.log('OCR Words:', data.words.map(w => w.text).join(', '));

    return {
      text: data.text,
      words: data.words,
      lines: data.lines
    };
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

module.exports = new OCRService();