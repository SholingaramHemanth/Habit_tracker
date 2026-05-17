import { useState, useCallback } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { MagicCursor } from './components/ui/MagicCursor';
import { SplashScreen } from './components/ui/SplashScreen';

type Page = 'splash' | 'landing' | 'dashboard' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const isAuth = localStorage.getItem('aura_isAuthenticated');
    return 'splash'; // Always show splash first
  });

  const [targetPage] = useState<Page>(() => {
    const isAuth = localStorage.getItem('aura_isAuthenticated');
    return isAuth === 'true' ? 'dashboard' : 'landing';
  });

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSplashComplete = useCallback(() => {
    navigate(targetPage);
  }, [targetPage]);

  const handleLogin = () => {
    localStorage.setItem('aura_isAuthenticated', 'true');
    navigate('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_isAuthenticated');
    navigate('landing');
  };

  // Cinematic page transition variants
  const pageTransitions = {
    initial: { opacity: 0, scale: 0.95, y: 30, filter: 'blur(8px)' },
    animate: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.05, y: -20, filter: 'blur(4px)' },
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        {/* Global magic cursor — renders on every page */}
        <MagicCursor />
        <AnimatePresence mode="wait">
          {currentPage === 'splash' && (
            <SplashScreen key="splash" onComplete={handleSplashComplete} />
          )}

          {currentPage === 'landing' && (
            <motion.div key="landing" {...pageTransitions}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <LandingPage onLogin={handleLogin} />
            </motion.div>
          )}
          
          {currentPage === 'dashboard' && (
            <motion.div key="dashboard" {...pageTransitions}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <Dashboard 
                onLogout={handleLogout} 
                onNavigateSettings={() => navigate('settings')}
              />
            </motion.div>
          )}

          {currentPage === 'settings' && (
            <motion.div key="settings" {...pageTransitions}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex h-screen overflow-hidden">
                <span className="p-10">Settings Page Placeholder</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
