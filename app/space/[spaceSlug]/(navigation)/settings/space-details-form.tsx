"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, useForm } from "@/features/form/tanstack-form";
import { ImageFormItem } from "@/features/images/image-form-item";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrentSpace } from "../../use-current-space";
import {
  SpaceDetailsFormSchema,
  type SpaceDetailsFormSchemaType,
} from "./space.schema";

type SpaceDetailsFormProps = {
  defaultValues: SpaceDetailsFormSchemaType;
};

export const SpaceDetailsForm = ({ defaultValues }: SpaceDetailsFormProps) => {
  const router = useRouter();
  const space = useCurrentSpace();
  const mutation = useMutation({
    mutationFn: async (values: SpaceDetailsFormSchemaType) => {
      if (!space?.id) {
        throw new Error("L'identifiant de l'espace est requis");
      }

      return unwrapSafePromise(
        authClient.organization.update({
          data: {
            logo: values.logo ?? undefined,
            name: values.name,
          },
          organizationId: space.id,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Espace mis à jour");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: SpaceDetailsFormSchema,
    defaultValues,
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  return (
    <Form form={form}>
      <div className="flex w-full flex-col gap-6 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Image</CardTitle>
            <CardDescription>
              Ajoutez une image personnalisée à votre espace de suivi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField name="logo">
              {(field) => (
                <field.Field>
                  <field.Content>
                    <ImageFormItem
                      className="size-32 rounded-full"
                      onChange={(url) => field.setValue(url)}
                      imageUrl={field.state.value}
                    />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nom de l&apos;espace</CardTitle>
            <CardDescription>
              Le nom de votre espace de suivi. Ce nom sera visible par vous et
              vos proches aidants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField name="name">
              {(field) => (
                <field.Field>
                  <field.Content>
                    <field.Input placeholder="Mon espace santé" />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>
          </CardContent>
        </Card>
        <Card className="flex items-end p-6">
          <form.SubmitButton className="w-fit">Enregistrer</form.SubmitButton>
        </Card>
      </div>
    </Form>
  );
};
