import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from "./i18n/language";

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}

export default App;