const BASE_URL =
  import.meta.env.VITE_GOLD_BASE_URL?.trim() ||
  "https://uatbckend.karatly.net";
const DEFAULT_MERCHANT_ID =
  import.meta.env.VITE_AUGMONT_MERCHANT_ID?.trim() || "11692";

const getJson = async (res: Response) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      status: "error",
      payload: { statusCode: res.status, message: text || "Invalid server response" }
    };
  }
};

const extractBackendMessage = (data: Record<string, unknown>, fallback = "Request failed") => {
  const payloadMessage = data?.payload as Record<string, unknown> | undefined;
  const responseBody = payloadMessage?.responseBody as string | undefined;

  if (typeof responseBody === "string") {
    try {
      const parsed = JSON.parse(responseBody);
      return parsed?.message || payloadMessage?.message || fallback;
    } catch {
      return responseBody || payloadMessage?.message || fallback;
    }
  }

  return (payloadMessage?.message as string) || (data?.message as string) || fallback;
};

const extractList = (data: Record<string, unknown>) => {
  const payload = data?.payload as Record<string, unknown> | undefined;
  const result = payload?.result as Record<string, unknown> | undefined;
  const list =
    result?.data ||
    result?.records ||
    result ||
    data?.data ||
    [];
  return Array.isArray(list) ? list : [];
};

const normalizeMasterItem = (item: Record<string, unknown>) => ({
  id: String(item?.id ?? item?.stateId ?? item?.cityId ?? item?.value ?? item?.masterId ?? ""),
  name: String(item?.name || item?.stateName || item?.cityName || item?.label || "")
});

const requestRegistrationApi = async (path: string, body: Record<string, unknown>, fallbackMessage: string) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ merchantId: DEFAULT_MERCHANT_ID, ...body })
  });

  const data = await getJson(res);

  if (!res.ok || data?.status === "error") {
    return { ok: false, message: extractBackendMessage(data, fallbackMessage), raw: data };
  }

  return { ok: true, data, raw: data };
};

export const fetchStates = async (name = "") => {
  const response = await requestRegistrationApi(
    "/api/v1/master/states",
    { page: 1, count: 100, name: String(name || "").trim() },
    "Failed to fetch states"
  );

  if (!response.ok) return { ...response, states: [] };

  return {
    ok: true,
    states: extractList(response.data)
      .map(normalizeMasterItem)
      .filter((item) => item.id && item.name),
    raw: response.raw
  };
};

export const fetchCities = async (stateId: string, name = "") => {
  const response = await requestRegistrationApi(
    "/api/v1/master/cities",
    { stateId, page: 1, count: 5, name: String(name || "").trim() },
    "Failed to fetch cities"
  );

  if (!response.ok) return { ...response, cities: [] };

  return {
    ok: true,
    cities: extractList(response.data)
      .map(normalizeMasterItem)
      .filter((item) => item.id && item.name),
    raw: response.raw
  };
};

export const createGoldUser = async (request: Record<string, unknown>) => {
  const response = await requestRegistrationApi(
    "/api/v1/users/create",
    { request },
    "Failed to create user"
  );

  if (!response.ok) return response;

  const payload = response.data?.payload as Record<string, unknown> | undefined;
  const result = payload?.result as Record<string, unknown> | undefined;
  const data = result?.data || result || response.data?.data || {};

  return {
    ok: true,
    data,
    message: (payload?.message as string) || (response.data?.message as string) || "User created successfully",
    raw: response.raw
  };
};
