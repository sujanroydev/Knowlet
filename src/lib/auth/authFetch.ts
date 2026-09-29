let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  let response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  // Request succeeded.
  if (response.status !== 401) {
    return response;
  }

  // Try to refresh the access token.
  const refreshed = await refreshAccessToken();

  if (!refreshed) {
    // Refresh token is invalid/expired/revoked.
    window.location.href = "/signin";
    return response;
  }

  // Retry the original request with the newly-created access token.
  response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  return response;
}
