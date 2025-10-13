import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="flex flex-col items-center text-center p-8">
            <AlertTriangle className="h-12 w-12 text-slate-600 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
            <p className="text-slate-600 mb-6 text-sm">
              We couldn’t load this page or an unexpected error occurred. Please
              try again or go back to the homepage.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-slate-400 text-slate-700 hover:bg-slate-100 cursor-pointer"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
              <Button
                className="bg-slate-700 hover:bg-slate-800 text-white cursor-pointer"
                onClick={() => (window.location.href = "/")}
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Kira Inventory
        </p>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
