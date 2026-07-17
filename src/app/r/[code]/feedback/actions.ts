"use server";

import { submitFeedback } from "@/lib/data";

export async function submitFeedbackAction(
  code: string,
  rating: number,
  message: string,
): Promise<void> {
  await submitFeedback(code, rating, message);
}
