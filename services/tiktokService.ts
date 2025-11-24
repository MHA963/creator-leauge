
// Services for handling TikTok OAuth via the specified proxy

export interface TikTokProfile {
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  total_likes: number;
}

// Configuration
// NOTE: You should replace CLIENT_KEY with your actual TikTok App Client Key if available.
const CLIENT_KEY = 'aw336432k4'; 
const PROXY_REDIRECT_URI = 'https://tiktok-proxy.ta3llam-academy.workers.dev/auth-callback';

/**
 * Redirects the user to TikTok's OAuth authorization page.
 * The redirect_uri points to the worker proxy which handles the code exchange
 * and redirects back to this app with user info.
 */
export const initiateTikTokAuth = () => {
  const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
  
  authUrl.searchParams.set('client_key', CLIENT_KEY);
  authUrl.searchParams.set('scope', 'user.info.basic');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', PROXY_REDIRECT_URI);
  
  // We pass the current origin in the state so the proxy knows where to return the user
  // structure: { returnUrl: "https://myapp.com" }
  const statePayload = JSON.stringify({ returnUrl: window.location.href });
  authUrl.searchParams.set('state', btoa(statePayload));

  window.location.href = authUrl.toString();
};

/**
 * Parses the query parameters returned by the proxy after a successful login.
 * Expected format: ?username=...&avatar=...&followers=...&likes=...
 */
export const parseTikTokAuthCallback = (): TikTokProfile | null => {
  const params = new URLSearchParams(window.location.search);

  // Check if we have the essential data (proxy usually returns these)
  const username = params.get('username');
  
  if (!username) return null;

  return {
    username: username,
    displayName: params.get('display_name') || params.get('name') || username,
    avatar: params.get('avatar') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + username,
    followers: parseInt(params.get('followers') || params.get('follower_count') || '0', 10),
    total_likes: parseInt(params.get('likes') || params.get('heart_count') || '0', 10)
  };
};
