import React from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';
import { prefetchRoute } from '../lib/navigation';

export interface SmartLinkProps extends Omit<LinkProps, 'to' | 'prefetch'> {
  href?: string;
  to?: LinkProps['to'];
  prefetch?: boolean;
}

export function SmartLink({
  href,
  to,
  prefetch = true,
  onMouseEnter,
  onFocus,
  onTouchStart,
  onClick,
  ...rest
}: SmartLinkProps) {
  const navigate = useNavigate();
  const target = to ?? href ?? '/';
  const targetString = typeof target === 'string' ? target : target.pathname || '';

  const handlePrefetch = () => {
    if (prefetch && targetString.startsWith('/')) {
      prefetchRoute(targetString);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      typeof targetString === 'string' &&
      targetString.startsWith('/') &&
      !targetString.includes('#') &&
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      e.preventDefault();
      (document as any).startViewTransition(() => {
        navigate(targetString);
      });
    }
  };

  return (
    <Link
      to={target}
      onClick={handleClick}
      onMouseEnter={(e) => {
        handlePrefetch();
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        handlePrefetch();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        handlePrefetch();
        onTouchStart?.(e);
      }}
      {...rest}
    />
  );
}
