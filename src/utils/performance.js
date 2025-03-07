export const measurePerformance = async (name, fn) => {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    if (duration > 1000) { // Log if takes more than 1 second
      console.warn(`Performance warning: ${name} took ${duration}ms`);
    }
  }
}; 