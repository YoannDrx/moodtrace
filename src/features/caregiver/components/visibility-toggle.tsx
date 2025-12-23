"use client";

import { Typography } from "@/components/nowts/typography";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EyeOff } from "lucide-react";

type VisibilityToggleProps = {
  isHidden: boolean;
  onToggle: (hidden: boolean) => void;
  disabled?: boolean;
};

export const VisibilityToggle = ({
  isHidden,
  onToggle,
  disabled,
}: VisibilityToggleProps) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <EyeOff className="text-muted-foreground mt-0.5 size-5" />
        <div className="space-y-1">
          <Label htmlFor="visibility-toggle">Cacher au patient</Label>
          <Typography variant="muted" className="text-sm">
            Cette observation restera privée et ne sera pas visible par le
            patient.
          </Typography>
        </div>
      </div>
      <Switch
        id="visibility-toggle"
        checked={isHidden}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
    </div>
  );
};
