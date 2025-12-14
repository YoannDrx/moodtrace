"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, useForm } from "@/features/form/tanstack-form";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email("Email invalide"),
});

type SchemaType = z.infer<typeof Schema>;

export const CaregiverInviteForm = () => {
  const [open, setOpen] = useState(false);
  const { data: activeOrg } = authClient.useActiveOrganization();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: SchemaType) => {
      const result = await authClient.organization.inviteMember({
        email: values.email,
        role: "member", // Les aidants sont toujours "member"
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("Invitation envoyée");
      setOpen(false);
      router.refresh();
    },
  });

  const form = useForm({
    schema: Schema,
    defaultValues: {
      email: "",
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button type="button">Inviter un proche</Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-md">
        <DialogHeader className="p-6">
          <div className="mt-4 flex justify-center">
            <Avatar className="size-16">
              {activeOrg?.logo ? (
                <AvatarImage src={activeOrg.logo} alt={activeOrg.name} />
              ) : null}
              <AvatarFallback>
                {activeOrg?.name.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <DialogTitle className="text-center">
            Inviter un proche aidant
          </DialogTitle>

          <DialogDescription className="text-center">
            Votre proche pourra consulter vos données de suivi et ajouter ses
            propres observations sur votre évolution.
          </DialogDescription>
        </DialogHeader>

        <div className="border-t p-6">
          <Form form={form}>
            <div className="flex flex-col gap-6">
              <form.AppField name="email">
                {(field) => (
                  <field.Field>
                    <field.Label>Email de votre proche</field.Label>
                    <field.Content>
                      <field.Input
                        type="email"
                        placeholder="proche@email.com"
                      />
                      <field.Description>
                        Votre proche recevra un email avec un lien pour
                        rejoindre votre espace.
                      </field.Description>
                      <field.Message />
                    </field.Content>
                  </field.Field>
                )}
              </form.AppField>

              <form.SubmitButton className="w-full">
                Envoyer l&apos;invitation
              </form.SubmitButton>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
