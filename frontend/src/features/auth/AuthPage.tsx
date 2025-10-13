import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const AuthPage: React.FC = () => {
  const [showPasswordLogin, setShowPasswordLogin] = React.useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            KIRA <span className="text-slate-300">Inventory</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Sign in to manage your products and stock — or create a new account.
          </p>
        </div>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-6 sm:p-10">
            <Tabs defaultValue="login" className="w-full">
              <div className="flex justify-center">
                <TabsList className="bg-slate-100">
                  <TabsTrigger className="cursor-pointer" value="login">
                    Login
                  </TabsTrigger>
                  <TabsTrigger className="cursor-pointer" value="register">
                    Register
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* LOGIN */}
              <TabsContent value="login" className="mt-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // handle login submit
                  }}
                  className="mx-auto max-w-md space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="login-password"
                        type={showPasswordLogin ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-9 pr-10"
                        required
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPasswordLogin((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                      >
                        {showPasswordLogin ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      <a href="#" className="hover:underline">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-slate-600 hover:bg-slate-700"
                  >
                    Sign in
                  </Button>

                  <div className="text-center text-sm text-slate-500">
                    Don’t have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.querySelector(
                          '[data-state="inactive"][data-value="register"]'
                        ) as HTMLElement | null;
                        // Prefer programmatic change if you wire Tabs via state later
                        el?.click();
                      }}
                      className="text-slate-600 hover:underline"
                    >
                      Create one
                    </a>
                  </div>
                </form>
              </TabsContent>

              {/* REGISTER */}
              <TabsContent value="register" className="mt-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // handle register submit
                  }}
                  className="mx-auto max-w-md space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-name"
                        type="text"
                        placeholder="Your name"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-password"
                        type={showPasswordRegister ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-9 pr-10"
                        required
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPasswordRegister((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                      >
                        {showPasswordRegister ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Use at least 8 characters, including a number.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-slate-600 hover:bg-slate-700"
                  >
                    Create account
                  </Button>

                  <div className="text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.querySelector(
                          '[data-state="inactive"][data-value="login"]'
                        ) as HTMLElement | null;
                        el?.click();
                      }}
                      className="text-slate-600 hover:underline"
                    >
                      Sign in
                    </a>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer tiny */}
        <div className="text-center text-slate-500 text-xs mt-6">
          © {new Date().getFullYear()} Kira Inventory
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
