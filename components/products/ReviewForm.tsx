"use client";

import { createReview } from "@/actions/review";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
// ✅ Fix: Imported useActionState from react
import { useEffect, useRef, useState, useActionState } from "react";
// ✅ Fix: Removed useFormState from this import
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

// Component to show the submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus(); // Indicates if the form is submitting
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit Review"}
    </Button>
  );
}

// Main ReviewForm component
export function ReviewForm({ productId }: { productId: string }) {
  // Initial form state
  const initialState = { error: undefined, success: undefined, errors: {} };

  // ✅ Fix: Renamed useFormState to useActionState
  const [state, dispatch] = useActionState(createReview, initialState);

  // Reference to the form to reset it later
  const formRef = useRef<HTMLFormElement>(null);

  // Rating and hover states for the star UI
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Show toast messages based on success or error
  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      formRef.current?.reset(); // Clear the form
      setRating(0); // Reset star rating
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={dispatch}
      className="space-y-4 bg-muted p-6 rounded-xl shadow"
    >
      {/* Hidden inputs to pass productId and selected rating to server action */}
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      {/* Star Rating UI */}
      <div>
        <Label>Rating</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`cursor-pointer h-6 w-6 transition-colors ${
                (hoverRating || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
        {/* Validation error message for rating */}
        {state.errors?.rating && (
          <p className="text-red-500 text-sm mt-1">
            {state.errors.rating[0]}
          </p>
        )}
      </div>

      {/* Comment textarea */}
      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Share your experience..."
          required
        />
        {/* Validation error message for comment */}
        {state.errors?.comment && (
          <p className="text-red-500 text-sm mt-1">
            {state.errors.comment[0]}
          </p>
        )}
      </div>

      {/* Submit button */}
      <SubmitButton />
    </form>
  );
}