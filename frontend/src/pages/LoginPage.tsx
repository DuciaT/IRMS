import { motion } from "framer-motion";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useAuthService } from "../features/auth/hooks/useAuthService";
import type { UserRole } from "../features/auth/types/index";
import { FormField } from "../features/auth/components/LoginField";
import { BrandingSection } from "../features/auth/components/BrandingSection";
import { RoleSelector } from "../features/auth/components/RoleSelector";
import { ROLES_CONFIG } from "../features/auth/constants/roles";

//Điều phối State, xử lý logic Login
export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuthService();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const roleData = ROLES_CONFIG.find((r) => r.value === role);
    if (roleData) {
      setEmail(roleData.email);
      setPassword(role + "123"); // Auto-fill demo password
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = await login(email, password);

    if (!user) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-background via-muted/20 to-background flex items-center justify-center p-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-6xl"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Branding */}
            <BrandingSection />

            {/* Right Side - Login Form */}
            <div className="p-12">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2
                  className="mb-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: 700,
                  }}
                >
                  Welcome Back
                </h2>
                <p className="text-muted-foreground mb-8">
                  Select your role and sign in to continue
                </p>

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Role Selection */}
                  <RoleSelector
                    selectedRole={selectedRole}
                    onSelect={handleRoleSelect}
                  />

                  {/* Email & Password*/}
                  <div className="space-y-4">
                    <FormField
                      label="Email"
                      type="email"
                      icon={Mail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />

                    <FormField
                      label="Password"
                      type="password"
                      icon={Lock}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!selectedRole}
                    className={`w-full py-4 rounded-lg transition-all ${
                      selectedRole
                        ? "bg-primary text-primary-foreground hover:shadow-lg"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    Sign In
                  </motion.button>
                </form>

                {error && (
                  <p
                    className="mt-2 text-center text-red-500"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {error}
                  </p>
                )}

                <p
                  className="mt-6 text-center text-muted-foreground"
                  style={{ fontSize: "0.75rem" }}
                >
                  IRMS © 2026 - Powered by Micro-Frontend Architecture
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
