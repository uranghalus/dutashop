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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDialog } from "@/context/dialog-provider";
import {
  useCreateCustomer,
  useUpdateCustomer,
} from "@/hooks/crud/use-customer";
import {
  CreateCustomerSchema,
  UpdateCustomerSchema,
} from "@/schema/customer-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type CustomerActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: any;
};

type CustomerFormValues =
  | z.infer<typeof CreateCustomerSchema>
  | z.infer<typeof UpdateCustomerSchema>;

export function CustomerActionDialog({
  open,
  onOpenChange,
  currentRow,
}: CustomerActionDialogProps) {
  const isEdit = !!currentRow;
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const formSchema = isEdit ? UpdateCustomerSchema : CreateCustomerSchema;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: currentRow?.name ?? "",
        email: currentRow?.email ?? "",
        phone: currentRow?.phone ?? "",
        address: currentRow?.address ?? "",
      });
    }
  }, [open, currentRow, form]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.email) formData.append("email", values.email);
      if (values.phone) formData.append("phone", values.phone);
      if (values.address) formData.append("address", values.address);

      if (isEdit && currentRow) {
        await updateMutation.mutateAsync({
          id: currentRow.id,
          formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Toast error is handled in hook
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
          <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update customer details." : "Create a new customer."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="customer-form"
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
                  <Input
                    {...field}
                    placeholder="Customer Name"
                    autoComplete="off"
                  />
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
                    placeholder="customer@example.com"
                    autoComplete="off"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Phone</FieldLabel>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="08123456789"
                    autoComplete="off"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Address</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Address..."
                    className="resize-none"
                  />
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

          <Button type="submit" form="customer-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
