import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Shell from './components/Shell';
import TrunkList from './pages/TrunkList';
import CreateWizard from './pages/CreateWizard';
import { TrunkProvider } from './TrunkContext';

export default function App() {
  return (
    <TrunkProvider>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Navigate to="/trunks" replace />} />
            <Route path="/trunks" element={<TrunkList />} />
            <Route path="/trunks/new" element={<CreateWizard />} />
            <Route path="*" element={<Navigate to="/trunks" replace />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </TrunkProvider>
  );
}
