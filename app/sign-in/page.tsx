"use client";

import { useState, useEffect, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Map as MapIcon, Loader2, ArrowLeft, ChevronRight } from "lucide-react";

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isSignUp, setIsSignUp] = useState(false);
    const [identifier, setIdentifier] = useState(""); // Email or Phone
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

        if (isSignUp && password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

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

    const inputWrapperStyle = "space-y-2";
    const labelStyle = "text-[11px] font-bold text-[#10B17D] uppercase tracking-wider ml-1";
    const inputStyle = "w-full h-14 bg-[#1A1A1A] border border-[#10B17D]/50 rounded-2xl px-6 text-white placeholder-gray-600 focus:ring-2 focus:ring-[#10B17D]/30 transition-all font-bold";

    return (
        <div className="min-h-screen bg-[#111111] font-sans selection:bg-[#10B17D] selection:text-white flex flex-col lg:flex-row relative overflow-hidden">

            {/* Left Section: Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-24 py-12 relative z-10 bg-[#111111]">
                <div className="w-full max-w-lg">
                    {/* Top Navigation / Logo */}
                    <div className="flex items-center justify-between mb-16 lg:mb-24">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#10B17D] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#10B17D]/20 transition-transform duration-500 group-hover:scale-110">
                                <MapIcon size={20} strokeWidth={2.5} />
                            </div>
                            <span className="text-lg sm:text-xl font-black text-white tracking-tight">TravelCost<span className="text-[#10B17D]">.</span></span>
                        </Link>
                        <nav className="flex items-center gap-6 sm:gap-10">
                            <Link href="/" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Home</Link>
                        </nav>
                    </div>

                    {/* Header */}
                    <div className="mb-10 text-left">
                        <p className="text-[10px] font-black text-[#10B17D] uppercase tracking-[0.3em] mb-4">
                            {isSignUp ? "Start for free" : "Welcome back"}
                        </p>
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-4">
                            {isSignUp ? "Create new account" : "Sign in to account"}<span className="text-[#10B17D]">.</span>
                        </h1>
                        <p className="text-sm sm:text-base text-gray-400 font-bold">
                            {isSignUp ? "Already a Member?" : "New to TravelCost?"}{" "}
                            <button
                                onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                                className="text-[#10B17D] hover:underline cursor-pointer"
                            >
                                {isSignUp ? "Log In" : "Sign Up"}
                            </button>
                        </p>
                    </div>

                    {/* Auth Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={inputWrapperStyle}>
                                    <label className={labelStyle}>First name</label>
                                    <input required type="text" placeholder="Michał" value={name.split(' ')[0]} onChange={(e) => setName(e.target.value + (name.split(' ')[1] ? ' ' + name.split(' ')[1] : ''))} className={inputStyle} />
                                </div>
                                <div className={inputWrapperStyle}>
                                    <label className={labelStyle}>Last name</label>
                                    <input type="text" placeholder="Masiak" value={name.split(' ')[1] || ''} onChange={(e) => setName((name.split(' ')[0] || '') + ' ' + e.target.value)} className={inputStyle} />
                                </div>
                            </div>
                        )}

                        <div className={inputWrapperStyle}>
                            <label className={labelStyle}>Email / Phone</label>
                            <input required type="text" placeholder="you@anywhere.co" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputStyle} />
                        </div>

                        <div className={inputWrapperStyle}>
                            <label className={labelStyle}>Password</label>
                            <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyle} />
                        </div>

                        {isSignUp && (
                            <div className={inputWrapperStyle}>
                                <label className={labelStyle}>Confirm Password</label>
                                <input required type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputStyle} />
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-500 font-bold animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-[#10B17D] text-white font-black rounded-[22px] hover:bg-[#0D8F65] transition-all cursor-pointer select-none active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isSignUp ? "Create account" : "Sign in")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Section: Image with Wavy Divider */}
            <div className="hidden lg:block relative flex-1 bg-[#111111]">
                {/* Wavy Mask Overlay */}
                <div className="absolute inset-y-0 left-0 w-32 bg-[#111111] z-20" style={{
                    clipPath: "polygon(0 0, 100% 0, 0 100%)",
                }} />

                <div className="absolute inset-0 bg-black/20 z-10" />

                <Image
                    src="/new_hero_bg.png"
                    alt="Travel"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />

                {/* SVG Divider for organic look */}
                <svg className="absolute inset-y-0 left-[-1px] h-full w-48 z-20 text-[#111111] fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 0 C 30 20, 70 20, 100 0 L 100 100 C 70 80, 30 80, 0 100 Z" transform="rotate(90 50 50)" />
                </svg>

                {/* Bottom Logo Link */}
                <div className="absolute bottom-12 right-12 z-30">
                    <Link href="/" className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#111111] font-black">
                            <MapIcon size={24} />
                        </div>
                        <span className="text-2xl font-black text-white tracking-widest uppercase">AW<span className="text-[#10B17D]">.</span></span>
                    </Link>
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
