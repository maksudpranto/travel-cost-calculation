"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Map, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

export default function SignInPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [identifier, setIdentifier] = useState(""); // Email or Phone
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [usePhone, setUsePhone] = useState(false); // Only for explicit Sign Up toggle

    const router = useRouter();

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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center sm:px-6 lg:px-8 font-sans selection:bg-[#41644A] selection:text-white relative">
            {/* Back Button */}
            <div className="absolute top-6 left-6">
                <Link
                    href="/"
                    className="group flex items-center justify-center text-gray-500 hover:text-[#41644A] transition-colors cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-[#41644A] group-hover:shadow-md transition-all">
                        <ArrowLeft size={24} />
                    </div>
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#41644A] rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Map size={22} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">Trip Manager</span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {isSignUp ? "Create your account" : "Sign in to your account"}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{" "}
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                            setUsePhone(false);
                        }}
                        className="font-medium text-[#41644A] hover:text-[#2e4a34] transition-colors cursor-pointer"
                    >
                        {isSignUp ? "sign in to existing account" : "create a new account"}
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">

                    {/* Sign Up Mode Toggle */}
                    {isSignUp && (
                        <div className="flex rounded-md shadow-sm mb-6" role="group">
                            <button
                                type="button"
                                onClick={() => { setUsePhone(false); setIdentifier(""); }}
                                className={`px-4 py-2 text-sm font-medium border flex-1 rounded-l-lg cursor-pointer ${!usePhone ? 'bg-[#41644A] text-white border-[#41644A]' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                Email
                            </button>
                            <button
                                type="button"
                                onClick={() => { setUsePhone(true); setIdentifier(""); }}
                                className={`px-4 py-2 text-sm font-medium border-t border-b border-r flex-1 rounded-r-lg cursor-pointer ${usePhone ? 'bg-[#41644A] text-white border-[#41644A]' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                Phone
                            </button>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required={isSignUp}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#41644A] focus:border-[#41644A] sm:text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                                {isSignUp ? (usePhone ? "Phone Number" : "Email address") : "Email or Phone Number"}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type={isSignUp ? (usePhone ? "tel" : "email") : "text"}
                                    autoComplete={isSignUp ? (usePhone ? "tel" : "email") : "username"}
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#41644A] focus:border-[#41644A] sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#41644A] focus:border-[#41644A] sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="text-sm text-red-700">
                                        {error}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#41644A] hover:bg-[#2e4a34] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#41644A] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isSignUp ? "Sign up" : "Sign in")}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
