import { defineStore } from 'pinia'
import { ref } from 'vue'
import { decryptText, decryptWithSymmetricKey, encryptText, encryptWithSymmetricKey, generateKeyPair, generateSymmetricKey } from '../helper/encryption'

export const useKeyStore = defineStore('key', () => {
  const publicKey = ref('')
  const privateKey = ref('')

  async function createKeyPair() {
    const { generatedPrivateKey, generatedPublicKey } = await generateKeyPair()
    publicKey.value = generatedPublicKey
    privateKey.value = generatedPrivateKey
  }

/*   onMounted(async () => {    
    const { generatedPrivateKey, generatedPublicKey } = await generateKeyPair()
    publicKey.value = generatedPublicKey
    privateKey.value = generatedPrivateKey

    const symmetricKey = await generateSymmetricKey()
    console.log("🚀 ~ file: key.store.js:15 ~ onMounted ~ symmetricKey:", symmetricKey)

    const encryptedMessage = await encryptWithSymmetricKey(symmetricKey, 'Hello 👌')
    console.log("🚀 ~ file: key.store.js:17 ~ onMounted ~ encryptedMessage:", encryptedMessage)
    const encryptedSymetricKey = await encryptText(publicKey.value, symmetricKey)
    console.log("🚀 ~ file: key.store.js:19 ~ onMounted ~ encryptedSymetricKey:", encryptedSymetricKey)

    const decryptedSymetricKey = await decryptText(privateKey.value, encryptedSymetricKey)
    console.log("🚀 ~ file: key.store.js:21 ~ onMounted ~ decryptedSymetricKey:", decryptedSymetricKey)
    const decryptedMessage = await decryptWithSymmetricKey(decryptedSymetricKey, encryptedMessage)
    console.log("🚀 ~ file: key.store.js:24 ~ onMounted ~ decryptedMessage:", decryptedMessage)
  }) */

  return { publicKey, privateKey, createKeyPair }
})
