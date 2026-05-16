import React, { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Sprout } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { login, register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

// Password must have at least 1 uppercase, 1 lowercase, 1 digit, 1 special character, min 8 chars
function validatePassword(password: string): string | null {
  if (password.length < 8)
    return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password must contain at least one special character (e.g. !@#$%).";
  return null;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerSurname, setRegisterSurname] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await login({ username: loginUsername, password: loginPassword });
      await refreshUser();
      navigate("/dashboard");
    } catch {
      // Never reveal which field is wrong
      setLoginError("Incorrect email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    // Client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      setRegisterError("Please enter a valid email address (e.g. user@example.com).");
      return;
    }

    // Client-side password validation
    const pwError = validatePassword(registerPassword);
    if (pwError) {
      setRegisterError(pwError);
      return;
    }

    setRegisterLoading(true);
    try {
      await register({
        name: registerName,
        surname: registerSurname,
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      });
      // Auto-login after register
      await login({ username: registerUsername, password: registerPassword });
      await refreshUser();
      navigate("/dashboard");
    } catch (err: unknown) {
      setRegisterError(err instanceof Error ? err.message : "Registration failed. Try a different username.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1729041221905-0519efecaa92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZhcm0lMjBsYW5kc2NhcGUlMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NzQ4MDY0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Farm landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-white/70 to-amber-100/60" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Farming Assistant</h1>
          <p className="text-gray-600 mt-2 text-center">
            AI-powered agricultural recommendations for your farm
          </p>
        </div>

        <Card className="shadow-xl border-gray-200">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      {loginError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="your_username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="bg-input-background"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  {registerError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      {registerError}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">First Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                        className="bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-surname">Last Name</Label>
                      <Input
                        id="register-surname"
                        type="text"
                        placeholder="Doe"
                        value={registerSurname}
                        onChange={(e) => setRegisterSurname(e.target.value)}
                        required
                        className="bg-input-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="john_doe"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="john@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      className="bg-input-background"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover"
                    disabled={registerLoading}
                  >
                    {registerLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}