import { useLocation, useNavigate, useParams as useRouteParams, useSearchParams as useRouteSearchParams } from 'react-router-dom';

export interface AppRouterInstance {
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  prefetch: (href: string) => void;
}

const prefetchedRoutes = new Set<string>();

const ROUTE_PREFETCHERS: Array<{ test: (path: string) => boolean; load: () => Promise<unknown> }> = [
  { test: (p) => p === '/', load: () => import('../app/page') },
  { test: (p) => p === '/how-it-works', load: () => import('../app/how-it-works/page') },
  { test: (p) => p === '/pricing', load: () => import('../app/pricing/page') },
  { test: (p) => p === '/what-you-can-store', load: () => import('../app/what-you-can-store/page') },
  { test: (p) => p === '/cities', load: () => import('../app/cities/page') },
  { test: (p) => p === '/safety', load: () => import('../app/safety/page') },
  { test: (p) => p === '/for-business', load: () => import('../app/for-business/page') },
  { test: (p) => p === '/terms', load: () => import('../app/terms/page') },
  { test: (p) => p === '/privacy', load: () => import('../app/privacy/page') },
  { test: (p) => p === '/refund-policy', load: () => import('../app/refund-policy/page') },
  { test: (p) => p === '/storage-agreement', load: () => import('../app/storage-agreement/page') },
  { test: (p) => p === '/auth/login' || p === '/login', load: () => import('../app/auth/login/page') },
  { test: (p) => p === '/customer', load: () => Promise.all([import('../app/customer/layout'), import('../app/customer/page')]) },
  { test: (p) => p === '/customer/inventory', load: () => Promise.all([import('../app/customer/layout'), import('../app/customer/inventory/page')]) },
  { test: (p) => p === '/customer/items/new', load: () => Promise.all([import('../app/customer/layout'), import('../app/customer/items/new/page')]) },
  { test: (p) => p === '/customer/pickup/new', load: () => Promise.all([import('../app/customer/layout'), import('../app/customer/pickup/new/page')]) },
  { test: (p) => p === '/customer/returns/new', load: () => Promise.all([import('../app/customer/layout'), import('../app/customer/returns/new/page')]) },
  { test: (p) => p.startsWith('/customer/tracking/'), load: () => Promise.all([import('../app/customer/layout'), import('../app/customer/tracking/[id]/page')]) },
  { test: (p) => p === '/customer/billing', load: () => Promise.all([import('../app/customer/layout'), import('../app/customer/billing/page')]) },
  { test: (p) => p === '/customer/profile', load: () => Promise.all([import('../app/customer/layout'), import('../app/customer/profile/page')]) },
  { test: (p) => p === '/customer/support', load: () => Promise.all([import('../app/customer/layout'), import('../app/customer/support/page')]) },
  { test: (p) => p === '/driver', load: () => Promise.all([import('../app/driver/layout'), import('../app/driver/page')]) },
  { test: (p) => p.startsWith('/driver/job/'), load: () => Promise.all([import('../app/driver/layout'), import('../app/driver/job/[id]/page')]) },
  { test: (p) => p === '/warehouse', load: () => Promise.all([import('../app/warehouse/layout'), import('../app/warehouse/page')]) },
  { test: (p) => p === '/warehouse/inventory', load: () => Promise.all([import('../app/warehouse/layout'), import('../app/warehouse/inventory/page')]) },
  { test: (p) => p === '/warehouse/outbound', load: () => Promise.all([import('../app/warehouse/layout'), import('../app/warehouse/outbound/page')]) },
  { test: (p) => p === '/warehouse/labels', load: () => Promise.all([import('../app/warehouse/layout'), import('../app/warehouse/labels/page')]) },
  { test: (p) => p === '/admin', load: () => Promise.all([import('../app/admin/layout'), import('../app/admin/page')]) },
  { test: (p) => p === '/admin/orders', load: () => Promise.all([import('../app/admin/layout'), import('../app/admin/orders/page')]) },
  { test: (p) => p === '/admin/customers', load: () => Promise.all([import('../app/admin/layout'), import('../app/admin/customers/page')]) },
  { test: (p) => p === '/admin/drivers', load: () => Promise.all([import('../app/admin/layout'), import('../app/admin/drivers/page')]) },
  { test: (p) => p === '/admin/warehouses', load: () => Promise.all([import('../app/admin/layout'), import('../app/admin/warehouses/page')]) },
  { test: (p) => p === '/admin/pricing', load: () => Promise.all([import('../app/admin/layout'), import('../app/admin/pricing/page')]) },
  { test: (p) => p === '/admin/payments', load: () => Promise.all([import('../app/admin/layout'), import('../app/admin/payments/page')]) },
  { test: (p) => p === '/admin/audit-logs', load: () => Promise.all([import('../app/admin/layout'), import('../app/admin/audit-logs/page')]) }
];

/**
 * Prefetches lazy route JavaScript chunks ahead of user click navigation.
 */
