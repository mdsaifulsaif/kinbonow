"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterUserMutation } from '@/redux/api/authApi';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const router = useRouter();
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters long!");
        }

        try {
            await registerUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            }).unwrap();

            toast.success('Account Created Successfully! 🎉', {
                duration: 4000,
            });

            router.push('/login');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-gray-200 border border-gray-100 max-w-lg mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-500 font-medium">Join us and start shopping smarter</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                                <FiUser size={18} />
                            </div>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#5CAF90] focus:ring-1 focus:ring-[#5CAF90] outline-none transition-all"
                                placeholder="Saiful"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#5CAF90] focus:ring-1 focus:ring-[#5CAF90] outline-none transition-all"
                                placeholder="Islam"
                            />
                        </div>
                    </div>
                </div>

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
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                            <FiLock size={18} />
                        </div>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#5CAF90] focus:ring-1 focus:ring-[#5CAF90] outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                            <FiLock size={18} />
                        </div>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#5CAF90] focus:ring-1 focus:ring-[#5CAF90] outline-none transition-all"
                            placeholder="••••••••"
                        />
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
                            Creating Account...
                        </>
                    ) : (
                        <>
                            Create Account
                            <FiArrowRight />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#5CAF90] font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;