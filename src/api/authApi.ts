import { buildMobileDobUniqueId } from "../lib/uniqueId";

const BASE_URL =
  import.meta.env.VITE_AUTH_BASE_URL?.trim() ||
  "https://uatauthbckend.karatly.net";

const USER_PROFILE_KEY = "userProfile";

const getJson = async (res: Response) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      success: false,
      message: text || "Invalid server response"
    };
  }
};

const normalizeError = (error: unknown, fallbackMessage: string) => ({
  success: false,
  ok: false,
  message:
    error instanceof Error && error.message === "Failed to fetch"
      ? `Cannot reach auth backend at ${BASE_URL}. Make sure the backend server is running and CORS allows this frontend origin.`
      : error instanceof Error ? error.message : fallbackMessage
});

const extractProfileFromAuthResponse = (data: Record<string, unknown>) => {
  const user =
    (data as Record<string, unknown>)?.userInfo as Record<string, unknown> | undefined ||
    (data as Record<string, unknown>)?.user as Record<string, unknown> | undefined ||
    (data as Record<string, unknown>)?.payload as Record<string, unknown> | undefined;

  const userObj = user || {};

  return {
    fullName:
      (userObj as Record<string, unknown>)?.fullName as string ||
      (userObj as Record<string, unknown>)?.name as string ||
      "",
    email:
      (userObj as Record<string, unknown>)?.email as string ||
      (userObj as Record<string, unknown>)?.emailId as string ||
      "",
    mobileNumber:
      (userObj as Record<string, unknown>)?.mobileNumber as string ||
      (userObj as Record<string, unknown>)?.mobile as string ||
      "",
    pinCode:
      (userObj as Record<string, unknown>)?.pinCode as string ||
      (userObj as Record<string, unknown>)?.pincode as string ||
      "",
    dateOfBirth:
      (userObj as Record<string, unknown>)?.dateOfBirth as string ||
      (userObj as Record<string, unknown>)?.dob as string ||
      "",
    uniqueId:
      (userObj as Record<string, unknown>)?.augmontUniqueId as string ||
      (userObj as Record<string, unknown>)?.uniqueId as string ||
      "",
    partnerUserId:
      (userObj as Record<string, unknown>)?.partnerUserId as string || "",
    panVerified:    Boolean((userObj as Record<string, unknown>)?.panVerified),
    aadhaarVerified: Boolean((userObj as Record<string, unknown>)?.aadhaarVerified),
    bankVerified:   Boolean((userObj as Record<string, unknown>)?.bankVerified),
    kycStatus:      String((userObj as Record<string, unknown>)?.kycStatus || ""),
    profilePhoto:   (userObj as Record<string, unknown>)?.profilePhoto as string | null || null,
  };
};

export const setAuthSession = (token: string) => {
  if (!token) return;
  localStorage.setItem("token", token);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.removeItem("goldBalance");
  localStorage.removeItem("goldPrice");
  localStorage.removeItem("augmontUser");
};

export const getUserProfile = () => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setUserProfile = (profile: Record<string, unknown> = {}) => {
  const existingProfile = getUserProfile() || {};
  const nextMobileNumber =
    String(profile?.mobileNumber ?? existingProfile?.mobileNumber ?? "").trim();
  const nextDateOfBirth =
    String(profile?.dateOfBirth ?? existingProfile?.dateOfBirth ?? existingProfile?.dob ?? "").trim();
  const generatedUniqueId = buildMobileDobUniqueId({
    mobileNumber: nextMobileNumber,
    dateOfBirth: nextDateOfBirth
  });
  const nextProfile = {
    fullName: String(profile?.fullName ?? existingProfile?.fullName ?? "").trim(),
    email: String(profile?.email ?? existingProfile?.email ?? "").trim(),
    mobileNumber: nextMobileNumber,
    pinCode: String(profile?.pinCode ?? existingProfile?.pinCode ?? "").trim(),
    dateOfBirth: nextDateOfBirth,
    uniqueId: String(profile?.uniqueId ?? generatedUniqueId ?? existingProfile?.uniqueId ?? "").trim(),
    partnerUserId: String(profile?.partnerUserId ?? existingProfile?.partnerUserId ?? "").trim(),
    panVerified: Boolean(profile?.panVerified ?? existingProfile?.panVerified ?? false),
    aadhaarVerified: Boolean(profile?.aadhaarVerified ?? existingProfile?.aadhaarVerified ?? false),
    bankVerified: Boolean(profile?.bankVerified ?? existingProfile?.bankVerified ?? false),
    kycStatus: String(profile?.kycStatus ?? existingProfile?.kycStatus ?? ""),
    profilePhoto: (profile?.profilePhoto ?? existingProfile?.profilePhoto ?? null) as string | null,
  };

  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(nextProfile));
  if (nextProfile.profilePhoto) {
    localStorage.setItem("profilePhoto", nextProfile.profilePhoto);
  }
  return nextProfile;
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem(USER_PROFILE_KEY);
  localStorage.removeItem("goldBalance");
  localStorage.removeItem("primaryBank");
  localStorage.removeItem("primaryBankId");
  localStorage.removeItem("profilePhoto");
  localStorage.removeItem("augmontUser");
};

