"use client";

// ✅ Fix: Removed useFormState from react-dom
import { useFormStatus } from "react-dom";
// ✅ Fix: Imported useActionState from react
import { useEffect, useRef, useActionState } from "react";

import { createProduct } from "@/actions/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating Product..." : "Create Product"}
    </Button>
  );
}

export default function NewProductForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const initialState = { message: undefined, errors: {} };

  // ✅ Fix: Renamed useFormState to useActionState
  const [state, dispatch] = useActionState(
    async (prevState: any, formData: FormData) => await createProduct(prevState, formData),
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.message.startsWith("Success:")) {
        toast.success(state.message.replace("Success: ", ""));
        formRef.current?.reset();
      } else {
        toast.error(state.message.replace("Error: ", ""));
      }
    }
  }, [state]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form
        ref={formRef}
        action={dispatch}
        className="max-w-2xl space-y-6"
        // ✅ Fix: Removed the unnecessary encType prop
      >
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" type="text" required />
          {state.errors?.name && (
            <p className="text-red-500 text-sm mt-1">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" required />
          {state.errors?.price && (
            <p className="text-red-500 text-sm mt-1">{state.errors.price[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="categoryId" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.categoryId && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.categoryId[0]}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="images">Product Images</Label>
          <Input id="images" name="images" type="file" multiple required />
          {state.errors?.images && (
            <p className="text-red-500 text-sm mt-1">{state.errors.images[0]}</p>
          )}
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}