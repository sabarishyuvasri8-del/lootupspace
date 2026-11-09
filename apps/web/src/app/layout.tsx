import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from '../lib/auth-context';
import { getRouteTitle } from '../lib/navigation';
import { RoleSwitcherBanner } from '../components/RoleSwitcherBanner';

function RouteMetadataEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.title = getRouteTitle(pathname);
  }, [pathname]);

  useEffect(() => {
    if (hash) {
      const targetId = hash.slice(1);
      const timer = window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'auto' });
        }
      }, 60);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <RouteMetadataEffects />
      <a href="#main-content" className="skip-link visually-hidden">
        Skip to main content
      </a>
      <RoleSwitcherBanner />
      <div className="flex-1 flex flex-col">
        {children || <Outlet />}
      </div>
    </AuthProvider>
  );
}
