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
import VerificationPage from "./Pages/AuthorizedPages/VerificationPage.tsx";
import CheckEmailPage from "./Pages/PasswordReset.tsx";
import AboutUs from "./Components/LandingPage/pages/AboutUS.tsx";
import Pricing from "./Components/LandingPage/pages/Pricing.tsx";
import ContactUs from "./Components/LandingPage/pages/ContactUs.tsx";

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
          path: "/contact",
          element: <ContactUs />,
        },
        {
          path: "/about-us",
          element: <AboutUs />,
        },
        {
          path: "/pricing",
          element: <Pricing />,
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
          element: !isAuthenticated ? <SignUp /> : <Navigate to="/verify" />,
        },
        {
          path: "/verify",
          element:
            !isAuthenticated || isVerified ? (
              <Navigate to="/login" />
            ) : (
              <VerificationPage />
            ),
        },
        {
          path: "/user",
          element:
            isAuthenticated && userRole === "user" ? (
              isVerified ? (
                <UserPages />
              ) : (
                <Navigate to="/verify" />
              )
            ) : (
              <Navigate to={isAuthenticated ? "/admin" : "/login"} />
            ),
        },
        {
          path: "/admin",
          element:
            isAuthenticated && userRole === "admin" ? (
              isVerified ? (
                <AdminPages />
              ) : (
                <Navigate to="/verify" />
              )
            ) : (
              <Navigate to="/login" />
            ),
        },

        {
          path: "/upload",
          element:
            isAuthenticated && isVerified ? (
              <UploadPage />
            ) : (
              <Navigate to="/verify" />
            ),
        },
        {
          path: "/document",
          element:
            isAuthenticated && isVerified ? (
              <DocumentPage />
            ) : (
              <Navigate to="/verify" />
            ),
        },
        {
          path: "/totaldocuments",
          element:
            isAuthenticated && isVerified ? (
              <TotalDocuments />
            ) : (
              <Navigate to="/verify" />
            ),
        },
        {
          path: "/manageusers",
          element:
            isAuthenticated && isVerified && userRole === "admin" ? (
              <ManageUsers />
            ) : (
              <Navigate to="/verify" />
            ),
        },
        {
          path: "/userdetails/:id",
          element:
            isAuthenticated && isVerified && userRole === "admin" ? (
              <UserDetails />
            ) : (
              <Navigate to="/verify" />
            ),
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
