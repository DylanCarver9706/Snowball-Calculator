// Subscription-related API service functions

/**
 * Check subscription status
 */
export const checkSubscription = async (subscriptionId: string) => {
  const response = await fetch(
    `/api/check-subscription?subscriptionId=${subscriptionId}`,
    { credentials: "include" }
  );

  if (!response.ok) throw new Error("Failed to fetch subscription status");
  return response.json();
};

/**
 * Create a new subscription
 */
export const createSubscription = async (data: {
  cardToken: string;
  priceId: string;
  email: string;
  userId: string;
}) => {
  const response = await fetch("/api/create-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to create subscription");
  return result;
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (subscriptionId: string) => {
  const response = await fetch("/api/cancel-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscriptionId,
    }),
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to cancel subscription");
  return response.json();
};

/**
 * Reactivate a subscription
 */
export const reactivateSubscription = async (subscriptionId: string) => {
  const response = await fetch("/api/reactivate-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscriptionId,
    }),
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to reactivate subscription");
  return response.json();
};
