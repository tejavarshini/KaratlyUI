export const DEMO_PHONE     = '9999999999';
export const DEMO_UNIQUE_ID = 'DEMO-AUG-QA-001';
export const DEMO_OTP       = '000000';

export function isDemoPhone(phone: string) {
  return phone?.replace(/\s/g, '') === DEMO_PHONE;
}

export async function demoLogin({ phone, email, name = 'QA Tester' }: { phone: string; email: string; name?: string }) {
  const BASE_URL = import.meta.env.VITE_AUGMONT_BASE_URL || 'https://uatbckend.karatly.net';
  const response = await fetch(`${BASE_URL}/api/v1/demo/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, email, name }),
  });

  const data = await response.json();

  if (!data?.success) {
    throw new Error(data?.message || 'Demo login failed');
  }

  const { token, user } = data.payload;

  localStorage.setItem('authToken', token);
  localStorage.setItem('userUniqueId', user.uniqueId);
  localStorage.setItem('isDemoUser', 'true');
  localStorage.setItem('userPhone', user.phone);
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userName', user.name);

  return { token, user };
}

export async function getDemoStatus() {
  const BASE_URL = import.meta.env.VITE_AUGMONT_BASE_URL || 'https://uatbckend.karatly.net';
  const response = await fetch(`${BASE_URL}/api/v1/demo/status`);
  return response.json();
}

export async function setupDemoUser(secret: string) {
  const BASE_URL = import.meta.env.VITE_AUGMONT_BASE_URL || 'https://uatbckend.karatly.net';
  const response = await fetch(`${BASE_URL}/api/v1/demo/setup`, {
    method: "POST",
    headers: { 'X-Demo-Secret': secret }
  });
  return response.json();
}

export function clearDemoSession() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userUniqueId');
  localStorage.removeItem('isDemoUser');
  localStorage.removeItem('userPhone');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
}

export function isCurrentSessionDemo() {
  return localStorage.getItem('isDemoUser') === 'true';
}
