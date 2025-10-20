import { useState } from "react";
// page
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// api
import { afterLoginStoreTokens, getApiErrorMessage } from "@/core/api";
import {
  useLoginUserAuthLoginPost,
  useRegisterUserAuthRegisterPost,
} from "@/generated/auth/auth";

// alert
import { toast } from "react-toastify";

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showPassword2Register, setShowPassword2Register] = useState(false);

  const { mutate: doLogin, isPending: isLoginPending } =
    useLoginUserAuthLoginPost();
  const { mutate: doRegister, isPending } = useRegisterUserAuthRegisterPost();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(
      { data: { email, password } },
      {
        onSuccess: (token) => {
          afterLoginStoreTokens(token);
          setEmail("");
          setPassword("");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err), { autoClose: false });
        },
      }
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password == password2) {
      doRegister(
        { data: { email, password, plan_code: "free", is_admin: false } },
        {
          onSuccess: () => {
            setPassword2("");
          },
          onError: (err) => {
            toast.error(getApiErrorMessage(err), { autoClose: false });
          },
        }
      );
    } else {
      toast.error("Passwords dont match");
    }
  };

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
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as "login" | "register")}
              className="w-full"
            >
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
                  onSubmit={handleLogin}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    className="w-full bg-slate-600 hover:bg-slate-700 cursor-pointer"
                    disabled={isLoginPending}
                  >
                    {isLoginPending ? "Signing in..." : "Sign in"}
                  </Button>

                  <div className="text-center text-sm text-slate-500">
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("register")}
                      className="text-slate-600 hover:underline cursor-pointer"
                    >
                      Create one
                    </button>
                  </div>
                </form>
              </TabsContent>

              {/* REGISTER */}
              <TabsContent value="register" className="mt-8">
                <form
                  onSubmit={handleRegister}
                  className="mx-auto max-w-md space-y-5"
                >
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Repeat password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-password"
                        type={showPassword2Register ? "text" : "password"}
                        placeholder="Repeat password"
                        className="pl-9 pr-10"
                        required
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword2Register((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                      >
                        {showPassword2Register ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Use at least 6 characters, including an uppercase letter,
                      a lowercase letter, a number, and a symbol.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-slate-600 hover:bg-slate-700 cursor-pointer"
                    disabled={isPending}
                  >
                    {isPending ? "Creating account..." : "Create account"}
                  </Button>

                  <div className="text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      className="text-slate-600 hover:underline cursor-pointer"
                    >
                      Sign in
                    </button>
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
