"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUser, useUpdateUser } from "@/hooks/crud/use-user";
import { CreateUserSchema, UpdateUserSchema } from "@/schema/user-schema";
import { useEffect } from "react";

type UserActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: any; // Using any for now to match pattern, should ideally be User type
};

// Union type for form values
type UserFormValues =
  | z.infer<typeof CreateUserSchema>
  | z.infer<typeof UpdateUserSchema>;

export function UserActionDialog({
  open,
  onOpenChange,
  currentRow,
}: UserActionDialogProps) {
  const isEdit = !!currentRow;
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  // Determine schema based on mode
  const formSchema = isEdit ? UpdateUserSchema : CreateUserSchema;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      // password is only for create, but we need to initialize it to empty for TS if inferred
      ...(isEdit ? {} : { password: "" }),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: currentRow?.name ?? "",
        email: currentRow?.email ?? "",
        role: currentRow?.role ?? "user",
        ...(isEdit ? {} : { password: "" }),
      });
    }
  }, [open, currentRow, form, isEdit]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: UserFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("role", values.role);

      if (isEdit && currentRow) {
        // For update, we don't send password
        await updateMutation.mutateAsync({
          id: currentRow.id,
          formData,
        });
        toast.success("User updated successfully");
      } else {
        // For create, we send password
        if ("password" in values) {
          formData.append("password", values.password);
        }
        await createMutation.mutateAsync(formData);
        toast.success("User created successfully");
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update user details."
              : "Create a new user to the system."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="user-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...field} placeholder="John Doe" autoComplete="off" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="off"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Password field only shown in Create mode */}
            {!isEdit && (
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      autoComplete="new-password"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            )}

            <Controller
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Role</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset
          </Button>

          <Button type="submit" form="user-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
