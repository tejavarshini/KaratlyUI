const AUGMONT_BASE_URL = import.meta.env.VITE_AUGMONT_BASE_URL || "https://uatbckend.karatly.net";

const post = async (path: string, body: Record<string, unknown>) => {
  try {
    const token = localStorage.getItem("authToken") || localStorage.getItem("jwt") || "";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${AUGMONT_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return await res.json();
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") {
      return { ok: false, message: "Request timed out. Please check your connection and try again." };
    }
    console.error(`transbankApi ${path} error:`, e);
    return { ok: false, message: "Network error. Please try again." };
  }
};

export const transbankValidatePan = ({ panNumber, name, mobile }: { panNumber: string; name: string; mobile: string }) =>
  post("/api/v1/kyc/pan/validate", { panNumber, name, mobile });

export const transbankAadhaarGenerateOtp = (aadhaarNumber: string) =>
  post("/api/v1/kyc/aadhaar/generate-otp", { aadhaarNumber });

export const transbankAadhaarSubmitOtp = (sessionId: string, otp: string, uniqueId: string, aadhaarNumber: string) =>
  post("/api/v1/kyc/aadhaar/submit-otp", { sessionId, otp, uniqueId, aadhaarNumber });

export const transbankValidateBankAccount = ({ accountName, accountNumber, ifscCode }: { accountName: string; accountNumber: string; ifscCode: string }) =>
  post("/api/v1/kyc/bank/validate", { accountName, accountNumber, ifscCode });
