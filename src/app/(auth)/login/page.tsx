// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("লগিন ব্যর্থ হয়েছে: " + res.error);
        setLoading(false);
        return;
      }

      toast.success("Login Successful! Welcome back.");

      // ✅ রাউটার পুশ না করে সরাসরি window.location ব্যবহার করুন
      window.location.href = "/dashboard/admin"; // অথবা শুধু "/dashboard"
    } catch (err) {
      console.error("Login error:", err);
      toast.error("কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-md bg-gradient-to-br from-[#5CAF90] to-[#4A9A7D] flex items-center justify-center font-bold text-2xl text-white shadow-md">
            M
          </div>
          <h1 className="text-xl font-bold text-gray-800 mt-4">
            MegaShop Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <FiMail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#5CAF90]/40 focus:border-[#5CAF90]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#5CAF90]/40 focus:border-[#5CAF90]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#5CAF90] hover:bg-[#4A9A7D] text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" size={18} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
