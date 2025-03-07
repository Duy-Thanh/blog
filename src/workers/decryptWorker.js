/* eslint-disable no-restricted-globals */
// Web Worker for decryption
self.onmessage = async (e) => {
  const { data, key, iv, authTag } = e.data;
  
  try {
    // Import the key
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
        additionalData: authTag
      },
      cryptoKey,
      data
    );

    // Send back result
    self.postMessage({ success: true, data: decrypted });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
}; 