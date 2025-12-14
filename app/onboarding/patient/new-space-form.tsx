"use client";

import { Typography } from "@/components/nowts/typography";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, useForm } from "@/features/form/tanstack-form";
import { useDebounceFn } from "@/hooks/use-debounce-fn";
import { authClient } from "@/lib/auth-client";
import { formatId } from "@/lib/format/id";
import { useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { CreateSpaceSchemaType } from "./new-space.schema";
import { CreateSpaceSchema } from "./new-space.schema";

export const NewSpaceForm = () => {
  const mutation = useMutation({
    mutationFn: async (values: CreateSpaceSchemaType) => {
      const result = await authClient.organization.create({
        name: values.name,
        slug: values.slug,
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("Votre espace a été créé avec succès");
      window.location.href = `/space/${result.data.slug}`;
    },
  });

  const form = useForm({
    schema: CreateSpaceSchema,
    defaultValues: {
      name: "",
      slug: "",
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  const checkSlugMutation = useMutation({
    mutationFn: async (slug: string) => {
      const { data, error } = await authClient.organization.checkSlug({
        slug,
      });

      if (error) {
        form.fieldInfo.slug.instance?.setErrorMap({
          onChange: "Cet identifiant est déjà utilisé",
        });
      }

      return data;
    },
  });

  const debouncedCheckSlug = useDebounceFn((slug: string) => {
    if (slug) {
      checkSlugMutation.mutate(slug);
    }
  }, 500);

  useEffect(() => {
    const unsubscribe = form.store.subscribe(() => {
      const slug = form.getFieldValue("slug");
      if (slug) {
        debouncedCheckSlug(slug);
      }
    });

    return unsubscribe;
  }, [form, debouncedCheckSlug]);

  return (
    <div className="flex w-full flex-col gap-6 lg:gap-8">
      <Card className="bg-card overflow-hidden">
        <div className="bg-primary/5 border-b p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
              <Heart className="text-primary size-5" />
            </div>
            <div>
              <Typography variant="h4">Votre espace personnel</Typography>
              <Typography variant="muted" className="text-sm">
                Un endroit pour suivre votre bien-être au quotidien
              </Typography>
            </div>
          </div>
        </div>
        <Form form={form}>
          <CardContent className="mt-6 flex flex-col gap-4 lg:gap-6">
            <form.AppField name="name">
              {(field) => (
                <field.Field>
                  <field.Label>Nom de votre espace</field.Label>
                  <field.Content>
                    <field.Input
                      type="text"
                      className="input"
                      placeholder="Ex: Mon suivi santé"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.handleChange(value);
                        const formattedSlug = formatId(value);
                        form.setFieldValue("slug", formattedSlug);
                        debouncedCheckSlug(formattedSlug);
                      }}
                    />
                    <field.Description>
                      Choisissez un nom qui vous parle. Seuls vous et vos
                      proches aidants le verront.
                    </field.Description>
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>
            <form.AppField name="slug">
              {(field) => (
                <field.Field>
                  <field.Label>Identifiant</field.Label>
                  <field.Content>
                    <field.Input
                      type="text"
                      className="input"
                      placeholder="mon-suivi-sante"
                      onChange={(e) => {
                        const formattedSlug = formatId(e.target.value);
                        field.handleChange(formattedSlug);
                        form.setFieldValue("slug", formattedSlug);
                        debouncedCheckSlug(formattedSlug);
                      }}
                    />
                    <field.Description>
                      Cet identifiant unique apparaîtra dans l&apos;URL de votre
                      espace.
                    </field.Description>
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>
          </CardContent>
          <CardFooter className="border-border flex justify-end border-t pt-6">
            <form.SubmitButton size="lg" disabled={checkSlugMutation.isPending}>
              Créer mon espace
            </form.SubmitButton>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
};
