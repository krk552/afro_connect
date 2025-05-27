// Debug script to check auth callback URL
console.log('=== Auth Callback Debug ===');
console.log('Current URL:', window.location.href);
console.log('Hash:', window.location.hash);
console.log('Search params:', window.location.search);

// Parse hash parameters
const hashParams = new URLSearchParams(window.location.hash.substring(1));
console.log('Hash parameters:');
for (const [key, value] of hashParams.entries()) {
  console.log(`  ${key}: ${value}`);
}

// Parse query parameters
const searchParams = new URLSearchParams(window.location.search);
console.log('Query parameters:');
for (const [key, value] of searchParams.entries()) {
  console.log(`  ${key}: ${value}`);
}

// Check for common Supabase parameters
const accessToken = hashParams.get('access_token');
const refreshToken = hashParams.get('refresh_token');
const type = hashParams.get('type');
const error = hashParams.get('error') || searchParams.get('error');

console.log('Supabase tokens:', {
  hasAccessToken: !!accessToken,
  hasRefreshToken: !!refreshToken,
  type: type,
  error: error
}); 