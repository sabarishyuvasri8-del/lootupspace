import QRCode from 'qrcode';

export class QrService {
  /**
   * Generates a base64 Data URL QR code for a given item code or bin code.
   */
  static async generateQrDataUrl(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 300,
        color: {
          dark: '#0B1120',
          light: '#FFFFFF'
        }
      });
    } catch (err) {
      console.error('Failed to generate QR code', err);
      return '';
    }
  }

  /**
   * Generates an SVG string representation of the QR code.
   */
  static async generateQrSvg(text: string): Promise<string> {
    try {
      return await QRCode.toString(text, { type: 'svg', margin: 2, width: 300 });
    } catch (err) {
      console.error('Failed to generate QR SVG', err);
      return '';
    }
  }
}