export function prefetchRoute(href: string): void {
  if (!href || !href.startsWith('/')) return;
  const pathname = href.split(/[?#]/)[0] || '/';
  if (prefetchedRoutes.has(pathname)) return;
  const match = ROUTE_PREFETCHERS.find((entry) => entry.test(pathname));
  if (match) {
    prefetchedRoutes.add(pathname);
    void match.load().catch(() => {
      prefetchedRoutes.delete(pathname);
    });
  }
}

const ROUTE_TITLES: Array<{ test: (p: string) => boolean; title: string }> = [
  { test: (p) => p === '/', title: 'Doorstep Personal Storage for Indian Metros | Lootupspace' },
  { test: (p) => p === '/how-it-works', title: 'How Doorstep Storage Works | Lootupspace' },
  { test: (p) => p === '/pricing', title: 'Pricing Calculator & Size Tiers | Lootupspace' },
  { test: (p) => p === '/what-you-can-store', title: 'What You Can Store & Restricted Items | Lootupspace' },
  { test: (p) => p === '/cities', title: 'Serviceable Cities & Pincodes | Lootupspace' },
  { test: (p) => p === '/safety', title: 'Safety, Vault Security & Insurance | Lootupspace' },
  { test: (p) => p === '/for-business', title: 'Business & Startup Inventory Storage | Lootupspace' },
  { test: (p) => p === '/terms', title: 'Terms of Service | Lootupspace' },
  { test: (p) => p === '/privacy', title: 'Privacy Policy (DPDP Act) | Lootupspace' },
  { test: (p) => p === '/refund-policy', title: 'Refund & Early Exit Policy | Lootupspace' },
  { test: (p) => p === '/storage-agreement', title: 'Storage Services Agreement | Lootupspace' },
  { test: (p) => p === '/auth/login' || p === '/login', title: 'Sign In | Lootupspace' },
  { test: (p) => p === '/customer', title: 'My Storage Vault | Lootupspace' },
  { test: (p) => p === '/customer/inventory', title: 'Digital Inventory | Lootupspace' },
  { test: (p) => p === '/customer/items/new', title: 'Add Items for Pickup | Lootupspace' },
  { test: (p) => p === '/customer/pickup/new', title: 'Schedule Doorstep Pickup | Lootupspace' },
  { test: (p) => p === '/customer/returns/new', title: 'Request Return Delivery | Lootupspace' },
  { test: (p) => p.startsWith('/customer/tracking/'), title: 'Live Order Tracking | Lootupspace' },
  { test: (p) => p === '/customer/billing', title: 'Billing & Tax Invoices | Lootupspace' },
  { test: (p) => p === '/customer/profile', title: 'Profile & Saved Addresses | Lootupspace' },
  { test: (p) => p === '/customer/support', title: 'Support & Grievance Desk | Lootupspace' },
  { test: (p) => p === '/driver', title: 'Driver Field Queue | Lootupspace' },
  { test: (p) => p.startsWith('/driver/job/'), title: 'Field Job Verification | Lootupspace' },
  { test: (p) => p === '/warehouse', title: 'Warehouse Intake Dock | Lootupspace' },
  { test: (p) => p === '/warehouse/inventory', title: 'Warehouse Zone & Bin Map | Lootupspace' },
  { test: (p) => p === '/warehouse/outbound', title: 'Outbound Return Pick List | Lootupspace' },
  { test: (p) => p === '/warehouse/labels', title: 'Printable Barcode Labels | Lootupspace' },
  { test: (p) => p === '/admin', title: 'Admin Operations Console | Lootupspace' },
  { test: (p) => p === '/admin/orders', title: 'Order Dispatch & Fleet Control | Lootupspace' },
  { test: (p) => p === '/admin/customers', title: 'Customers & KYC Registry | Lootupspace' },
  { test: (p) => p === '/admin/drivers', title: 'Driver Partner Fleet | Lootupspace' },
  { test: (p) => p === '/admin/warehouses', title: 'Warehouse Hubs & Capacity | Lootupspace' },
  { test: (p) => p === '/admin/pricing', title: 'Pricing Engine Configuration | Lootupspace' },
  { test: (p) => p === '/admin/payments', title: 'GST Billing & Ledger | Lootupspace' },
  { test: (p) => p === '/admin/audit-logs', title: 'System Audit Logs | Lootupspace' }
];

export function getRouteTitle(pathname: string): string {
  const match = ROUTE_TITLES.find((r) => r.test(pathname));
  return match ? match.title : 'Page Not Found | Lootupspace';
}

/**
 * SPA navigation router hook powered by react-router-dom
 */
export function useRouter(): AppRouterInstance {
  const navigate = useNavigate();

  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    prefetch: (href: string) => prefetchRoute(href)
  };
}

/**
 * Returns the current URL pathname (e.g. "/customer/inventory")
 */
export function usePathname(): string {
  const location = useLocation();
  return location.pathname;
}

/**
 * Returns dynamic route parameters (e.g. { id: "p1" })
 */
export function useParams<T extends Record<string, string | undefined> = Record<string, string>>(): T {
  return useRouteParams() as T;
}

/**
 * Returns the URL search parameters (e.g. searchParams.get('type'))
 */
export function useSearchParams(): URLSearchParams {
  const [searchParams] = useRouteSearchParams();
  return searchParams;
}

export { Link, NavLink, Outlet, Navigate } from 'react-router-dom';
