export async function generateKeyPair() {
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
}

export async function encryptText(publicKeyString, text) {
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
}

export async function decryptText(privateKeyString, encryptedData) {
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