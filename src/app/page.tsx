"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { LogIn, LogOut, Sparkles, Shield, Zap } from "lucide-react";

const Home = () => {
  const { data: session, isPending: loading } = authClient.useSession();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white text-lg font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gray-700/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-600/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gray-700/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {session == null ? (
            // Not Logged In View
            <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-gray-500/20 transition-all duration-500">
              <div className="text-center space-y-8">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg shadow-gray-500/50 animate-bounce">
                  <Shield className="w-10 h-10 text-white" />
                </div>

                {/* Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent leading-tight">
                    Welcome to AuthGate
                  </h1>
                  <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                    Experience next-generation authentication with our secure
                    and modern verification system built with Next.js
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20 group">
                    <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-3 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                    <h3 className="text-white font-semibold mb-2">Modern UI</h3>
                    <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                      Beautiful glassmorphism design
                    </p>
                  </div>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20 group">
                    <Shield className="w-8 h-8 text-gray-300 mx-auto mb-3 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                    <h3 className="text-white font-semibold mb-2">Secure</h3>
                    <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                      Enterprise-grade security
                    </p>
                  </div>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20 group">
                    <Zap className="w-8 h-8 text-gray-400 mx-auto mb-3 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                    <h3 className="text-white font-semibold mb-2">Fast</h3>
                    <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                      Lightning-fast performance
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-semibold px-8 py-6 text-lg rounded-2xl shadow-lg shadow-gray-500/50 hover:shadow-gray-500/70 transition-all duration-300 hover:scale-105 group"
                >
                  <Link href="/auth/login" className="flex items-center gap-2">
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    Get Started Now
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            // Logged In View
            <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-gray-500/20 transition-all duration-500">
              <div className="text-center space-y-8">
                {/* Avatar */}
                <div className="relative inline-block group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-gray-500/50 transition-all duration-500 group-hover:shadow-gray-400/70 group-hover:scale-110">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Welcome Message */}
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Welcome back,{" "}
                    <span className="bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                      {session.user.name}
                    </span>
                    !
                  </h1>
                  <p className="text-lg text-white/70 max-w-2xl mx-auto">
                    You're successfully authenticated. Explore your dashboard
                    and manage your account with ease.
                  </p>
                </div>

                {/* User Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20 group">
                    <p className="text-white/60 text-sm mb-1 group-hover:text-white/80 transition-colors">
                      Email
                    </p>
                    <p className="text-white font-medium group-hover:tracking-wide transition-all duration-300">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20 group">
                    <p className="text-white/60 text-sm mb-1 group-hover:text-white/80 transition-colors">
                      Status
                    </p>
                    <p className="text-green-400 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:scale-150 transition-transform duration-300" />
                      Active
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => authClient.signOut()}
                    className="bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 font-semibold px-8 py-6 text-lg rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 group cursor-pointer hover:shadow-lg hover:shadow-red-500/30"
                  >
                    <LogOut className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-sm z-20">
        © 2025 Ashutosh Kumar Rao. All rights reserved.
      </footer>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Home;
