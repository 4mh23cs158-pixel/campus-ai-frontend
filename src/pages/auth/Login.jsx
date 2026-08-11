import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Shield } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      // Call AuthContext login
      const res = await login(email, password);

      console.log("LOGIN RESULT:", res);

      // ========================================
      // LOGIN FAILED
      // ========================================

      if (!res.success) {
        setError(
          res.message || "Login failed. Please check your credentials."
        );

        return;
      }

      // ========================================
      // GET USER
      // ========================================

      const user = res.user;

      console.log("LOGGED IN USER:", user);

      // Make sure user information exists
      if (!user) {
        setError(
          "Login successful, but user information was not returned."
        );

        return;
      }

      // ========================================
      // GET ROLE
      // ========================================

      const userRole = String(user.role || "")
        .trim()
        .toLowerCase();

      console.log("USER ROLE:", userRole);

      // ========================================
      // ADMIN
      // ========================================

      if (userRole === "admin") {
        console.log("Redirecting to ADMIN dashboard");

        navigate("/admin/dashboard", {
          replace: true,
        });

        return;
      }

      // ========================================
      // STAFF
      // ========================================

      if (userRole === "staff") {
        console.log("Redirecting to STAFF dashboard");

        navigate("/staff/dashboard", {
          replace: true,
        });

        return;
      }

      // ========================================
      // STUDENT
      // ========================================

      if (userRole === "student") {
        console.log("Redirecting to STUDENT dashboard");

        navigate("/student/dashboard", {
          replace: true,
        });

        return;
      }

      // ========================================
      // INVALID ROLE
      // ========================================

      console.error("Invalid role received:", user.role);

      setError(
        `Invalid user role "${user.role}". Please contact the administrator.`
      );

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Unable to login. Please try again."
      );

    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">

      <Card className="w-full max-w-md">

        {/* ================================
            HEADER
        ================================= */}

        <CardHeader className="space-y-2 text-center">

          <div className="flex justify-center mb-4">

            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">

              <Shield className="h-6 w-6 text-primary-600" />

            </div>

          </div>

          <CardTitle className="text-2xl font-bold">
            Welcome Back
          </CardTitle>

          <CardDescription>
            Sign in to CampusCare
          </CardDescription>

        </CardHeader>

        {/* ================================
            FORM
        ================================= */}

        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* ERROR */}

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {/* EMAIL */}

            <div className="space-y-2">

              <label
                htmlFor="email"
                className="text-sm font-medium leading-none"
              >
                Email
              </label>

              <Input
                id="email"
                type="email"
                placeholder="m.doe@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

            </div>

            {/* PASSWORD */}

            <div className="space-y-2">

              <label
                htmlFor="password"
                className="text-sm font-medium leading-none"
              >
                Password
              </label>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

            </div>

            {/* LOGIN BUTTON */}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

          </form>

        </CardContent>

        {/* ================================
            SIGNUP
        ================================= */}

        <CardFooter className="flex justify-center">

          <div className="text-sm text-slate-500">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-primary-600 hover:underline"
            >
              Sign up
            </Link>

          </div>

        </CardFooter>

      </Card>

    </div>
  );
}