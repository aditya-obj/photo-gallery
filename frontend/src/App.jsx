import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModernGallery from './components/ModernGallery';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<ModernGallery />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
