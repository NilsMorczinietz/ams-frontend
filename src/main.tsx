import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@features/auth/hooks/auth-provider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@shared/components/ui/sonner';
import './index.css';
import App from './App.tsx';
import HomePage from './pages/home.tsx';
import LocationsPage from './pages/locations.tsx';
import CoursesPage from './pages/courses.tsx';
import RanksPage from './pages/ranks.tsx';
import PromotionRequirementPage from './pages/promotion-requirements.tsx';

const queryClient = new QueryClient();
const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
const keycloakRealm = import.meta.env.VITE_KEYCLOAK_REALM;

function redirectMisroutedKeycloakCallback(): boolean {
  const brokerPathPrefix = `/realms/${keycloakRealm}/broker/`;
  if (!window.location.pathname.startsWith(brokerPathPrefix)) {
    return false;
  }

  const keycloakOrigin = new URL(keycloakUrl).origin;
  if (window.location.origin === keycloakOrigin) {
    return false;
  }

  const targetUrl = `${keycloakOrigin}${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.replace(targetUrl);
  return true;
}

const isRedirectingToKeycloak = redirectMisroutedKeycloakCallback();

if (!isRedirectingToKeycloak) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<HomePage />} />
                <Route path="standorte" element={<LocationsPage />} />
                <Route path="lehrgänge" element={<CoursesPage />} />
                <Route path="dienstgrade" element={<RanksPage />} />
                <Route
                  path="beförderungsregeln"
                  element={<PromotionRequirementPage />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        <Toaster />
      </QueryClientProvider>
    </StrictMode>
  );
}
