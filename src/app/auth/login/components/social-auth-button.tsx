"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/lib/o-auth-providers";
import BetterAuthActionButton from "@/components/auth/better-auth-action-button";

const SocialAuthButton = () => {
  return (
    <>
      {SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

        return (
          <BetterAuthActionButton
            variant="outline"
            key={provider}
            successMessage={`Signing in with ${SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}...`}
            className="w-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600/70 hover:bg-gradient-to-br hover:from-gray-700/50 hover:to-gray-800/50 text-gray-200 hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 h-12 rounded-lg font-medium shadow-lg hover:shadow-gray-900/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            action={async () => {
              try {
                const result = await authClient.signIn.social({
                  provider,
                  callbackURL: "/",
                });

                // Better Auth social sign-in redirects, so this might not execute
                // But we handle it just in case
                return { error: null };
              } catch (error: any) {
                return {
                  error: {
                    message:
                      error?.message || "Failed to sign in. Please try again.",
                  },
                };
              }
            }}
          >
            <Icon className="w-5 h-5" />
            <span>{SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}</span>
          </BetterAuthActionButton>
        );
      })}
    </>
  );
};

export default SocialAuthButton;
