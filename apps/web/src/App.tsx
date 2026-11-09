import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Root Layout
import RootLayout from './app/layout';
import { SmartLink } from './components/SmartLink';

// Section Layouts
const CustomerLayout = lazy(() => import('./app/customer/layout'));
const DriverLayout = lazy(() => import('./app/driver/layout'));
const WarehouseLayout = lazy(() => import('./app/warehouse/layout'));
const AdminLayout = lazy(() => import('./app/admin/layout'));

// Public pages
const HomePage = lazy(() => import('./app/page'));
const HowItWorksPage = lazy(() => import('./app/how-it-works/page'));
const PricingPage = lazy(() => import('./app/pricing/page'));
const WhatYouCanStorePage = lazy(() => import('./app/what-you-can-store/page'));
const CitiesPage = lazy(() => import('./app/cities/page'));
const SafetyPage = lazy(() => import('./app/safety/page'));
const ForBusinessPage = lazy(() => import('./app/for-business/page'));
const TermsPage = lazy(() => import('./app/terms/page'));
const PrivacyPage = lazy(() => import('./app/privacy/page'));
const RefundPolicyPage = lazy(() => import('./app/refund-policy/page'));
const StorageAgreementPage = lazy(() => import('./app/storage-agreement/page'));
const LoginPage = lazy(() => import('./app/auth/login/page'));

// Customer pages
const CustomerDashboardPage = lazy(() => import('./app/customer/page'));
const DigitalInventoryPage = lazy(() => import('./app/customer/inventory/page'));
const AddItemPage = lazy(() => import('./app/customer/items/new/page'));
const SchedulePickupCheckoutPage = lazy(() => import('./app/customer/pickup/new/page'));
const RequestReturnPage = lazy(() => import('./app/customer/returns/new/page'));
const TrackingPage = lazy(() => import('./app/customer/tracking/[id]/page'));
const BillingPage = lazy(() => import('./app/customer/billing/page'));
const ProfilePage = lazy(() => import('./app/customer/profile/page'));
const SupportPage = lazy(() => import('./app/customer/support/page'));

// Driver pages
const DriverDashboardPage = lazy(() => import('./app/driver/page'));
const DriverJobDetailPage = lazy(() => import('./app/driver/job/[id]/page'));

// Warehouse pages
const WarehouseIntakePage = lazy(() => import('./app/warehouse/page'));
const WarehouseInventoryMapPage = lazy(() => import('./app/warehouse/inventory/page'));
const OutboundPickListPage = lazy(() => import('./app/warehouse/outbound/page'));
const PrintableLabelsPage = lazy(() => import('./app/warehouse/labels/page'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./app/admin/page'));
const AdminOrdersPage = lazy(() => import('./app/admin/orders/page'));
const AdminCustomersPage = lazy(() => import('./app/admin/customers/page'));
const AdminDriversPage = lazy(() => import('./app/admin/drivers/page'));
const AdminWarehousesPage = lazy(() => import('./app/admin/warehouses/page'));
const AdminPricingRulesPage = lazy(() => import('./app/admin/pricing/page'));
const AdminPaymentsPage = lazy(() => import('./app/admin/payments/page'));
const AdminAuditLogsPage = lazy(() => import('./app/admin/audit-logs/page'));

function RouteLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] p-8" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-lootup-500 border-t-transparent animate-spin" aria-hidden="true" />
        <span className="text-xs text-slate-500 font-medium">Loading vault view...</span>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="w-16 h-16 rounded-2xl bg-lootup-50 border border-lootup-200 text-lootup-600 flex items-center justify-center mb-4 text-2xl font-bold font-mono" aria-hidden="true">
        404
      </div>
      <h1 id="main-content" tabIndex={-1} className="text-2xl font-bold text-slate-900 mb-2">
        Compartment Not Found
      </h1>
      <p className="text-slate-600 max-w-md mb-6 text-sm text-pretty">
        The vault compartment or route you requested could not be located.
      </p>
      <div className="flex gap-3">
        <SmartLink href="/" className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
          Return Home
        </SmartLink>
        <SmartLink href="/customer" className="px-4 py-2 rounded-lg bg-lootup-600 text-white text-sm font-medium hover:bg-lootup-500 transition-colors">
          Open Customer Portal
        </SmartLink>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<RootLayout />}>
            {/* Public Landing Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/what-you-can-store" element={<WhatYouCanStorePage />} />
            <Route path="/cities" element={<CitiesPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/for-business" element={<ForBusinessPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/storage-agreement" element={<StorageAgreementPage />} />

            {/* Auth */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />

            {/* Customer Portal */}
            <Route element={<CustomerLayout />}>
              <Route path="/customer" element={<CustomerDashboardPage />} />
              <Route path="/customer/inventory" element={<DigitalInventoryPage />} />
              <Route path="/customer/items/new" element={<AddItemPage />} />
              <Route path="/customer/pickup/new" element={<SchedulePickupCheckoutPage />} />
              <Route path="/customer/returns/new" element={<RequestReturnPage />} />
              <Route path="/customer/tracking/:id" element={<TrackingPage />} />
              <Route path="/customer/billing" element={<BillingPage />} />
              <Route path="/customer/profile" element={<ProfilePage />} />
              <Route path="/customer/support" element={<SupportPage />} />
            </Route>

            {/* Driver Portal */}
            <Route element={<DriverLayout />}>
              <Route path="/driver" element={<DriverDashboardPage />} />
              <Route path="/driver/job/:id" element={<DriverJobDetailPage />} />
            </Route>

            {/* Warehouse Terminal */}
            <Route element={<WarehouseLayout />}>
              <Route path="/warehouse" element={<WarehouseIntakePage />} />
              <Route path="/warehouse/inventory" element={<WarehouseInventoryMapPage />} />
              <Route path="/warehouse/outbound" element={<OutboundPickListPage />} />
              <Route path="/warehouse/labels" element={<PrintableLabelsPage />} />
            </Route>

            {/* Admin Operations Console */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/customers" element={<AdminCustomersPage />} />
              <Route path="/admin/drivers" element={<AdminDriversPage />} />
              <Route path="/admin/warehouses" element={<AdminWarehousesPage />} />
              <Route path="/admin/pricing" element={<AdminPricingRulesPage />} />
              <Route path="/admin/payments" element={<AdminPaymentsPage />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
