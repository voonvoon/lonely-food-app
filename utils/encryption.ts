import CryptoJS from 'crypto-js';

const secretKey = 'protect-session';

//Encrypts the given text using AES encryption.
function encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}


//Decrypts the given ciphertext using AES decryption.
function decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt };
