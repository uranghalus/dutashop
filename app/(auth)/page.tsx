import { Suspense } from "react";
import LoginForm from "@/components/login-form";

export default function SigninPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
