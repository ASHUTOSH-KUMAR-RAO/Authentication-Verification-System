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

const signUpSchema = z.object({
  name: z.string().min(4),
  email: z.email().min(1),
  password: z.string().min(8),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export const SignUpTab = () => {
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const router = useRouter();
  const handleSignUp = async (data: SignUpForm) => {
    await authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "⚠️ Sign up failed. Please try again later!"
          );
        },
        onSuccess: (data) => {
          router.push("/");
          toast.success("✅ Account created successfully! Welcome aboard!");
        },
      }
    );
    console.log(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSignUp)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200 font-medium text-base flex items-center gap-2">
                👤 Full Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="✨ What should we call you?"
                  className="bg-gray-700/50 backdrop-blur-md border-gray-600/50 text-white placeholder:text-gray-400 focus:bg-gray-700/70 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-lg shadow-gray-900/20 h-12 text-base"
                />
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />
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
                  placeholder="💌 your.email@example.com"
                  className="bg-gray-700/50 backdrop-blur-md border-gray-600/50 text-white placeholder:text-gray-400 focus:bg-gray-700/70 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-lg shadow-gray-900/20 h-12 text-base"
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
                  placeholder="🔒 Create a strong password (min 8 characters)"
                  className="bg-gray-700/50 backdrop-blur-md border-gray-600/50 text-white placeholder:text-gray-400 focus:bg-gray-700/70 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-lg shadow-gray-900/20 h-12 text-base"
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
          className="w-full cursor-pointer"
        >
          <LoadingSwap isLoading={isSubmitting}>
            <span className="flex items-center gap-2">
              🚀 Create My Account
            </span>
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};
