import { createBrowserRouter } from "react-router-dom";
import App from "@/src/App";
import Home from "@/src/Home";
import { lazy } from "react";
import { AuthView } from "@/src/components/AuthView";
import {Privacy} from "@/src/components/Privacy"
import { CartSheet } from "@/src/components/CartSheet";
import { AdminPanel } from "@/src/components/AdminPanel";
import NotFoundView from "@/src/components/ErrorMode";

const ProductDetailView = lazy(()=> import("@/src/components/ProductDetailView"));
const CategoryDetailView = lazy(()=> import("@/src/components/CategoryDetailView"));
const OrdersView = lazy(()=> import("@/src/components/OrdersView"));
const CheckoutView = lazy(()=> import("@/src/components/CheckoutView"));
const WalletView = lazy(()=> import("@/src/components/WalletView"));
const ProfileView = lazy(()=> import("@/src/components/ProfileView"));
const Ticket = lazy(()=> import("@/src/components/Ticket"));

const Login = lazy(() => import("@/src/components/Auth/Login"));
const Register = lazy(() => import("@/src/components/Auth/Register"));
const ForgotPass = lazy(() => import("@/src/components/Auth/ForgotPass"));
const ResetPass = lazy(() => import("@/src/components/Auth/ResetPass"));
const ResetSuccess = lazy(() => import("@/src/components/Auth/ResetSuccess"));
const Twofa = lazy(() => import("@/src/components/Auth/Twofa"));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/category/:catname",
        element: <CategoryDetailView />,
      },
      {
        path: "/item/:id",
        element: <ProductDetailView />,
      },
      {
        path: "/orders",
        element: <OrdersView />,
      },
      {
        path: "/cart",
        element: <CheckoutView />,
      },
      {
        path: "/wallet",
        element: <WalletView />,
      },
      {
        path: "/profile",
        element: <ProfileView />,
      },
      {
        path: "/admin",
        element: <AdminPanel />,
      },
      {
        path: "/legal/:type",
        element: <Privacy />,
      },
      {
        path: "/support",
        element: <Ticket />,
      },
      
      
    ],
  },
  {
        path: "/auth",
        element: <AuthView />,
        children : [
          {
        path: "login",
        element: <Login />,
      },
          {
        path: "register",
        element: <Register />,
      },
          {
        path: "forgotpass",
        element: <ForgotPass />,
      },
          {
        path: "resetpass",
        element: <ResetPass />,
      },
          {
        path: "resetsucess",
        element: <ResetSuccess />,
      },
          {
        path: "2fa",
        element: <Twofa />,
      },
      ]},
      {
        path: "*",
        element: <NotFoundView />,
      },
]);

export default appRouter;
