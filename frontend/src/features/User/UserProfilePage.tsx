import { useState } from "react";
// page
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Mail, Lock, Clock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

// toast helper
import { toast } from "react-toastify";
import { getApiErrorMessage } from "@/core/api";

// orval-generated hooks
import {
  useUpdateUserProfileUserUpdateUserPatch,
  useChangeUserEmailUserChangeEmailPut,
  useChangeUserPasswordUserChangePasswordPut,
  useLastLoginUserMyLastLoginGet,
} from "@/generated/user/user";
import type { AdvancedUsersProfileUpdate } from "@/generated/orval.schemas";

export default function UserProfilePage() {
  const {
    data: lastLoginResp,
    isLoading: loadingLast,
    refetch: refetchLast,
  } = useLastLoginUserMyLastLoginGet();

  const lastLoginStr =
    typeof lastLoginResp === "string"
      ? lastLoginResp
      : ((lastLoginResp as any)?.detail ?? undefined);

  type ProfileValues = {
    username: string;
    avatar_url: string;
    phone_number: string;
    country: string;
    address: string;
  };

  const profileForm = useForm<ProfileValues>({
    defaultValues: {
      username: "",
      avatar_url: "",
      phone_number: "",
      country: "",
      address: "",
    },
  });

  const updateProfile = useUpdateUserProfileUserUpdateUserPatch();

  function handleProfileSubmit(values: ProfileValues) {
    const body: AdvancedUsersProfileUpdate = {
      user_id: 0, // Orval requires it
    };

    if (values.username.trim() !== "") {
      body.username = values.username.trim();
    }
    if (values.avatar_url.trim() !== "") {
      body.avatar_url = values.avatar_url.trim();
    }
    if (values.phone_number.trim() !== "") {
      body.phone_number = values.phone_number.trim();
    }
    if (values.country.trim() !== "") {
      body.country = values.country.trim();
    }
    if (values.address.trim() !== "") {
      body.address = values.address.trim();
    }

    // guard: don't send an empty PATCH (besides user_id)
    if (
      body.username === undefined &&
      body.avatar_url === undefined &&
      body.phone_number === undefined &&
      body.country === undefined &&
      body.address === undefined
    ) {
      toast.error("Please change at least one field.");
      return;
    }

    updateProfile.mutate(
      { data: body },
      {
        onSuccess: () => {
          toast.success("Profile updated!");
        },
        onError: (err: any) => {
          console.error(err);
          toast.error("Could not update profile.", { autoClose: false });
        },
      }
    );
  }

  type EmailValues = {
    new_email: string;
  };

  const emailForm = useForm<EmailValues>({
    defaultValues: {
      new_email: "",
    },
  });

  const changeEmail = useChangeUserEmailUserChangeEmailPut();

  function handleEmailSubmit(values: { new_email: string }) {
    const email = values.new_email.trim();
    if (!email) {
      toast.error("Please enter an email.");
      return;
    }

    changeEmail.mutate(
      {
        params: {
          payload: email,
        },
      },
      {
        onSuccess: () => {
          toast.success("Email change requested.");
        },
        onError: (err: any) => {
          console.error(err);
          toast.error("Could not change email.", { autoClose: false });
        },
      }
    );
  }

  type PasswordValues = {
    password: string;
    new_password: string;
  };

  const passwordForm = useForm<PasswordValues>({
    defaultValues: {
      password: "",
      new_password: "",
    },
  });

  const changePassword = useChangeUserPasswordUserChangePasswordPut();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  function handlePasswordSubmit(values: PasswordValues) {
    changePassword.mutate(
      {
        data: {
          password: values.password,
          new_password: values.new_password,
        },
      } as any,
      {
        onSuccess: () => {
          toast.success("Password updated.");
          passwordForm.reset();
        },
        onError: (err: any) => {
          console.error(err);
          const msg = getApiErrorMessage
            ? getApiErrorMessage(err)
            : "Could not update password.";
          toast.error(msg, { autoClose: false });
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Last Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Last Login
                  </h2>
                </div>
                <Button
                  variant="outline"
                  className="border-slate-200"
                  onClick={() => {
                    refetchLast();
                  }}
                >
                  Refresh
                </Button>
              </div>

              <p className="mt-3 text-slate-700 text-sm">
                {loadingLast
                  ? "Loading..."
                  : lastLoginStr
                    ? new Date(lastLoginStr).toLocaleString()
                    : "Unknown"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forms Grid */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* UPDATE PROFILE */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Update Profile
                  </h2>
                </div>

                <Form {...profileForm}>
                  <form
                    className="grid gap-4"
                    onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                    noValidate
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="your username"
                                className="h-10 rounded-xl border border-slate-200 bg-white text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="avatar_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avatar URL</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://…"
                                className="h-10 rounded-xl border border-slate-200 bg-white text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="+123456789"
                                className="h-10 rounded-xl border border-slate-200 bg-white text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Portugal"
                                className="h-10 rounded-xl border border-slate-200 bg-white text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Street, city, zip"
                                className="h-10 rounded-xl border border-slate-200 bg-white text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        size="lg"
                        className="bg-slate-600 hover:bg-slate-700"
                        type="submit"
                        disabled={(updateProfile as any)?.isPending}
                      >
                        {(updateProfile as any)?.isPending
                          ? "Saving…"
                          : "Save changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* CHANGE EMAIL */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Change Email
                  </h2>
                </div>

                <Form {...emailForm}>
                  <form
                    className="grid gap-4"
                    onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                    noValidate
                  >
                    <FormField
                      control={emailForm.control}
                      name="new_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="you@example.com"
                              className="h-10 rounded-xl border border-slate-200 bg-white text-sm"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <Button
                        className="bg-slate-600 hover:bg-slate-700"
                        type="submit"
                        disabled={(changeEmail as any)?.isPending}
                      >
                        {(changeEmail as any)?.isPending
                          ? "Submitting…"
                          : "Update email"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* CHANGE PASSWORD */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Change Password
                  </h2>
                </div>

                <Form {...passwordForm}>
                  <form
                    className="grid gap-4"
                    onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                    noValidate
                  >
                    {/* password (current) */}
                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showCurrent ? "text" : "password"}
                                className="h-10 rounded-xl border border-slate-200 bg-white text-sm pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrent((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                                aria-label="Toggle current password visibility"
                              >
                                {showCurrent ? (
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

                    {/* new_password */}
                    <FormField
                      control={passwordForm.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showNew ? "text" : "password"}
                                className="h-10 rounded-xl border border-slate-200 bg-white text-sm pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowNew((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                                aria-label="Toggle new password visibility"
                              >
                                {showNew ? (
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

                    <div className="pt-2">
                      <Button
                        className="bg-slate-600 hover:bg-slate-700"
                        type="submit"
                        disabled={(changePassword as any)?.isPending}
                      >
                        {(changePassword as any)?.isPending
                          ? "Updating…"
                          : "Update password"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
