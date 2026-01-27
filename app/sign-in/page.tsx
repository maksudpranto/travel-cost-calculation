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
        <div className="min-h-screen flex font-sans selection:bg-[#10B17D] selection:text-white relative overflow-hidden">
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
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col justify-center items-center px-4 py-12">

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
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40">
                        <div className="px-6 sm:px-10 py-10">
                            {/* Header */}
                            <div className="text-center mb-10">
                                <Link href="/" className="inline-flex justify-center items-center gap-3 mb-6 group">
                                    <div className="w-12 h-12 bg-[#10B17D] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#10B17D]/20 group-hover:scale-105 transition-transform duration-300">
                                        <Map size={24} />
                                    </div>
                                    <span className="text-2xl font-black tracking-tight text-gray-900">TravelCost</span>
                                </Link>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                    {isSignUp ? "Create Account" : "Welcome Back"}
                                </h2>
                                <p className="mt-2 text-sm text-gray-500 font-medium">
                                    {isSignUp ? "Join us to plan your next adventure" : "Sign in to access your trips"}
                                </p>
                            </div>

                            {/* Sign Up Mode Toggle */}
                            {isSignUp && (
                                <div className="flex bg-gray-100/50 p-1 rounded-xl mb-8 relative" role="group">
                                    <button
                                        type="button"
                                        onClick={() => { setUsePhone(false); setIdentifier(""); }}
                                        className={`flex-1 flex items-center justify-center py-2.5 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${!usePhone ? 'bg-[#10B17D] text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
                                    >
                                        Use Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setUsePhone(true); setIdentifier(""); }}
                                        className={`flex-1 flex items-center justify-center py-2.5 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${usePhone ? 'bg-[#10B17D] text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
                                    >
                                        Use Phone
                                    </button>
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                {isSignUp && (
                                    <div className="space-y-1.5">
                                        <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
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
                                            className="block w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-[#10B17D] transition-all duration-200 sm:text-sm"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label htmlFor="identifier" className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
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
                                        className="block w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-[#10B17D] transition-all duration-200 sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
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
                                        className="block w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-[#10B17D] transition-all duration-200 sm:text-sm"
                                    />
                                </div>

                                {error && (
                                    <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="text-sm text-red-700 font-bold">
                                            {error}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 flex justify-center items-center px-4 rounded-xl shadow-lg shadow-[#10B17D]/20 text-sm font-black text-white bg-[#10B17D] hover:bg-[#0D8F65] hover:shadow-xl hover:shadow-[#10B17D]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer transform active:scale-[0.98]"
                                >
                                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isSignUp ? "Create Account" : "Sign In")}
                                </button>
                            </form>
                        </div>

                        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center">
                            <p className="text-sm text-gray-500 font-medium">
                                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                                <button
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setError("");
                                        setUsePhone(false);
                                    }}
                                    className="font-black text-[#10B17D] hover:text-[#0D8F65] transition-colors cursor-pointer ml-1"
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-[#10B17D]" /></div>}>
            <SignInContent />
        </Suspense>
    );
}
