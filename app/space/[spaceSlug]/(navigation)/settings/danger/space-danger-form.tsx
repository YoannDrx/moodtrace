"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { Form, useForm } from "@/features/form/tanstack-form";
import { authClient } from "@/lib/auth-client";
import { formatId } from "@/lib/format/id";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrentSpace } from "../../../use-current-space";
import type { SpaceDangerFormSchemaType } from "../space.schema";
import { SpaceDangerFormSchema } from "../space.schema";

type SpaceDangerFormProps = {
  defaultValues: SpaceDangerFormSchemaType;
};

export const SpaceDangerForm = ({ defaultValues }: SpaceDangerFormProps) => {
  const router = useRouter();
  const space = useCurrentSpace();

  const mutation = useMutation({
    mutationFn: async (values: SpaceDangerFormSchemaType) => {
      if (!space?.id) {
        throw new Error("L'identifiant de l'espace est requis");
      }
      return unwrapSafePromise(
        authClient.organization.update({
          data: {
            slug: values.slug,
          },
          organizationId: space.id,
        }),
      );
    },
    onSuccess: (data) => {
      const newUrl = window.location.href.replace(
        `/space/${defaultValues.slug}/`,
        `/space/${data.slug}/`,
      );
      router.push(newUrl);
      form.reset();
      toast.success("Identifiant mis à jour");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: SpaceDangerFormSchema,
    defaultValues,
    onSubmit: async (values) => {
      dialogManager.confirm({
        title: "Êtes-vous sûr ?",
        description:
          "Vous êtes sur le point de modifier l'identifiant unique de votre espace. Toutes les URLs précédentes seront invalides.",
        action: {
          label: "Oui, modifier l'identifiant",
          onClick: () => {
            mutation.mutate(values);
          },
        },
      });
    },
  });

  return (
    <Form form={form}>
      <div className="flex w-full flex-col gap-6 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Identifiant de l&apos;espace</CardTitle>
            <CardDescription>
              L&apos;identifiant est utilisé dans toutes les URLs de votre
              espace. Si vous le modifiez, tous vos liens existants seront
              invalides.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField name="slug">
              {(field) => (
                <field.Field>
                  <field.Content>
                    <field.Input
                      type="text"
                      placeholder="mon-espace-sante"
                      onChange={(e) => {
                        const slug = formatId(e.target.value);
                        field.handleChange(slug);
                      }}
                    />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>
          </CardContent>
          <CardFooter className="flex justify-end border-t">
            <form.SubmitButton>Enregistrer</form.SubmitButton>
          </CardFooter>
        </Card>
      </div>
    </Form>
  );
};
