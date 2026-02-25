import { getCsrfTokenFromServer } from "./api";

let bootstrapPromise: Promise<string> | null = null;

export function bootstrapCsrfToken() {
  if (!bootstrapPromise) {
    bootstrapPromise = getCsrfTokenFromServer(true).catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }

  return bootstrapPromise;
}
