import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from "./i18n/language";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;