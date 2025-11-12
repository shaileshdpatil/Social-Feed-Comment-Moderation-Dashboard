import { Navigate, Outlet, type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Layout } from "../components/Layout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { PostProvider } from "../contexts/PostContext";

const LoginPage = lazy(() => import("../pages/LoginPage").then(m => ({ default: m.LoginPage })));
const PostsPage = lazy(() => import("../pages/PostsPage").then(m => ({ default: m.PostsPage })));

export const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    {children}
  </Suspense>
);

export const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />
  }
];

export const protectedRoutes: RouteObject[] = [
  {
    path: "",
    element: (
      <ProtectedRoute>
        <Layout>
          <Outlet />
        </Layout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "/dashboard",
        element: (
          <PostProvider>
            <PostsPage />
          </PostProvider>
        )
      }
    ]
  }
];

export const notFoundRoute: RouteObject = {
  path: "*",
  element: <Navigate to="/" />
}