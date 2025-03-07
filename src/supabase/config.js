import { createClient } from '@supabase/supabase-js'
import { privateKey } from '../keys/private-key'
import crypto from 'crypto-browserify'

let supabaseInstance = null
let initializationPromise = null

async function getDecryptedCredentials() {
  try {
    const response = await fetch('/blog/encrypted-credentials.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch credentials: ${response.status} ${response.statusText}`)
    }
    
    const {
      data: encryptedData,
      iv,
      authTag,
      encryptedKey
    } = await response.json()
    
    // Decrypt the AES key using RSA
    const decryptedKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      },
      Buffer.from(encryptedKey, 'base64')
    )

    // Decrypt the data using AES
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      decryptedKey,
      Buffer.from(iv, 'base64')
    )
    decipher.setAuthTag(Buffer.from(authTag, 'base64'))
    
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('Failed to decrypt credentials:', error)
    throw error
  }
}

// Initialize Supabase with decrypted credentials
async function initSupabase() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        const credentials = await getDecryptedCredentials()
        supabaseInstance = createClient(credentials.url, credentials.key, {
          auth: { 
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        })
        // Test the connection
        await supabaseInstance.auth.getSession()
        return supabaseInstance
      } catch (error) {
        console.error('Supabase initialization failed:', error)
        initializationPromise = null
        throw error
      }
    })()
  }
  return initializationPromise
}

// Initialize immediately
const supabasePromise = initSupabase()

export const supabase = {
  get instance() {
    if (!supabaseInstance) {
      throw new Error('Supabase not initialized - please await getSupabase()')
    }
    return supabaseInstance
  },
  get auth() {
    if (!supabaseInstance) {
      throw new Error('Supabase auth not initialized - please await getSupabase()')
    }
    return supabaseInstance.auth
  }
}

export async function getSupabase() {
  return await supabasePromise
} 