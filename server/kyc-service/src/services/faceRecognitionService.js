const sharp = require('sharp');

class FaceRecognitionService {
  async compareFaces(selfieBuffer, documentBuffer) {
    try {
      const selfieMetadata = await sharp(selfieBuffer).metadata();
      const documentMetadata = await sharp(documentBuffer).metadata();

      // Compare image dimensions and format as a basic check
      const dimensionsSimilar = Math.abs(selfieMetadata.width - documentMetadata.width) < 100 &&
                                Math.abs(selfieMetadata.height - documentMetadata.height) < 100;
      const formatSimilar = selfieMetadata.format === documentMetadata.format;

      // Compare image histograms
      const selfieHistogram = await this.getHistogram(selfieBuffer);
      const documentHistogram = await this.getHistogram(documentBuffer);
      const histogramSimilarity = this.compareHistograms(selfieHistogram, documentHistogram);

      // You may need to adjust these thresholds based on your specific use case
      return dimensionsSimilar && formatSimilar && histogramSimilarity > 0.7;
    } catch (error) {
      console.error('Error comparing faces:', error);
      return false;
    }
  }

  async getHistogram(buffer) {
    const { channels } = await sharp(buffer).stats();
    return channels.map(channel => channel.histogram);
  }

  compareHistograms(hist1, hist2) {
    const totalBins = hist1[0].length;
    let similarity = 0;

    for (let i = 0; i < totalBins; i++) {
      const bin1 = (hist1[0][i] + hist1[1][i] + hist1[2][i]) / 3;
      const bin2 = (hist2[0][i] + hist2[1][i] + hist2[2][i]) / 3;
      similarity += Math.min(bin1, bin2);
    }

    return similarity / totalBins;
  }
}

module.exports = new FaceRecognitionService();