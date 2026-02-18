import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,

  product: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  customer: ["create", "read", "update", "delete"],
  transaction: ["create", "read", "update", "delete"],
  report: ["read"],
  user: [
    "create",
    "read",
    "update",
    "delete",
    "ban",
    "list",
    "get",
    "set-role",
    "impersonate",
    "set-password",
  ],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements,
  product: ["create", "read", "update", "delete"],
  category: ["create", "read", "update", "delete"],
  customer: ["create", "read", "update", "delete"],
  transaction: ["create", "read", "update", "delete"],
  report: ["read"],
  user: [
    "create",
    "read",
    "update",
    "delete",
    "ban",
    "list",
    "get",
    "set-role",
    "impersonate",
    "set-password",
  ],
});

export const user = ac.newRole({
  product: ["read"],
  category: ["read"],
  customer: ["create", "read", "update"],
  transaction: ["create", "read"],
  report: ["read"],
});
export const cashier = ac.newRole({
  product: ["read"],
  category: ["read"],
  customer: ["create", "read", "update"],
  transaction: ["create", "read"],
  report: ["read"],
});
