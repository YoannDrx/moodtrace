"use client";

import { Button } from "@/components/ui/button";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { MedicationForm } from "@/features/medication/medication-form";
import { MedicationList } from "@/features/medication/medication-list";
import type { Medication } from "@/generated/prisma";
import { Pill, Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Typography } from "@/components/nowts/typography";
import { useQuery } from "@tanstack/react-query";
import { upfetch } from "@/lib/up-fetch";
import { Loader2 } from "lucide-react";

export default function MedicationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(
    null,
  );

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ["medications"],
    queryFn: async () => {
      const response = await upfetch("/api/medications");
      return response as Medication[];
    },
  });

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingMedication(null);
  };

  return (
    <Layout size="default">
      <LayoutHeader>
        <LayoutTitle className="flex items-center gap-2">
          <Pill className="text-primary size-6" />
          Mes médicaments
        </LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 size-4" />
          Ajouter
        </Button>
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-6">
        <Typography variant="muted">
          Gérez vos médicaments pour suivre leur impact sur votre humeur.
        </Typography>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-muted-foreground size-8 animate-spin" />
          </div>
        ) : (
          <MedicationList medications={medications} onEdit={handleEdit} />
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingMedication
                  ? "Modifier le médicament"
                  : "Ajouter un médicament"}
              </DialogTitle>
            </DialogHeader>
            <MedicationForm
              initialData={
                editingMedication
                  ? {
                      id: editingMedication.id,
                      name: editingMedication.name,
                      molecule: editingMedication.molecule,
                      dosageMg: editingMedication.dosageMg,
                      frequency: editingMedication.frequency,
                      timeOfDay: editingMedication.timeOfDay,
                      startDate: new Date(editingMedication.startDate)
                        .toISOString()
                        .split("T")[0],
                      endDate: editingMedication.endDate
                        ? new Date(editingMedication.endDate)
                            .toISOString()
                            .split("T")[0]
                        : null,
                      notes: editingMedication.notes,
                    }
                  : undefined
              }
              onSuccess={handleClose}
              onCancel={handleClose}
            />
          </DialogContent>
        </Dialog>
      </LayoutContent>
    </Layout>
  );
}
