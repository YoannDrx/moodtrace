"use client";

import { Logo } from "@/components/nowts/logo";
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/features/form/submit-button";
import { authClient } from "@/lib/auth-client";
import { getCallbackUrl } from "@/lib/auth/auth-utils";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

const ProviderData: Record<string, { icon: ReactNode; name: string }> = {
  google: {
    icon: <Logo name="google" size={16} />,
    name: "Google",
  },
};

type ProviderButtonProps = {
  providerId: "google";
  callbackUrl?: string;
};

export const ProviderButton = (props: ProviderButtonProps) => {
  const { data: lastUsedProvider } = useQuery({
    queryKey: ["lastUsedLoginMethod"],
    queryFn: () => {
      return authClient.getLastUsedLoginMethod();
    },
    initialData: undefined,
    staleTime: Infinity,
  });

  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: props.providerId,
        callbackURL: getCallbackUrl(props.callbackUrl ?? "/account"),
      });
    },
  });

  const data = ProviderData[props.providerId];

  const isLastUsed = lastUsedProvider === props.providerId;

  return (
    <div className="relative w-full">
      {isLastUsed && (
        <Badge
          variant="secondary"
          className="absolute -top-2.5 -right-2.5 z-10"
        >
          Last used
        </Badge>
      )}
      <LoadingButton
        loading={googleSignInMutation.isPending}
        className={cn("w-full", {
          "border bg-white text-black hover:bg-white dark:border-neutral-700":
            data.name === "Google",
        })}
        size="lg"
        onClick={() => {
          googleSignInMutation.mutate();
        }}
      >
        {data.icon}
        <span className="ml-2">Sign in with {data.name}</span>
      </LoadingButton>
    </div>
  );
};
