"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createCategory } from "@/actions/category";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

// Submit button component using useFormStatus to show loading
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Category"}
    </Button>
  );
}

export default function CategoriesPage() {
  // ✅ Fix: Use undefined instead of null for initial state
  const initialState = { message: undefined, errors: {} };

  // ✅ Wrap createCategory to match expected useFormState signature
  const [state, dispatch] = useFormState(
    async (state: any, formData: FormData) => await createCategory(state, formData),
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  // Show toast message and reset form on success
  useEffect(() => {
    if (state.message) {
      if (state.message.startsWith("Success:")) {
        toast.success(state.message.replace("Success: ", ""));
        formRef.current?.reset(); // ✅ Clear form
      } else {
        toast.error(state.message.replace("Error: ", ""));
      }
    }
  }, [state]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      <form ref={formRef} action={dispatch} className="max-w-md space-y-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input id="name" name="name" type="text" required />
          {state.errors?.name && (
            <p className="text-red-500 text-sm mt-1">{state.errors.name[0]}</p>
          )}
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}