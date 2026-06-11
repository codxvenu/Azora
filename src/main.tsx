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
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')!).render(

  // <StrictMode>
     <GoogleOAuthProvider clientId={"543341573542-o2j3ekg3enaq6l04n6eutgf5s43s7nld.apps.googleusercontent.com"}>
     <ThemeContext>
      <NotificationProvider>
      <AuthContext>
        <Suspense fallback={<Loader/>}>
    <RouterProvider router={appRouter}/>
        </Suspense>
</AuthContext>
</NotificationProvider>
      </ThemeContext>
      </GoogleOAuthProvider>
  // </StrictMode>,
);
