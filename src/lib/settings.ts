'use client';

const COD_KEY = 'arhuu_cod_enabled';

export function isCODEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(COD_KEY) !== 'false';
}

export function setCODEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COD_KEY, String(enabled));
}
