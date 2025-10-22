import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Boxes, Package, BarChart3 } from "lucide-react";

// react-router
import { useNavigate } from "@tanstack/react-router";

// auth -> context
import { useAuth } from "@/core/authContext";

const LandingPage = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate({ to: "/userpanel" });
    } else {
      navigate({ to: "/auth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900">
      {/* Hero Section */}
      <header className="w-full py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold tracking-tight"
        >
          KIRA <span className="text-slate-300">Inventory</span>
        </motion.h1>

        <p className="mt-4 text-slate-600 max-w-lg mx-auto">
          A simple and intuitive inventory management app for small sellers and
          creators. Track products, manage stock, and view insights — all in one
          place.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          {/* REDIRECT BUTTON */}
          <Button
            onClick={handleClick}
            size="lg"
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold cursor-pointer"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-10 text-slate-900">
            Everything you need to stay organized
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-slate-50 border border-slate-200 hover:shadow-md transition">
              <CardContent className="flex flex-col items-center p-6">
                <Package className="h-10 w-10 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Product Management
                </h3>
                <p className="text-slate-600 text-sm text-center mt-2">
                  Create and organize products with images, tags, and price
                  tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border border-slate-200 hover:shadow-md transition">
              <CardContent className="flex flex-col items-center p-6">
                <Boxes className="h-10 w-10 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Stock Control
                </h3>
                <p className="text-slate-600 text-sm text-center mt-2">
                  Easily manage stock in and out movements with clear
                  visibility.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border border-slate-200 hover:shadow-md transition">
              <CardContent className="flex flex-col items-center p-6">
                <BarChart3 className="h-10 w-10 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Dashboard Insights
                </h3>
                <p className="text-slate-600 text-sm text-center mt-2">
                  Track performance, stock levels, and key metrics in real time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 bg-slate-100">
        <div className="text-center text-slate-600 text-sm">
          © {new Date().getFullYear()} Kira Inventory — Built by{" "}
          <a
            href="https://www.linkedin.com/in/diogo-falardo-74b7ab2a8/"
            className="text-slate-600 font-medium hover:underline"
          >
            Diogo Falardo
          </a>
          {" • "}
          <a
            href="https://github.com/Diogo-Falardo/kira-inventory"
            className="text-slate-500 hover:underline"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
