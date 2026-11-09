import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CookieConsent, { OPEN_CONSENT_EVENT } from '../../src/presentation/ui/CookieConsent.jsx';
import { CONSENT_KEY } from '../../src/config/site.js';

const todos = (estado) => ({ ad_storage: estado, ad_user_data: estado, ad_personalization: estado, analytics_storage: estado });

describe('CookieConsent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.gtag = vi.fn();
  });
  afterEach(() => {
    delete window.gtag;
  });

  it('stays hidden when the Google tag is not on the page (dev, tests, build sem id)', () => {
    delete window.gtag;
    render(<CookieConsent />);
    expect(screen.queryByText('Cookies')).toBeNull();
  });

  it('asks on the first visit, with accept and decline side by side', () => {
    render(<CookieConsent />);
    expect(screen.getByRole('region', { name: 'Cookies' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aceitar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recusar' })).toBeInTheDocument();
  });

  it('accepting grants consent, remembers it and closes', () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: 'Aceitar' }));
    expect(window.gtag).toHaveBeenCalledWith('consent', 'update', todos('granted'));
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('aceito');
    expect(screen.queryByRole('region', { name: 'Cookies' })).toBeNull();
  });

  it('declining keeps consent denied and remembers it', () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: 'Recusar' }));
    expect(window.gtag).toHaveBeenCalledWith('consent', 'update', todos('denied'));
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('recusado');
  });

  it('does not ask again after a choice, but the footer link reopens it', () => {
    window.localStorage.setItem(CONSENT_KEY, 'recusado');
    render(<CookieConsent />);
    expect(screen.queryByRole('region', { name: 'Cookies' })).toBeNull();
    act(() => { window.dispatchEvent(new Event(OPEN_CONSENT_EVENT)); });
    expect(screen.getByRole('region', { name: 'Cookies' })).toBeInTheDocument();
  });
});
