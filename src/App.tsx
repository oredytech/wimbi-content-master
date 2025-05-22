
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';
import RequireAuth from './components/auth/RequireAuth';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import WordPress from './pages/dashboard/WordPress';
import Social from './pages/dashboard/Social';
import Contents from './pages/dashboard/Contents';
import NewContent from './pages/dashboard/NewContent';
import Settings from './pages/dashboard/Settings';
import ApiKeysHelp from './pages/dashboard/ApiKeysHelp';
import ApiKeysConfig from './pages/dashboard/ApiKeysConfig';
import OAuthCallback from './pages/auth/OAuthCallback';

// Toaster
import { Toaster } from './components/ui/toaster';

import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Route principale avec layout public */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="home" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="features" element={<Features />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>

          {/* Routes pour les callbacks OAuth avec les nouveaux chemins */}
          <Route path="/auth/callback/:platform" element={<OAuthCallback />} />
          <Route path="/auth/:platform/callback" element={<OAuthCallback />} />
          
          {/* Dashboard protégé - la route est maintenant * pour matcher tous les sous-chemins */}
          <Route path="/dashboard/*" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="wordpress" element={<WordPress />} />
            <Route path="social" element={<Social />} />
            <Route path="contents" element={<Contents />} />
            <Route path="new-content" element={<NewContent />} />
            <Route path="settings" element={<Settings />} />
            <Route path="api-keys-help" element={<ApiKeysHelp />} />
            <Route path="api-keys-config" element={<ApiKeysConfig />} />
          </Route>

          {/* Route 404 - doit être en dernier */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
