import CryptoJS from 'crypto-js';

const secretKey = 'protect-session';

// Encrypts the given text using AES encryption.
function encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

// Decrypts the given ciphertext using AES decryption.
function decrypt(ciphertext: string): string {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedText) {
            throw new Error("Decryption resulted in an empty string");
        }
        return decryptedText;
    } catch (error) {
        console.error("Decryption error:", error);
        throw error;
    }
}

export { encrypt, decrypt };
