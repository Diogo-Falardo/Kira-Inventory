import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import "./index.css";

// auth - context
import { AuthProvider, useAuth } from "./authContext";
export type RouterContext = {
  auth: {
    isAuthenticated: boolean;
    status: string;
  };
};

// query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// alert
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createRouter({ routeTree, context: {} as RouterContext });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === "checking") return <div className="p-6"></div>;
  return <>{children}</>;
}

// function to inject live auth values into the router
function AppRouter() {
  const { isAuthenticated, status } = useAuth();

  return (
    <AuthGate>
      <RouterProvider
        router={router}
        context={{ auth: { isAuthenticated, status } }}
      />
    </AuthGate>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
