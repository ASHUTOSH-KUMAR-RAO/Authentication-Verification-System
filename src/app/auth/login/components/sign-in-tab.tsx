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
import SocialAuthButton from "./social-auth-button";

const signInSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

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
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(handleSignIn)}>
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
          className="w-full cursor-pointer h-12 text-base font-semibold rounded-lg"
        >
          <LoadingSwap isLoading={isSubmitting}>
            <span className="flex items-center justify-center gap-2">
              🚀 Sign In
            </span>
          </LoadingSwap>
        </Button>

        <div className="space-y-3 mt-5">
          <SocialAuthButton />
        </div>

        {/* Forgot Password Link */}
        <div className="text-center">
          <a
            href="/forgot-password"
            className="inline-block text-sm bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 hover:border-red-400/40 transition-all duration-300 hover:scale-105 active:scale-95 font-medium shadow-lg hover:shadow-red-500/20"
          >
            🔑 Forgot password?
          </a>
        </div>
      </form>

      {/* Social Auth Buttons */}
    </Form>
  );
};
