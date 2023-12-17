import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { decryptText, encryptText, generateKeyPair } from '../helper/encryption'

export const useKeyStore = defineStore('key', () => {
  const publicKey = ref('')
  const privateKey = ref('')

  onMounted(async () => {    
    const { generatedPrivateKey, generatedPublicKey } = await generateKeyPair()
    publicKey.value = generatedPublicKey
    privateKey.value = generatedPrivateKey
  })

  return { publicKey, privateKey }
})
