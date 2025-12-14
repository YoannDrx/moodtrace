"use client";

import { AvatarUploader } from "@/components/avatar-upload";
import { Typography } from "@/components/nowts/typography";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InlineTooltip } from "@/components/ui/tooltip";
import { LoadingButton } from "@/features/form/submit-button";
import { Form, useForm } from "@/features/form/tanstack-form";
import { uploadImageAction } from "@/features/images/upload-image.action";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { authClient } from "@/lib/auth-client";
import { displayName } from "@/lib/format/display-name";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import type { User } from "better-auth";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const ProfileFormSchema = z.object({
  name: z.string().nullable(),
  image: z.string().nullable(),
});

type ProfileFormType = z.infer<typeof ProfileFormSchema>;

type UserProfileFormProps = {
  defaultValues: User;
};

export const UserProfileForm = ({ defaultValues }: UserProfileFormProps) => {
  const router = useRouter();
  const params = useParams();
  const spaceSlug = params.spaceSlug as string;

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormType) => {
      return unwrapSafePromise(
        authClient.updateUser({
          name: values.name ?? "",
          image: values.image,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Profil mis à jour");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.set("files", file);

      return resolveActionResult(uploadImageAction({ formData }));
    },
    onSuccess: (data) => {
      form.setFieldValue("image", data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: ProfileFormSchema,
    defaultValues: {
      name: defaultValues.name,
      image: defaultValues.image ?? null,
    },
    onSubmit: async (values) => {
      await updateProfileMutation.mutateAsync(values);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(
        authClient.sendVerificationEmail({
          email: defaultValues.email,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Email de vérification envoyé");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Form form={form}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <form.AppField name="image">
              {(field) => (
                <AvatarUploader
                  onImageChange={(file) => uploadImageMutation.mutate(file)}
                  currentAvatar={field.state.value}
                />
              )}
            </form.AppField>

            <form.Subscribe selector={(state) => state.values.name}>
              {(name) => (
                <div>
                  <CardTitle>
                    {displayName({
                      email: defaultValues.email,
                      name: name,
                    })}
                  </CardTitle>
                  <Typography variant="muted" className="text-sm">
                    Votre profil utilisateur
                  </Typography>
                </div>
              )}
            </form.Subscribe>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form.AppField name="name">
            {(field) => (
              <field.Field>
                <field.Label>Nom</field.Label>
                <field.Content>
                  <field.Input placeholder="Votre nom" />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-4">
              <span>Email</span>
              {defaultValues.emailVerified ? (
                <InlineTooltip title="Email vérifié. Si vous changez d'email, vous devrez le vérifier à nouveau.">
                  <BadgeCheck size={16} className="text-primary" />
                </InlineTooltip>
              ) : (
                <LoadingButton
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => verifyEmailMutation.mutate()}
                  loading={verifyEmailMutation.isPending}
                >
                  Vérifier l&apos;email
                </LoadingButton>
              )}
            </Label>
            <Typography>{defaultValues.email}</Typography>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t pt-6">
          <Link
            className={buttonVariants({ size: "sm", variant: "outline" })}
            href={`/space/${spaceSlug}/settings/email`}
          >
            Changer d&apos;email
          </Link>
          <Link
            className={buttonVariants({ size: "sm", variant: "outline" })}
            href={`/space/${spaceSlug}/settings/password`}
          >
            Changer le mot de passe
          </Link>
          <div className="flex-1"></div>
          <form.SubmitButton>Enregistrer</form.SubmitButton>
        </CardFooter>
      </Card>
    </Form>
  );
};
