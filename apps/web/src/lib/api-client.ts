const configuredApiUrl =
  typeof import.meta !== 'undefined' ? ((import.meta as any).env?.VITE_API_URL as string | undefined) : undefined;
const API_BASE_URL = configuredApiUrl ? configuredApiUrl.replace(/\/$/, '') : '/api/v1';

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('lootup_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err: any) {
    console.warn(`[API Client] Error calling ${endpoint}:`, err.message);
    throw err;
  }
}

