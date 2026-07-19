/**
 * Helper to get the backend API origin.
 * In a standard setup on same host, this returns an empty string (relative calls).
 * If running on an external frontend host like Netlify (dgshopbd.netlify.app),
 * this returns the deployed Cloud Run server URL so requests are routed correctly.
 */
export function getApiUrl(path: string): string {
  const hostname = window.location.hostname;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Check if a custom backend URL is supplied via Vite environment variables (e.g. set on Netlify)
  const metaEnv = (import.meta as any).env || {};
  const envBackendUrl = metaEnv.VITE_BACKEND_URL || metaEnv.VITE_API_URL;
  if (envBackendUrl) {
    const origin = envBackendUrl.endsWith('/') ? envBackendUrl.slice(0, -1) : envBackendUrl;
    return `${origin}${cleanPath}`;
  }

  // Netlify Serverless Function support:
  // Since we set up netlify.toml redirects to route /api/* to the serverless function,
  // we should use relative path on Netlify so it calls their own Netlify backend with their custom environment variables!
  if (hostname.includes('netlify.app') || hostname === 'dgshopbd.netlify.app') {
    return cleanPath;
  }

  // If we are on Vercel or custom domains other than the backend host, we use the deployed server's absolute URL
  if (
    hostname.includes('vercel.app') || 
    (hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== '5173')
  ) {
    const backendOrigin = 'https://ais-pre-afrck5lszjlmbr4e76byly-183229866589.asia-southeast1.run.app';
    return `${backendOrigin}${cleanPath}`;
  }

  // Otherwise, use relative URLs
  return cleanPath;
}
