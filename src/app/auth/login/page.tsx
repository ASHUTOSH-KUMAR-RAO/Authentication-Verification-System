"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";
import { SignInTab } from "./components/sign-in-tab";
import { SignUpTab } from "./components/sign-up-tab ";
import { Volume2, VolumeX } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {  useRouter } from "next/navigation";

// Video Background Component
const VideoBackground = ({
  videoUrl,
  isMuted,
  onMuteToggle,
}: {
  videoUrl: string;
  isMuted: boolean;
  onMuteToggle: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-sm z-0" />

      {/* Music Control Button */}
      <button
        onClick={onMuteToggle}
        className="fixed top-6 right-6 z-30 bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-black/60 hover:border-white/40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    </>
  );
};

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [isMuted, setIsMuted] = useState(true);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const router = useRouter()

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/");
    });
  }, [router]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-auto">
      {/* Video Background */}
      <VideoBackground
        videoUrl="/VDIO.mp4"
        isMuted={isMuted}
        onMuteToggle={handleMuteToggle}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-md w-full"
        >
          <TabsList className="w-full bg-black/40 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-2xl mb-6">
            <TabsTrigger
              value="signin"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-400 rounded-lg transition-all duration-300 py-3 font-medium hover:text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-400 rounded-lg transition-all duration-300 py-3 font-medium hover:text-white"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-0">
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <p className="text-center text-gray-400 text-sm">
                  Sign in to continue your journey
                </p>
              </CardHeader>
              <CardContent>
                <SignInTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
                <p className="text-center text-gray-400 text-sm">
                  Start your adventure today
                </p>
              </CardHeader>
              <CardContent>
                <SignUpTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="fixed bottom-4 left-0 right-0 text-center text-white/60 text-sm z-20">
          © 2025 Ashutosh Kumar Rao. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
