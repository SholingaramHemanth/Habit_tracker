import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { MagicCursor } from './components/ui/MagicCursor';

type Page = 'landing' | 'dashboard' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const isAuth = localStorage.getItem('aura_isAuthenticated');
    return isAuth === 'true' ? 'dashboard' : 'landing';
  });

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    localStorage.setItem('aura_isAuthenticated', 'true');
    navigate('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_isAuthenticated');
    navigate('landing');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        {/* Global magic cursor — renders on every page */}
        <MagicCursor />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentPage === 'landing' && (
              <LandingPage onLogin={handleLogin} />
            )}
            
            {currentPage === 'dashboard' && (
              <Dashboard 
                onLogout={handleLogout} 
                onNavigateSettings={() => navigate('settings')}
              />
            )}

            {currentPage === 'settings' && (
              <div className="flex h-screen overflow-hidden">
                {/* We'll implement a proper Settings page that might reuse the Sidebar */}
                <span className="p-10">Settings Page Placeholder</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
