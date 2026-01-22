"use client";

import { useState, useEffect, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Map, Loader2, ArrowLeft } from "lucide-react";

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isSignUp, setIsSignUp] = useState(false);
    const [identifier, setIdentifier] = useState(""); // Email or Phone
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [usePhone, setUsePhone] = useState(false); // Only for explicit Sign Up toggle

    useEffect(() => {
        const mode = searchParams.get("mode");
        if (mode === "signup") {
            setIsSignUp(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isSignUp) {
                if (usePhone) {
                    // Phone Sign Up (Treating Phone as Username)
                    await (authClient.signUp as any).username({
                        email: `${identifier}@phone.local`, // Placeholder email
                        password,
                        name,
                        username: identifier, // Phone number as username
                    }, {
                        onSuccess: () => router.push("/dashboard"),
                        onError: (ctx: any) => {
                            setError(ctx.error.message);
                            setLoading(false);
                        }
                    });
                } else {
                    // Standard Email Sign Up
                    await authClient.signUp.email({
                        email: identifier,
                        password,
                        name,
                        username: identifier.split('@')[0], // Optional username generation
                    }, {
                        onSuccess: () => router.push("/dashboard"),
                        onError: (ctx: any) => {
                            setError(ctx.error.message);
                            setLoading(false);
                        }
                    });
                }
            } else {
                // Sign In
                const isEmail = identifier.includes("@");

                if (isEmail) {
                    await authClient.signIn.email({
                        email: identifier,
                        password,
                    }, {
                        onSuccess: () => router.push("/dashboard"),
                        onError: (ctx: any) => {
                            setError(ctx.error.message);
                            setLoading(false);
                        }
                    });
                } else {
                    // Assume it's a username (Phone)
                    await (authClient.signIn as any).username({
                        username: identifier,
                        password,
                    }, {
                        onSuccess: () => router.push("/dashboard"),
                        onError: (ctx: any) => {
                            setError(ctx.error.message);
                            setLoading(false);
                        }
                    });
                }
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans selection:bg-[#FA5C5C] selection:text-white relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/new_hero_bg.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">

                {/* Back Button */}
                <div className="absolute top-6 left-6">
                    <Link
                        href="/"
                        className="group flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300">
                            <ArrowLeft size={24} />
                        </div>
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    {/* Glassmorphism Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/40">
                        <div className="px-8 py-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <Link href="/" className="inline-flex justify-center items-center gap-3 mb-6 group">
                                    <div className="w-12 h-12 bg-[#FA5C5C] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                                        <Map size={24} />
                                    </div>
                                    <span className="text-2xl font-bold tracking-tight text-gray-900">Trip Manager</span>
                                </Link>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {isSignUp ? "Create Account" : "Welcome Back"}
                                </h2>
                                <p className="mt-3 text-base text-gray-600">
                                    {isSignUp ? "Join us to plan your next adventure" : "Sign in to access your trips"}
                                </p>
                            </div>

                            {/* Sign Up Mode Toggle */}
                            {isSignUp && (
                                <div className="flex bg-gray-100/50 p-1 rounded-xl mb-8 relative" role="group">
                                    <button
                                        type="button"
                                        onClick={() => { setUsePhone(false); setIdentifier(""); }}
                                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${!usePhone ? 'bg-[#FA5C5C] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Use Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setUsePhone(true); setIdentifier(""); }}
                                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${usePhone ? 'bg-[#FA5C5C] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Use Phone
                                    </button>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {isSignUp && (
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 ml-1">
                                            Full Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required={isSignUp}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="block w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA5C5C]/20 focus:border-[#FA5C5C] transition-all duration-200 sm:text-sm shadow-sm"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700 ml-1">
                                        {isSignUp ? (usePhone ? "Phone Number" : "Email Address") : "Email or Phone Number"}
                                    </label>
                                    <input
                                        id="identifier"
                                        name="identifier"
                                        type={isSignUp ? (usePhone ? "tel" : "email") : "text"}
                                        autoComplete={isSignUp ? (usePhone ? "tel" : "email") : "username"}
                                        required
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder={isSignUp ? (usePhone ? "+1 (555) 000-0000" : "you@example.com") : "Enter your email or phone"}
                                        className="block w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA5C5C]/20 focus:border-[#FA5C5C] transition-all duration-200 sm:text-sm shadow-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 ml-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete={isSignUp ? "new-password" : "current-password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="block w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA5C5C]/20 focus:border-[#FA5C5C] transition-all duration-200 sm:text-sm shadow-sm"
                                    />
                                </div>

                                {error && (
                                    <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex">
                                            <div className="text-sm text-red-700 font-medium">
                                                {error}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-[#FA5C5C]/20 text-sm font-bold text-white bg-[#FA5C5C] hover:bg-[#D43E3E] hover:shadow-xl hover:shadow-[#FA5C5C]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FA5C5C] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
                                >
                                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isSignUp ? "Create Acount" : "Sign In")}
                                </button>
                            </form>
                        </div>

                        <div className="px-8 py-6 bg-gray-50/80 border-t border-gray-100 flex items-center justify-center">
                            <p className="text-sm text-gray-600">
                                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                                <button
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setError("");
                                        setUsePhone(false);
                                    }}
                                    className="font-bold text-[#FA5C5C] hover:text-[#D43E3E] transition-colors cursor-pointer ml-1"
                                >
                                    {isSignUp ? "Sign In" : "Sign Up"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-[#FA5C5C]" /></div>}>
            <SignInContent />
        </Suspense>
    );
}
