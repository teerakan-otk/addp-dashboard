// Helper function for clean fallback logic
export function getDefaultMessage(status: number) {
  const map: Record<number, string> = {
    400: "The request was invalid. Please check your input.",
    401: "Your session has expired. Please log in again.",
    403: "You don't have permission to perform this action.",
    404: "The requested resource could not be found.",
    500: "The server encountered an error. We're looking into it!",
    503: "The service is temporarily unavailable. Try again in a minute.",
  };
  return map[status] || "An unexpected error occurred.";
}
