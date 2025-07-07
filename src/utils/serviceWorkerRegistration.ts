/**
 * Service Worker Registration Utility
 */

interface ServiceWorkerCallbacks {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export function register(callbacks: ServiceWorkerCallbacks = {}) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';
      registerSW(swUrl, callbacks);
    });
  }
}

function registerSW(swUrl: string, callbacks: ServiceWorkerCallbacks) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('SW registered: ', registration);
      if (callbacks.onSuccess) {
        callbacks.onSuccess(registration);
      }
    })
    .catch((error) => {
      console.log('SW registration failed: ', error);
      if (callbacks.onError) {
        callbacks.onError(error);
      }
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}