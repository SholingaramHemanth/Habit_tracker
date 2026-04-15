import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';

type Page = 'landing' | 'auth' | 'dashboard' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {currentPage === 'landing' && (
              <LandingPage onStart={() => navigate('auth')} />
            )}
            
            {currentPage === 'auth' && (
              <AuthPage onLogin={() => navigate('dashboard')} />
            )}
            
            {currentPage === 'dashboard' && (
              <Dashboard 
                onLogout={() => navigate('landing')} 
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
