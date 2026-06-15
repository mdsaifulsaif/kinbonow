"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoginUserMutation } from '@/redux/api/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { loginSuccess } from '@/redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loginUser, { isLoading }] = useLoginUserMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res: any = await loginUser(formData).unwrap();

            dispatch(loginSuccess({
                user: res.data?.user || res.user,
                token: res.data?.accessToken || res.accessToken
            }));

            const token = res.data?.accessToken || res.accessToken;
            if (token) localStorage.setItem('token', token);

            toast.success('Login Successful! Welcome back 🎉');

            const userRole = res.data?.user?.role || res.user?.role;

            if (userRole === 'admin' || userRole === 'superAdmin') {
                router.push('/dashboard/admin');
            } else {
                router.push('/dashboard/user');
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-gray-200 border border-gray-100 max-w-lg mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-500 font-medium">Sign in to continue shopping</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                            <FiMail size={18} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#5CAF90] focus:ring-1 focus:ring-[#5CAF90] outline-none transition-all"
                            placeholder="admin@gmail.com"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-bold text-gray-700">Password</label>
                        <Link href="/forgot-password" className="text-xs text-[#5CAF90] font-medium hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                            <FiLock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#5CAF90] focus:ring-1 focus:ring-[#5CAF90] outline-none transition-all"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-[#5CAF90] hover:bg-[#4A9A7D] text-white rounded-xl font-bold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Signing In...
                        </>
                    ) : (
                        <>
                            Sign In
                            <FiArrowRight />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-[#5CAF90] font-bold hover:underline">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;