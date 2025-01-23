import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider, useAuth } from "./Context/useContext.tsx";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
// Importing Pages
import Login from "./Pages/Login.tsx";
import SignUp from "./Pages/SignUp.tsx";
import UserPages from "./Pages/AuthorizedPages/UserPage.tsx";
import AdminPages from "./Pages/AuthorizedPages/AdminPages.tsx";
import LandingPage from "./Pages/LandingPage.tsx";
import ForgottenPwd from "./Pages/ForgottenPwd.tsx";
import UploadPage from "./Pages/AuthorizedPages/UploadPage.tsx";
import DocumentPage from "./Pages/AuthorizedPages/DocumentPage.tsx";
import TotalDocuments from "./Pages/AuthorizedPages/TotalDocuments.tsx";
import ManageUsers from "./Pages/AuthorizedPages/ManageUserss.tsx";
import UserDetails from "./Pages/AuthorizedPages/UserDetails.tsx";
//import VerificationPage from "./Pages/AuthorizedPages/VerificationPage.tsx";
import CheckEmailPage from "./Pages/PasswordReset.tsx";

function AppRouter() {
  const { isAuthenticated, userRole, isVerified } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
      
        {
          path: "/forgot",
          element: <ForgottenPwd />,
        },
        {
          path: "/check-email",
          element: <CheckEmailPage />,
        },
        {
          path: "/login",
          element: !isAuthenticated ? (
            <Login />
          ) : isVerified ? (
            userRole === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user" />
            )
          ) : (
            <Navigate to="/verify" />
          ),
        },
        {
          path: "/register",
          element: <SignUp />,
        },
        {
          path: "/verify",
          element:<Navigate to="/login" />   
        },
        {
          path: "/user",
          element: <UserPages />
        },
        {
          path: "/admin",
          element: <AdminPages /> 
        },

        {
          path: "/upload",
          element: <UploadPage />
        },
        {
          path: "/document",
          element:<DocumentPage />
         
        },
        {
          path: "/totaldocuments",
          element: <TotalDocuments />
        },
        {
          path: "/manageusers",
          element: <ManageUsers />
        },
        {
          path: "/userdetails/:id",
          element:
              <UserDetails />
        },

      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>
);
