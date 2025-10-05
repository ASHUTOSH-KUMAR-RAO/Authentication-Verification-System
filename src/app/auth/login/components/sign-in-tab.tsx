"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

// Video Background Component
const VideoBackground = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-sm" />
    </>
  );
};

// Main Gaming Sign In Component
export const SignInTab = () => {
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;
  const router = useRouter();

  const handleSignIn = async (data: SignInForm) => {
    await authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "⚠️ Sign In failed. Please try again later!"
          );
        },
        onSuccess: () => {
          router.push("/");
          toast.success("✅ Logged In successfully! Welcome aboard!");
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      {/* Video Background */}
      <VideoBackground videoUrl="https://videos.pexels.com/video-files/8128311/8128311-uhd_2560_1440_25fps.mp4" />

      {/* Login Form Container */}
      <div className="relative z-20 w-full max-w-md">
        <div className="backdrop-blur-xl bg-black/40 rounded-2xl shadow-2xl border border-white/10 p-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSignIn)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200 font-medium text-base flex items-center gap-2">
                      📧 Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your.email@example.com"
                        className="bg-white/5 backdrop-blur-md border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 h-12 text-base rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200 font-medium text-base flex items-center gap-2">
                      🔐 Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Enter your password"
                        className="bg-white/5 backdrop-blur-md border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 h-12 text-base rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                variant="fireTrail"
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer h-12 text-base font-semibold"
              >
                <LoadingSwap isLoading={isSubmitting}>
                  <span className="flex items-center justify-center gap-2">
                    🚀 Sign In
                  </span>
                </LoadingSwap>
              </Button>
            </form>
          </Form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <a
              href="/forgot-password"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>

   

      {/* Fade In Animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};
