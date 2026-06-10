import {StrictMode , Suspense} from 'react';

import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import { RouterProvider } from "react-router-dom";
import './index.css';
import appRouter from '@/Utility/Routes.jsx';
import ThemeContext from '@/Utility/ThemeContext.jsx';
import AuthContext from '@/Utility/AuthContext.jsx';
import { NotificationProvider } from './lib/useNotification.js';
import Loader from './components/Loader.jsx';


createRoot(document.getElementById('root')!).render(

  // <StrictMode>
     <ThemeContext>
      <NotificationProvider>
      <AuthContext>
        <Suspense fallback={<Loader/>}>
    <RouterProvider router={appRouter}/>
        </Suspense>
</AuthContext>
</NotificationProvider>
      </ThemeContext>
  // </StrictMode>,
);
