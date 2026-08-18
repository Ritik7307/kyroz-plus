let defaultUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
if (typeof window !== 'undefined') {
  const localHub = localStorage.getItem('localHubUrl');
  if (localHub) {
    defaultUrl = localHub;
  }
}
export const API_URL = defaultUrl;
