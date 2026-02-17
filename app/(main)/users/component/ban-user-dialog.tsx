"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDialog } from "@/context/dialog-provider";
import { useBanUser, useUnbanUser } from "@/hooks/crud/use-user";
import { BanUserSchema } from "@/schema/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiLoader4Line } from "@remixicon/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

export function BanUserDialog() {
  const { open, setOpen, currentRow } = useDialog();
  const { mutate: ban, isPending: isBanPending } = useBanUser();

  // Safety check
  const user = currentRow as any;
  const isBanned = user?.banned;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof BanUserSchema>>({
    resolver: zodResolver(BanUserSchema),
    defaultValues: {
      userId: "",
      banReason: "",
    },
  });

  const onSubmit = (values: z.infer<typeof BanUserSchema>) => {
    ban(
      { userId: user.id, banReason: values.banReason || "Banned by admin" },
      {
        onSuccess: () => {
          setOpen(null);
          reset();
        },
      },
    );
  };

  return (
    <Dialog open={open === "ban"} onOpenChange={() => setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban Pengguna</DialogTitle>
          <DialogDescription>Nonaktifkan akses pengguna ini.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              control={control}
              name="banReason"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Alasan Ban</FieldLabel>
                  <Input placeholder="Melanggar peraturan..." {...field} />
                  <FieldError errors={[errors.banReason]} />
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" variant="destructive" disabled={isBanPending}>
              {isBanPending && (
                <RiLoader4Line className="mr-2 size-4 animate-spin" />
              )}
              Ban Pengguna
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UnbanUserDialog() {
  const { open, setOpen, currentRow } = useDialog();
  const { mutate: unban, isPending: isUnbanPending } = useUnbanUser();
  const user = currentRow as any;

  const handleUnban = () => {
    if (user?.id) {
      unban(user.id, {
        onSuccess: () => {
          setOpen(null);
        },
      });
    }
  };

  return (
    <Dialog open={open === "unban"} onOpenChange={() => setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unban Pengguna</DialogTitle>
          <DialogDescription>
            Apakah anda yakin ingin memulihkan akses pengguna{" "}
            <span className="font-medium">{user?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={handleUnban} disabled={isUnbanPending}>
            {isUnbanPending && (
              <RiLoader4Line className="mr-2 size-4 animate-spin" />
            )}
            Unban Pengguna
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
