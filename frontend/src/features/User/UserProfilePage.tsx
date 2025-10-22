import * as React from "react";
// api -> FROM ORVAL
import {
  useUpdateUserProfileUserUpdateUserPatch,
  useChangeUserEmailUserChangeEmailPut,
  useChangeUserPasswordUserChangePasswordPut,
  useLastLoginUserMyLastLoginGet,
} from "@/generated/user/user";
// page
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, Mail, Lock, Clock } from "lucide-react";

/* small field wrapper */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-700">{label}</label>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export default function UserProfilePage() {
  /* banner */
  const [banner, setBanner] = React.useState<
    { type: "ok" | "error"; msg: string } | undefined
  >();
  const ok = (msg: string) => setBanner({ type: "ok", msg });
  const err = (msg: string) => setBanner({ type: "error", msg });

  /* last login (GET) */
  const {
    data: lastLoginRaw,
    isLoading: loadingLast,
    refetch: refetchLast,
  } = useLastLoginUserMyLastLoginGet();
  const lastLogin =
    typeof lastLoginRaw === "string"
      ? lastLoginRaw
      : ((lastLoginRaw as any)?.last_login ?? undefined);

  /* -------------------- Update profile (PATCH /user/update-user) -------------------- */
  const updateProfile = useUpdateUserProfileUserUpdateUserPatch();
  const [profileForm, setProfileForm] = React.useState({
    user_id: "" as number | "",
    username: "",
    avatar_url: "",
    address: "",
    country: "",
    phone_number: "",
  });

  async function onUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      // send exactly as schema shows (body only)
      await updateProfile.mutateAsync(profileForm as any);
      ok("Profile updated.");
      refetchLast?.();
    } catch (e) {
      console.error(e);
      err("Could not update profile.");
    }
  }

  /* -------------------- Change email (PUT /user/change-email?payload=) -------------------- */
  const changeEmail = useChangeUserEmailUserChangeEmailPut();
  const [newEmail, setNewEmail] = React.useState("");

  async function onChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    try {
      await changeEmail.mutateAsync({ payload: newEmail } as any);
      ok("Email change requested.");
    } catch (e) {
      console.error(e);
      err("Could not change email.");
    }
  }

  /* -------------------- Change password (PUT /user/change-password) -------------------- */
  const changePassword = useChangeUserPasswordUserChangePasswordPut();
  const [pwd, setPwd] = React.useState({ password: "", new_password: "" });

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      await changePassword.mutateAsync(pwd as any);
      ok("Password changed.");
      setPwd({ password: "", new_password: "" });
    } catch (e) {
      console.error(e);
      err("Could not change password.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {banner && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              banner.type === "ok"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {banner.msg}
          </div>
        )}

        {/* Last login */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold">Last Login</h2>
                </div>
                <Button
                  variant="outline"
                  className="border-slate-200"
                  onClick={() => refetchLast()}
                >
                  Refresh
                </Button>
              </div>
              <p className="mt-3 text-slate-700">
                {loadingLast
                  ? "—"
                  : lastLogin
                    ? new Date(lastLogin).toLocaleString()
                    : "Unknown"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forms grid */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Update profile */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold">Update Profile</h2>
                </div>

                <form className="grid gap-4" onSubmit={onUpdateProfile}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="User ID">
                      <input
                        type="number"
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white"
                        value={profileForm.user_id}
                        onChange={(e) =>
                          setProfileForm((s) => ({
                            ...s,
                            user_id: Number(e.target.value || 0),
                          }))
                        }
                        required
                      />
                    </Field>

                    <Field label="Username">
                      <input
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white"
                        value={profileForm.username}
                        onChange={(e) =>
                          setProfileForm((s) => ({
                            ...s,
                            username: e.target.value,
                          }))
                        }
                        placeholder="your handle"
                      />
                    </Field>

                    <Field label="Avatar URL">
                      <input
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white"
                        value={profileForm.avatar_url}
                        onChange={(e) =>
                          setProfileForm((s) => ({
                            ...s,
                            avatar_url: e.target.value,
                          }))
                        }
                        placeholder="https://…"
                      />
                    </Field>

                    <Field label="Phone Number">
                      <input
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white"
                        value={profileForm.phone_number}
                        onChange={(e) =>
                          setProfileForm((s) => ({
                            ...s,
                            phone_number: e.target.value,
                          }))
                        }
                        placeholder="+123456789"
                      />
                    </Field>

                    <Field label="Country">
                      <input
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white"
                        value={profileForm.country}
                        onChange={(e) =>
                          setProfileForm((s) => ({
                            ...s,
                            country: e.target.value,
                          }))
                        }
                        placeholder="Portugal"
                      />
                    </Field>

                    <Field label="Address">
                      <input
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white"
                        value={profileForm.address}
                        onChange={(e) =>
                          setProfileForm((s) => ({
                            ...s,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Street, city, zip"
                      />
                    </Field>
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Change email */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold">Change Email</h2>
                </div>

                <form className="grid gap-4" onSubmit={onChangeEmail}>
                  <Field label="New Email">
                    <input
                      type="email"
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </Field>

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
              </CardContent>
            </Card>
          </motion.div>

          {/* Change password */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold">Change Password</h2>
                </div>

                <form className="grid gap-4" onSubmit={onChangePassword}>
                  <Field label="Current Password">
                    <input
                      type="password"
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white"
                      value={pwd.password}
                      onChange={(e) =>
                        setPwd((s) => ({ ...s, password: e.target.value }))
                      }
                      required
                    />
                  </Field>

                  <Field label="New Password">
                    <input
                      type="password"
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white"
                      value={pwd.new_password}
                      onChange={(e) =>
                        setPwd((s) => ({ ...s, new_password: e.target.value }))
                      }
                      required
                    />
                  </Field>

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
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
