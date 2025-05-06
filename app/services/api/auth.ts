// Authentication-related API service functions

/**
 * Update user metadata
 */
export const updateUserMetadata = async (userId: string, metadata: any) => {
  const response = await fetch("/api/update-user-metadata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      metadata,
    }),
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to update user metadata");
  return response.json();
};
