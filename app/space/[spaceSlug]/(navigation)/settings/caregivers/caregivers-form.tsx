"use client";

import { Loader } from "@/components/nowts/loader";
import { Typography } from "@/components/nowts/typography";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { InlineTooltip } from "@/components/ui/tooltip";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { openGlobalDialog } from "@/features/global-dialog/global-dialog.store";
import type { Invitation } from "@/generated/prisma";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { OrgMembers } from "@/query/org/get-orgs-members";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useMutation } from "@tanstack/react-query";
import { Copy, MoreVertical, Trash, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic } from "react";
import { toast } from "sonner";
import { useCurrentSpace } from "../../../use-current-space";
import { CaregiverInviteForm } from "./caregiver-invite-form";

type CaregiversFormProps = {
  members: OrgMembers;
  maxMembers: number;
  invitations: Invitation[];
};

export const CaregiversForm = ({
  maxMembers,
  members,
  invitations,
}: CaregiversFormProps) => {
  const router = useRouter();
  const session = useSession();
  const space = useCurrentSpace();
  const [optimisticMembers, updateOptimisticMembers] = useOptimistic(
    members,
    (state, update: { type: string; memberId: string; role?: string }) => {
      if (update.type === "DELETE") {
        return state.filter((member) => member.id !== update.memberId);
      } else if (update.type === "UPDATE_ROLE" && update.role) {
        return state.map((member) =>
          member.id === update.memberId
            ? { ...member, role: update.role ?? "member" }
            : member,
        );
      }
      return state;
    },
  );

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      if (!space?.id) {
        throw new Error("L'identifiant de l'espace est requis");
      }
      await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
        organizationId: space.id,
      });
      return memberId;
    },
    onMutate: (memberId) => {
      updateOptimisticMembers({ type: "DELETE", memberId });
    },
    onSuccess: () => {
      toast.success("Proche retiré avec succès");
      router.refresh();
    },
    onError: () => {
      toast.error("Impossible de retirer ce proche");
      router.refresh();
    },
  });

  const removeInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      await authClient.organization.cancelInvitation({
        invitationId,
      });
    },
    onSuccess: () => {
      toast.success("Invitation annulée");
      router.refresh();
    },
    onError: () => {
      toast.error("Impossible d'annuler l'invitation");
      router.refresh();
    },
  });

  const handleRemoveMember = (memberId: string) => {
    dialogManager.confirm({
      title: "Retirer ce proche",
      description:
        "Êtes-vous sûr de vouloir retirer ce proche aidant de votre espace ? Il n'aura plus accès à vos données de suivi.",
      action: {
        label: "Retirer",
        onClick: async () => {
          removeMemberMutation.mutate(memberId);
        },
      },
    });
  };

  // Séparer le patient (owner) des aidants
  const patient = optimisticMembers.find((m) => m.role.includes("owner"));
  const caregivers = optimisticMembers.filter((m) => !m.role.includes("owner"));

  return (
    <Card>
      <CardHeader className="flex w-full flex-row items-center gap-4 space-y-0">
        <div className="flex flex-col gap-2">
          <CardTitle>Mes proches aidants</CardTitle>
          <CardDescription>
            Invitez vos proches pour qu&apos;ils puissent suivre votre évolution
            et partager leurs observations.
          </CardDescription>
        </div>
        <div className="flex-1"></div>
        <div>
          {optimisticMembers.length < maxMembers ? (
            <CaregiverInviteForm />
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const dialogId = dialogManager.confirm({
                  title: "Limite de proches atteinte",
                  description: (
                    <>
                      <Typography>
                        Vous avez atteint le nombre maximum de proches aidants.
                        Passez au plan Pro pour inviter plus de proches.
                      </Typography>
                      <Alert className="flex flex-col gap-2">
                        <Progress
                          value={(optimisticMembers.length / maxMembers) * 100}
                        />
                        <Typography variant="small">
                          {caregivers.length} proche(s) sur {maxMembers - 1}{" "}
                          autorisé(s)
                        </Typography>
                      </Alert>
                    </>
                  ),
                  action: {
                    label: "Passer au plan Pro",
                    onClick: () => {
                      openGlobalDialog("org-plan");
                      dialogManager.close(dialogId);
                    },
                  },
                });
              }}
            >
              <Zap className="mr-2" size={16} />
              Inviter
            </Button>
          )}
        </div>
      </CardHeader>
      <Tabs defaultValue="caregivers" className="mt-4 gap-0">
        <TabsList className="flex gap-4 px-6">
          <TabsTrigger
            value="caregivers"
            className="text-muted-foreground hover:bg-accent/50 data-[state=active]:border-foreground translate-y-px rounded-t-md border-b px-3 py-2 text-sm transition"
          >
            Proches
          </TabsTrigger>
          <TabsTrigger
            value="invitations"
            className="text-muted-foreground hover:bg-accent/50 data-[state=active]:border-foreground translate-y-px rounded-t-md border-b px-3 py-2 text-sm transition"
          >
            Invitations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="caregivers" className="mt-0 border-t pt-4">
          <CardContent className="flex flex-col">
            {/* Patient (owner) */}
            {patient && (
              <div className="mb-4 border-b pb-4">
                <div className="my-2 flex flex-wrap items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {patient.user.email.slice(0, 2)}
                    </AvatarFallback>
                    {patient.user.image ? (
                      <AvatarImage src={patient.user.image} />
                    ) : null}
                  </Avatar>
                  <div>
                    <Typography className="text-sm font-medium">
                      {patient.user.name}
                    </Typography>
                    <Typography variant="muted">
                      {patient.user.email}
                    </Typography>
                  </div>
                  <div className="flex-1"></div>
                  <Badge variant="secondary">Patient</Badge>
                </div>
              </div>
            )}

            {/* Aidants */}
            {caregivers.length === 0 ? (
              <Typography variant="muted" className="py-4 text-center">
                Aucun proche aidant pour le moment. Invitez vos proches pour
                qu&apos;ils puissent suivre votre évolution.
              </Typography>
            ) : (
              caregivers.map((member) => {
                const isCurrentUser = member.user.id === session.data?.user.id;
                return (
                  <div key={member.id}>
                    <div className="my-2 flex flex-wrap items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {member.user.email.slice(0, 2)}
                        </AvatarFallback>
                        {member.user.image ? (
                          <AvatarImage src={member.user.image} />
                        ) : null}
                      </Avatar>
                      <div>
                        <Typography className="text-sm font-medium">
                          {member.user.name}
                        </Typography>
                        <Typography variant="muted">
                          {member.user.email}
                        </Typography>
                      </div>
                      <div className="flex-1"></div>

                      <InlineTooltip title="Proche aidant avec accès en lecture">
                        <Badge variant="outline">Aidant</Badge>
                      </InlineTooltip>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={async () =>
                              navigator.clipboard.writeText(member.id)
                            }
                          >
                            <Copy className="mr-2 size-4" />
                            Copier l&apos;identifiant
                          </DropdownMenuItem>
                          {!isCurrentUser && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                <Trash className="mr-2 size-4" />
                                Retirer
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </TabsContent>
        <TabsContent value="invitations" className="mt-0 border-t pt-4">
          <CardContent className="flex flex-col">
            {invitations.length === 0 ? (
              <Typography variant="muted" className="py-4 text-center">
                Aucune invitation en attente
              </Typography>
            ) : (
              <>
                {invitations.map((invitation) => {
                  if (invitation.status === "accepted") {
                    return null;
                  }
                  const isExpired = new Date(invitation.expiresAt) < new Date();
                  const isCanceled =
                    invitation.status === "canceled" || isExpired;
                  return (
                    <div key={invitation.id}>
                      <div className="my-2 flex flex-wrap items-center gap-2">
                        <Avatar>
                          <AvatarFallback>
                            {invitation.email.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2">
                          <Typography
                            className={cn("text-sm font-medium", {
                              "text-muted-foreground line-through": isCanceled,
                            })}
                          >
                            {invitation.email}
                          </Typography>

                          {isExpired ? (
                            <Badge variant="outline">Expirée</Badge>
                          ) : invitation.status === "pending" ? (
                            <Badge variant="outline">En attente</Badge>
                          ) : (
                            <Badge variant="outline">{invitation.status}</Badge>
                          )}
                        </div>
                        <div className="flex-1"></div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={async () =>
                                navigator.clipboard.writeText(invitation.id)
                              }
                            >
                              <Copy className="mr-2 size-4" />
                              Copier l&apos;identifiant
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.preventDefault();
                                return removeInvitationMutation.mutate(
                                  invitation.id,
                                );
                              }}
                            >
                              {removeInvitationMutation.isPending ? (
                                <Loader className="mr-2 size-4" />
                              ) : (
                                <Trash className="mr-2 size-4" />
                              )}
                              Annuler
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
