import QRCode from 'qrcode';

/**
 * Genera un código QR en formato Base64 Data URL.
 * @param text Texto o JSON a codificar en el QR
 */
export const generarQrBase64 = async (text: string): Promise<string> => {
  try {
    const qr = await QRCode.toDataURL(text);
    return qr;
  } catch (error) {
    console.error('Error generando QR', error);
    throw new Error('No se pudo generar el código QR');
  }
};
