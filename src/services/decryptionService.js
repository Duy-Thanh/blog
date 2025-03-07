const worker = new Worker(new URL('../workers/decryptWorker.js', import.meta.url));

export const decryptWithWorker = (encryptedData) => {
  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.data);
      } else {
        reject(new Error(e.data.error));
      }
    };

    worker.onerror = (error) => {
      reject(error);
    };

    worker.postMessage({
      data: encryptedData.data,
      key: encryptedData.key,
      iv: encryptedData.iv,
      authTag: encryptedData.authTag
    });
  });
}; 