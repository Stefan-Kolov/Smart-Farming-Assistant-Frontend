import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { LogOut, User, Mail, Lock, CheckCircle2, AlertCircle, Pencil, X, Save, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, type UpdateProfileRequest } from "../api/auth";

/* ─── Tiny field-level error store ─────────────────────────────────────────── */
type FieldErrors = Partial<Record<keyof UpdateProfileRequest, string>>;

function validate(form: UpdateProfileRequest): FieldErrors {
  const errs: FieldErrors = {};
  if (!form.name.trim())     errs.name     = "First name is required.";
  if (!form.surname.trim())  errs.surname  = "Last name is required.";
  if (!form.username.trim()) errs.username = "Username is required.";
  if (!form.email.trim())    errs.email    = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                             errs.email    = "Enter a valid email address.";
  if (form.password && form.password.length > 0 && form.password.length < 8)
                             errs.password = "Password must be at least 8 characters.";
  return errs;
}

/* ─── Reusable labelled input ───────────────────────────────────────────────── */
interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  suffix?: React.ReactNode;
}

function Field({ id, label, value, onChange, type = "text", placeholder, error, disabled, suffix }: FieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2.5 rounded-lg border text-sm bg-white
            transition-colors duration-150 outline-none
            focus:ring-2 focus:ring-primary/30 focus:border-primary
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            ${error ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}
            ${suffix ? "pr-10" : ""}
          `}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-3 flex items-center">{suffix}</div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
export function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();

  const [editing, setEditing]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [showPw, setShowPw]         = useState(false);
  const [success, setSuccess]       = useState<string | null>(null);
  const [apiError, setApiError]     = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  /* form state — mirrors the backend UpdateProfileRequest */
  const [form, setForm] = useState<UpdateProfileRequest>({
    username: "",
    name:     "",
    surname:  "",
    email:    "",
    password: "",
  });

  /* seed form whenever user data loads or editing begins */
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        name:     user.name,
        surname:  user.surname,
        email:    user.email,
        password: "",
      });
    }
  }, [user]);

  const set = (key: keyof UpdateProfileRequest) => (val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setFieldErrors(e => ({ ...e, [key]: undefined }));
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccess(null);
    setApiError(null);
    setFieldErrors({});
  };

  const handleCancel = () => {
    setEditing(false);
    setApiError(null);
    setFieldErrors({});
    if (user) {
      setForm({ username: user.username, name: user.name, surname: user.surname, email: user.email, password: "" });
    }
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setSaving(true);
    setApiError(null);
    setSuccess(null);

    try {
      const payload: UpdateProfileRequest = {
        username: form.username.trim(),
        name:     form.name.trim(),
        surname:  form.surname.trim(),
        email:    form.email.trim(),
        password: form.password?.trim() || undefined,
      };
      const res = await updateProfile(payload);
      await refreshUser();         // sync AuthContext with updated values
      setEditing(false);
      setSuccess(res.message ?? "Profile updated successfully.");
      setForm(f => ({ ...f, password: "" }));
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = user ? `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase() : "?";
  const fullName  = user ? `${user.name} ${user.surname}` : "Unknown User";

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Avatar card ─────────────────────────────────────────────────── */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-primary text-white text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-semibold text-gray-900 truncate">{fullName}</h2>
              <p className="text-gray-500 text-sm mt-0.5">@{user?.username}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                {user?.role === "ROLE_ADMINISTRATOR" ? "Administrator" : "User"}
              </span>
            </div>
            {!editing && (
              <Button
                id="btn-edit-profile"
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-1.5 shrink-0"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Success banner ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── API error banner ────────────────────────────────────────────── */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            key="api-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile info / edit form ─────────────────────────────────────── */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Account Information
          </CardTitle>
          <CardDescription>
            {editing ? "Update your details below and save when ready." : "Your current profile details."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {editing ? (
            <motion.div
              key="edit-form"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  id="profile-name"
                  label="First Name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Jane"
                  error={fieldErrors.name}
                  disabled={saving}
                />
                <Field
                  id="profile-surname"
                  label="Last Name"
                  value={form.surname}
                  onChange={set("surname")}
                  placeholder="Doe"
                  error={fieldErrors.surname}
                  disabled={saving}
                />
              </div>

              <Field
                id="profile-username"
                label="Username"
                value={form.username}
                onChange={set("username")}
                placeholder="jane_doe"
                error={fieldErrors.username}
                disabled={saving}
              />

              <Field
                id="profile-email"
                label="Email"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="jane@example.com"
                error={fieldErrors.email}
                disabled={saving}
              />

              {/* Password — always optional, blank = unchanged */}
              <Field
                id="profile-password"
                label="New Password (leave blank to keep current)"
                type={showPw ? "text" : "password"}
                value={form.password ?? ""}
                onChange={set("password")}
                placeholder="Min. 8 characters"
                error={fieldErrors.password}
                disabled={saving}
                suffix={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw(v => !v)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  id="btn-save-profile"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary hover:bg-primary-hover flex items-center gap-2"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
                <Button
                  id="btn-cancel-edit"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="read-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-x-6 gap-y-5"
            >
              {[
                { label: "First Name", value: user?.name },
                { label: "Last Name",  value: user?.surname },
                { label: "Username",   value: `@${user?.username}` },
                { label: "Email",      value: user?.email },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{label}</p>
                  <p className="font-medium text-gray-900">{value}</p>
                </div>
              ))}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Password</p>
                <p className="font-medium text-gray-400 tracking-widest text-sm">••••••••</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* ── Security section hint ────────────────────────────────────────── */}
      {!editing && (
        <Card className="border-gray-200">
          <CardHeader className="text-center pt-8 pb-14">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Password
            </CardTitle>
            <CardDescription>
              Change your password by clicking <strong>Edit</strong> above and filling in the new password field.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* ── Session / logout ─────────────────────────────────────────────── */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Session
          </CardTitle>
          <CardDescription>Manage your current login session.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            id="btn-logout"
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
