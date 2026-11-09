import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
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
  ...rest
}: SmartLinkProps) {
  const target = to ?? href ?? '/';
  const targetString = typeof target === 'string' ? target : target.pathname || '';

  const handlePrefetch = () => {
    if (prefetch && targetString.startsWith('/')) {
      prefetchRoute(targetString);
    }
  };

  return (
    <Link
      to={target}
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
