import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const [, setLocation] = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Login failed");
            }

            // Redirect to dashboard
            setLocation("/admin/dashboard");
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <Card className="w-full max-w-md p-8 space-y-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold font-display text-white">Admin Portal</h1>
                    <p className="text-slate-400">Sign in to access the dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium text-slate-200">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-slate-200">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <div className="pt-4 border-t border-slate-700">
                    <div className="text-center space-y-1">
                        <p className="text-xs text-slate-400">Default Credentials:</p>
                        <p className="text-xs text-slate-500 font-mono">
                            Username: <span className="text-slate-300">admin</span> | Password: <span className="text-slate-300">admin123</span>
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation("/")}
                        className="text-slate-400 hover:text-white"
                    >
                        ← Back to Home
                    </Button>
                </div>
            </Card>
        </div>
    );
}
