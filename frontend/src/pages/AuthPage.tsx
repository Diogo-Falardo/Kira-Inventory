import { useState } from "react";
// page
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { useAuth } from "@/core/authContext";

// router
import { Link, useNavigate } from "@tanstack/react-router";

// api
import { afterLoginStoreTokens, getApiErrorMessage } from "@/core/api";
import {
  useLoginUserAuthLoginPost,
  useRegisterUserAuthRegisterPost,
} from "@/generated/auth/auth";

// alert
import { toast } from "react-toastify";

// checkers
type LoginValues = {
  email: string;
  password: string;
};
type RegisterValues = {
  email: string;
  password: string;
  password2: string;
};
import { validate_email, validate_password } from "@/lib/inputCheckers";

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  // showers for passwords
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showPassword2Register, setShowPassword2Register] = useState(false);

  // api
  const { mutate: doLogin, isPending: isLoginPending } =
    useLoginUserAuthLoginPost();
  const { mutate: doRegister, isPending } = useRegisterUserAuthRegisterPost();

  // form
  const loginForm = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  // form register
  const registerForm = useForm<RegisterValues>({
    defaultValues: { email: "", password: "", password2: "" },
  });

  // call login api
  const handleLogin = (values: LoginValues) => {
    const { email, password } = values;

    if (!validate_email(email)) {
      loginForm.setError("email", { message: "Invalid email format" });
      return;
    }
    if (!validate_password(password)) {
      loginForm.setError("password", { message: "Invalid password" });
      return;
    }
    doLogin(
      { data: { email, password } },
      {
        onSuccess: async (token) => {
          afterLoginStoreTokens(token);
          await refreshUser();
          loginForm.reset();
          navigate({ to: "/userpanel" });
          toast.success("Welcome");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err), { autoClose: false });
        },
      }
    );
  };

  const handleRegister = (values: RegisterValues) => {
    const { email, password, password2 } = values;

    if (!validate_email(email)) {
      registerForm.setError("email", { message: "Invalid email format" });
      return;
    }
    if (!validate_password(password)) {
      registerForm.setError("password", { message: "Invalid password" });
      return;
    }

    if (!validate_password(password2)) {
      registerForm.setError("password", { message: "Invalid password" });
      return;
    }

    if (password == password2) {
      doRegister(
        { data: { email, password, plan_code: "free", is_admin: false } },
        {
          onSuccess: () => {
            registerForm.reset();
            toast.success("Account created!");
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
        <Link to="/" className="cursor-pointer">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">
              KIRA <span className="text-slate-300">Inventory</span>
            </h1>
            <p className="mt-2 text-slate-600">
              Sign in to manage your products and stock — or create a new
              account.
            </p>
          </div>
        </Link>

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
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                    className="space-y-6 max-w-md mx-auto"
                    noValidate
                  >
                    {/* Email with left icon */}
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password with left lock + right eye toggle */}
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                type={showPasswordLogin ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="pl-9 pr-10"
                                {...field}
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-slate-600 hover:bg-slate-700 cursor-pointer"
                      disabled={isLoginPending}
                    >
                      {isLoginPending ? "Signing in..." : "Sign in"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* REGISTER */}
              <TabsContent value="register" className="mt-8">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(handleRegister)}
                    className="space-y-6 max-w-md mx-auto"
                    noValidate
                  >
                    {/* Email */}
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                type={
                                  showPasswordRegister ? "text" : "password"
                                }
                                placeholder="Create a strong password"
                                className="pl-9 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                aria-label="Toggle password visibility"
                                onClick={() =>
                                  setShowPasswordRegister((v) => !v)
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                              >
                                {showPasswordRegister ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Repeat Password */}
                    <FormField
                      control={registerForm.control}
                      name="password2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Repeat password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                type={
                                  showPassword2Register ? "text" : "password"
                                }
                                placeholder="Repeat password"
                                className="pl-9 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                aria-label="Toggle password visibility"
                                onClick={() =>
                                  setShowPassword2Register((v) => !v)
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                              >
                                {showPassword2Register ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <p className="text-xs text-slate-500 mt-1">
                            Use at least 6 characters, including an uppercase
                            letter, a lowercase letter, a number, and a symbol.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                </Form>
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
