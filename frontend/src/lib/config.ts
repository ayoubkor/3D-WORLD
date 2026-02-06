/**
 * Configuration centralisée pour les URLs de l'API
 * Utilise les variables d'environnement pour déterminer l'URL de base
 */

// URL de l'API backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Construit une URL complète pour un endpoint de l'API
 * @param path - Le chemin de l'endpoint (ex: '/api/products')
 * @returns L'URL complète
 */
export function getApiUrl(path: string): string {
  // S'assurer que le path commence par /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

/**
 * Construit une URL complète pour une image
 * @param imagePath - Le chemin de l'image (ex: '/uploads/product.jpg')
 * @returns L'URL complète de l'image
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  // S'assurer que le path commence par /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
