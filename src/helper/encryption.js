export async function generateKeyPair() {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256"
      },
      true,
      ["encrypt", "decrypt"]
    );
  
    const exportPublic = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const exportPrivate = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  
    const generatedPublicKey = arrayBufferToBase64(exportPublic);
    const generatedPrivateKey = arrayBufferToBase64(exportPrivate);
  
    return { generatedPublicKey, generatedPrivateKey}
  } catch (error) {
    console.error("Error generating key pair:", error);
  }
}

export async function encryptText(publicKeyString, text) {
  try {
    const keyData = base64ToArrayBuffer(publicKeyString);
    const publicKey = await window.crypto.subtle.importKey("spki", keyData, {
      name: "RSA-OAEP",
      hash: "SHA-256"
    }, false, ["encrypt"]);
  
    const encodedText = new TextEncoder().encode(text);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      publicKey,
      encodedText
    );
  
    return arrayBufferToBase64(encryptedBuffer);
  } catch (error) {
    console.error("Error encrypting text:", error); 
  }
}

export async function decryptText(privateKeyString, encryptedData) {
  try {
    const keyData = base64ToArrayBuffer(privateKeyString);
    const privateKey = await window.crypto.subtle.importKey("pkcs8", keyData, {
      name: "RSA-OAEP",
      hash: "SHA-256"
    }, false, ["decrypt"]);
  
    const encryptedBuffer = base64ToArrayBuffer(encryptedData);
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      encryptedBuffer
    );
  
    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    return decryptedText;
  } catch (error) {
    console.error("Error decrypting text:", error); 
  }
}

export async function generateSymmetricKey() {
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt"]
    );

    const exportedKey = await window.crypto.subtle.exportKey("raw", key);
    const keyString = arrayBufferToBase64(exportedKey);

    return keyString;
  } catch (error) {
    console.error("Error generating symmetric key:", error);
  }
}

export async function encryptWithSymmetricKey(symmetricKeyString, text) {
  try {
    const symmetricKey = await importSymmetricKey(symmetricKeyString);

    const encodedText = new TextEncoder().encode(text);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      symmetricKey,
      encodedText
    );

    const encryptedData = {
      ciphertext: arrayBufferToBase64(encryptedBuffer),
      iv: arrayBufferToBase64(iv)
    };

    return encryptedData;
  } catch (error) {
    console.error("Error encrypting text with symmetric key:", error);
  }
}

export async function decryptWithSymmetricKey(symmetricKeyString, encryptedData) {
  try {
    const symmetricKey = await importSymmetricKey(symmetricKeyString);

    const encryptedBuffer = base64ToArrayBuffer(encryptedData.ciphertext);
    const iv = base64ToArrayBuffer(encryptedData.iv);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      symmetricKey,
      encryptedBuffer
    );

    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    return decryptedText;
  } catch (error) {
    console.error("Error decrypting text with symmetric key:", error);
  }
}

// Helper functions
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}

async function importSymmetricKey(keyString) {
  const keyData = base64ToArrayBuffer(keyString);
  return await window.crypto.subtle.importKey("raw", keyData, {
    name: "AES-GCM"
  }, false, ["encrypt", "decrypt"]);
}