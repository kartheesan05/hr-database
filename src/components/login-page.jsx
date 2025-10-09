"use client";

import { useEffect, useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/actions";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import Logo from "@/components/logo";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  // const [state, formAction, isPending] = useActionState(login, {})
  const [isPending, startTransition] = useTransition();
  const [errorState, setErrorState] = useState(null);
  const router = useRouter();
  // show Google auth errors passed via query; and handle google login success
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        setErrorState(
          err === "invaliduser" ? "invaliduser" : `Google auth failed (${err})`
        );
      }
      const google = params.get("google");
      if (google === "1") {
        // fetch session details and populate localStorage, then redirect
        fetch("/api/auth/me", { cache: "no-store" })
          .then((r) => r.json())
          .then((data) => {
            if (data && data.role) {
              localStorage.setItem("role", data.role);
            }
            if (data && data.name) {
              localStorage.setItem("name", data.name);
            }
            if (data && data.incharge_name) {
              localStorage.setItem("incharge", data.incharge_name);
            }
            toast.success(
              `Login successful${data?.name ? ", " + data.name : ""}!`
            );
            router.push("/");
          })
          .catch(() => {
            router.push("/");
          });
      }
    } catch (e) {}
  }, [router]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      const result = await login(formData);
      if (result.errors) {
        setErrorState(result.errors);
        return;
      }
      result.role && localStorage.setItem("role", result.role);
      result.name && localStorage.setItem("name", result.name);
      result.incharge && localStorage.setItem("incharge", result.incharge);
      if (result.name === "Arunima") {
        toast.success(`Login successful cutie :3!`);
      } else {
        toast.success(`Login successful, ${result.name}!`);
      }
      router.push("/");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50 p-4">
      <div className="w-60 mt-16 mb-8 mr-10 min-h-36">
        <img src="/login-logo-small.png" alt="Forese Logo" />
      </div>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            HR Database Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff
                      className="h-4 w-4 text-blue-800"
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye className="h-4 w-4 text-blue-800" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-xs text-blue-700 text-center">
                <strong>For testing:</strong> Email: test@test.com, Password:
                testpassword
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {errorState && (
              <div className="text-red-500 text-sm text-center">
                {typeof errorState === "string"
                  ? errorState === "invaliduser"
                    ? "Invalid email or password"
                    : errorState
                  : Object.values(errorState).map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
            <div className="relative flex items-center justify-center w-full">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-3 text-xs text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = "/api/auth/google/start";
              }}
            >
              <img
                src="/google-logo.png"
                alt="Google Logo"
                className="w-4 h-4 mr-2"
              />
              Login with&nbsp;<span className="font-bold">Google</span>
            </Button>
            {/* <div className="text-sm text-center text-gray-600">
              Don't have an account?{""}
              <a href="#" className="text-blue-800 hover:underline">
                Sign up
              </a>
            </div> */}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