export const getAuthToken = () => localStorage.getItem("token");

export const isAuthenticated = () =>
  localStorage.getItem("isLoggedIn") === "true" && Boolean(getAuthToken());

export const sendOtp = async ({
  mobileNumber,
  email,
  fullName,
  type = "login"
}: {
  mobileNumber: string;
  email: string;
  fullName?: string;
  type?: "login" | "register";
}) => {
  try {
    const endpoint =
      type === "register"
        ? "/auth/register/send-otp"
        : "/auth/login/send-otp";

    const body =
      type === "register"
        ? { mobileNumber, email, emailId: email, fullName, userName: fullName }
        : { mobileNumber, email };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await getJson(res);
    return { ok: res.ok, ...data };
  } catch (error) {
    console.error("Send OTP Error:", error);
    return normalizeError(error, "Unable to send OTP");
  }
};

const formatDateOfBirthForAuth = (value: string) => {
  const dateValue = String(value || "").trim();
  const isoMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!isoMatch) return dateValue;
  const [, year, month, day] = isoMatch;
  return `${day}-${month}-${year}`;
};

export const verifyOtp = async ({
  mobileNumber,
  otp,
  type = "login",
  email,
  fullName,
  dateOfBirth
}: {
  mobileNumber: string;
  otp: string;
  type?: "login" | "register";
  email: string;
  fullName?: string;
  dateOfBirth?: string;
}) => {
  try {
    const endpoint =
      type === "register"
        ? "/auth/register/verify-otp"
        : "/auth/login/verify-otp";

    const body: Record<string, unknown> =
      type === "register"
        ? { fullName, email, mobileNumber, otp, dateOfBirth: formatDateOfBirthForAuth(dateOfBirth || "") }
        : { mobileNumber, otp, email };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await getJson(res);

    if (res.status === 403) {
      const msg = String(data?.message || data?.payload?.message || "").toLowerCase();
      const is24hBlock =
        msg.includes("already logged in") ||
        msg.includes("24 hour") ||
        msg.includes("session") ||
        data?.code === "SESSION_EXISTS";

      if (is24hBlock) {
        return {
          ok: false,
          code: "SESSION_EXISTS",
          message:
            "You are already logged in on another device. Only one active session is allowed per 24 hours. Please try again later or contact support."
        };
      }
    }

    if (!res.ok) {
      return {
        ok: false,
        message: data?.message || data?.payload?.message || `OTP verification failed (${res.status}).`
      };
    }

    const token =
      data?.payload?.token ||
      data?.token ||
      data?.data?.token ||
      data?.payload?.result?.token ||
      null;

    if (!token) {
      return { ok: false, message: "No token returned from server." };
    }

    const userInfo =
      data?.userInfo ||
      data?.payload?.user ||
      data?.user ||
      data?.data?.user ||
      data?.payload?.result?.user ||
      {};

    const uniqueId =
      userInfo?.augmontUniqueId ||
      data?.payload?.uniqueId ||
      data?.uniqueId ||
      userInfo?.uniqueId ||
      null;

    const partnerUserId =
      data?.payload?.partnerUserId ||
      data?.partnerUserId ||
      userInfo?.partnerUserId ||
      "";

    setAuthSession(token);
    setUserProfile({
      fullName: userInfo?.fullName || userInfo?.name || userInfo?.userName || "",
      email: userInfo?.email || userInfo?.emailId || "",
      mobileNumber: userInfo?.mobile || userInfo?.mobileNumber || mobileNumber,
      dateOfBirth: userInfo?.dateOfBirth || dateOfBirth,
      uniqueId: uniqueId || "",
      partnerUserId
    });

    return { ok: true, token, userInfo, uniqueId, partnerUserId };
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return normalizeError(error, "Unable to verify OTP");
  }
};

export const validateToken = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      return { ok: false, valid: false, message: "No token found" };
    }

    const res = await fetch(`${BASE_URL}/auth/validate-token`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await getJson(res);
    const backendProfile = extractProfileFromAuthResponse(data as Record<string, unknown>);

    if (res.ok) {
      setUserProfile(backendProfile as unknown as Record<string, unknown>);
    }

    return { ok: res.ok, valid: res.ok, ...data };
  } catch (error) {
    console.error("Validate Token Error:", error);
    return normalizeError(error, "Unable to validate token");
  }
};
