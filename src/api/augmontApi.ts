const BASE_URL =
  import.meta.env.VITE_AUGMONT_BASE_URL?.trim() ||
  "https://uatbckend.karatly.net";
const DEFAULT_MERCHANT_ID =
  import.meta.env.VITE_AUGMONT_MERCHANT_ID?.trim() || "11692";
const AUGMONT_SESSION_KEY = "augmontSession";
const LIVE_GOLD_RATE_HISTORY_KEY = "liveGoldRateHistory";
const LIVE_GOLD_RATE_HISTORY_LIMIT = 12;
const AUGMONT_USER_KEY = "augmontUser";
const AUGMONT_ORDER_REFERENCES_KEY = "augmontOrderReferences";
const RATE_CACHE_TTL_MS = 30 * 1000;
const RATE_CACHE_PREFIX = "augmontRateCache:";

const rateCacheMemory = new Map();
const rateRequestsInFlight = new Map();

const getRateCacheKey = (name: string, params: Record<string, unknown> = {}) =>
  `${RATE_CACHE_PREFIX}${name}:${JSON.stringify(params)}`;

const readRateCache = (name: string, params: Record<string, unknown> = {}) => {
  const key = getRateCacheKey(name, params);
  const memoryEntry = rateCacheMemory.get(key);
  if (memoryEntry) return memoryEntry;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    rateCacheMemory.set(key, entry);
    return entry;
  } catch {
    return null;
  }
};

const writeRateCache = (name: string, params: Record<string, unknown>, value: unknown) => {
  const key = getRateCacheKey(name, params);
  const entry = { storedAt: Date.now(), value };
  rateCacheMemory.set(key, entry);
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    /* localStorage can fail in private mode */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("augmontRatesUpdated", { detail: { name, params, storedAt: entry.storedAt } }));
  }
  return value;
};

const getValidCachedRate = (name: string, params: Record<string, unknown> = {}) => {
  const entry = readRateCache(name, params);
  if (!entry) return null;
  return Date.now() - Number(entry.storedAt || 0) < RATE_CACHE_TTL_MS ? entry.value : null;
};

const getAnyCachedRate = (name: string, params: Record<string, unknown> = {}) =>
  readRateCache(name, params)?.value || null;

const withRateCache = async (
  name: string,
  params: Record<string, unknown>,
  loader: () => Promise<unknown>,
  { force = false, allowNetwork = true } = {}
) => {
  if (!force) {
    const cached = getValidCachedRate(name, params);
    if (cached) return { ...cached, fromCache: true };
  }
  const key = getRateCacheKey(name, params);
  if (!force && rateRequestsInFlight.has(key)) {
    const response = await rateRequestsInFlight.get(key);
    return { ...response, fromCache: true };
  }
  if (!allowNetwork) {
    const cached = getAnyCachedRate(name, params);
    return cached
      ? { ...cached, fromCache: true, stale: !getValidCachedRate(name, params) }
      : { ok: false, fromCache: true, message: "Cached rate data is unavailable" };
  }
  const request = loader()
    .then((response) => writeRateCache(name, params, response))
    .finally(() => rateRequestsInFlight.delete(key));
  rateRequestsInFlight.set(key, request);
  return request;
};

const getJson = async (res: Response) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { status: "error", payload: { statusCode: res.status, message: text || "Invalid server response" } };
  }
};

const extractMessageFromHtml = (html: string) => {
  if (typeof html !== "string" || !html.includes("<")) return null;
  const msgMatch = html.match(/<b>Message<\/b>\s*([^<]+)/i);
  if (msgMatch) return msgMatch[1].trim();
  const descMatch = html.match(/<b>Description<\/b>\s*([^<]+)/i);
  if (descMatch) return descMatch[1].trim();
  return null;
};

const extractBackendMessage = (data: Record<string, unknown>, fallback = "Request failed") => {
  const payload = data?.payload as Record<string, unknown> | undefined;
  const payloadMessage = payload?.message as string | undefined;
  const htmlMessage = payloadMessage ? extractMessageFromHtml(payloadMessage) : null;
  if (htmlMessage) return htmlMessage;
  const responseBody = payload?.responseBody as string | undefined;
  if (typeof responseBody === "string") {
    try {
      const parsed = JSON.parse(responseBody);
      const fieldErrors = parsed?.errors;
      if (fieldErrors && typeof fieldErrors === "object") {
        const firstField = Object.values(fieldErrors).find(Array.isArray);
        if (firstField && (firstField as Array<Record<string, unknown>>).length > 0 && (firstField as Array<Record<string, unknown>>)[0]?.message) {
          return (firstField as Array<Record<string, unknown>>)[0].message as string;
        }
      }
      return parsed?.message || payloadMessage || fallback;
    } catch {
      return responseBody || payloadMessage || fallback;
    }
  }
  return payloadMessage || (data?.message as string) || fallback;
};

const extractStatusCode = (data: Record<string, unknown>) =>
  ((data?.payload as Record<string, unknown>)?.statusCode as string) ||
  (data?.statusCode as string) ||
  (data?.code as string) ||
  "";

const getStoredAugmontUser = () => {
  try {
    const raw = localStorage.getItem(AUGMONT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const getStoredOrderReferences = () => {
  try {
    const raw = localStorage.getItem(AUGMONT_ORDER_REFERENCES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};

const storeOrderReference = (reference: Record<string, unknown>) => {
  if (!reference?.merchantTransactionId && !reference?.transactionId) return;
  const nextReference = { ...reference, storedAt: new Date().toISOString() };
  const existing = getStoredOrderReferences().filter(
    (item: Record<string, unknown>) =>
      item?.merchantTransactionId !== nextReference.merchantTransactionId &&
      item?.transactionId !== nextReference.transactionId
  );
  localStorage.setItem(AUGMONT_ORDER_REFERENCES_KEY, JSON.stringify([nextReference, ...existing].slice(0, 50)));
};

const setStoredAugmontUser = (user: Record<string, unknown>) => {
  const existing = getStoredAugmontUser() || {};
  localStorage.setItem(AUGMONT_USER_KEY, JSON.stringify({ ...existing, ...user }));
};

export const normalizeAugmontUserProfile = (data: Record<string, unknown>, fallbackUniqueId = "") => {
  const payload = data?.payload as Record<string, unknown> | undefined;
  const resultData = payload?.result as Record<string, unknown> | undefined;
  const result =
    resultData?.data ||
    resultData ||
    payload?.data ||
    data?.data ||
    data ||
    {};

  const r = result as Record<string, unknown>;

  return {
    userName: (r?.userName as string) || (r?.name as string) || "",
    uniqueId: (r?.uniqueId as string) || (r?.userUniqueId as string) || (r?.customerUniqueId as string) || fallbackUniqueId,
    customerMappedId: (r?.customerMappedId as string) || "",
    mobileNumber: (r?.mobileNumber as string) || (r?.mobileNo as string) || "",
    userEmail: (r?.userEmail as string) || (r?.emailId as string) || (r?.email as string) || "",
    emailId: (r?.userEmail as string) || (r?.emailId as string) || (r?.email as string) || "",
    userStateId: (r?.userStateId as string) || (r?.stateId as string) || "",
    userCityId: (r?.userCityId as string) || (r?.cityId as string) || "",
    stateName: (r?.stateName as string) || (r?.userState as string) || "",
    cityName: (r?.cityName as string) || (r?.userCity as string) || "",
    userPincode: (r?.userPincode as string) || (r?.pincode as string) || (r?.pinCode as string) || "",
    kycStatus: (r?.kycStatus as string) || "",
    userState: (r?.userState as string) || "",
    userCity: (r?.userCity as string) || "",
    createdAt: (r?.createdAt as string) || "",
    userBankId: (r?.userBankId as string) || "",
    userAddressId: (r?.userAddressId as string) || "",
    profileExists: Boolean(Object.keys(r || {}).length || fallbackUniqueId),
    profileCompleted: Boolean(
      ((r?.uniqueId || r?.userUniqueId || r?.customerUniqueId || fallbackUniqueId) as string) &&
      ((r?.userName || r?.name) as string) &&
      ((r?.mobileNumber || r?.mobileNo) as string) &&
      ((r?.emailId || r?.email || r?.userEmail) as string)
    ),
    raw: r
  };
};

const selectProductImage = (images: Array<Record<string, unknown>>) => {
  if (!Array.isArray(images) || images.length === 0) return "";
  const defaultImage = images.find((image) => image?.defaultImage && image?.url);
  if (defaultImage) return defaultImage.url as string;
  const orderedImage = [...images]
    .filter((image) => image?.url)
    .sort((a, b) => (a?.displayOrder as number ?? Number.MAX_SAFE_INTEGER) - (b?.displayOrder as number ?? Number.MAX_SAFE_INTEGER))[0];
  return (orderedImage?.url as string) || "";
};

const toNumber = (value: unknown) => {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickFirstPositiveNumber = (...values: unknown[]) => {
  for (const value of values) {
    const parsed = toNumber(value);
    if (parsed > 0) return parsed;
  }
  return 0;
};

const normalizeProduct = (product: Record<string, unknown>) => ({
  id: (product?.sku as string) || `product-${Math.random().toString(36).slice(2, 9)}`,
  sku: (product?.sku as string) || "",
  name: (product?.name as string) || "Untitled Product",
  description: (product?.description as string) && product?.description !== "NA" ? product.description as string : "",
  basePrice: (product?.basePrice as string) || "0",
  metalType: (product?.metalType as string) || "NA",
  purity: (product?.purity as string) || "NA",
  productWeight: (product?.productWeight as string) || "NA",
  redeemWeight: (product?.redeemWeight as string) || "NA",
  jewelleryType: (product?.jewelleryType as string) || "NA",
  productSize: (product?.productSize as string) || "NA",
  status: (product?.status as string) || "inactive",
  productImages: Array.isArray(product?.productImages) ? product.productImages as Array<Record<string, unknown>> : [],
  imageUrl: selectProductImage(product?.productImages as Array<Record<string, unknown>>)
});

const normalizePagination = (pagination: Record<string, unknown> = {}) => ({
  hasMore: Boolean(pagination?.hasMore),
  count: Number(pagination?.count || 0),
  per_page: Number(pagination?.per_page || 0),
  current_page: Number(pagination?.current_page || 1)
});

const findRateValue = (container: Record<string, unknown> = {}, keys: string[]) =>
  pickFirstPositiveNumber(...keys.map((key) => container?.[key]));

const extractOrderResult = (data: Record<string, unknown>) => {
  const payload = data?.payload as Record<string, unknown> | undefined;
  const result = payload?.result as Record<string, unknown> | undefined;
  return result?.data || result || payload?.data || data?.data || data || {};
};

const extractOrderArray = (data: Record<string, unknown>) => {
  const result = extractOrderResult(data);
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.orders)) return result.orders;
  if (Array.isArray(result?.data)) return result.data;
  const payload = data?.payload as Record<string, unknown> | undefined;
  const r = payload?.result as Record<string, unknown> | undefined;
  if (Array.isArray(r?.data?.orders)) return r.data.orders;
  return result && typeof result === "object" ? [result] : [];
};

const normalizeOrderStatus = (status: string) => {
  if (!status) return "Pending";
  return String(status)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizeAugmontOrder = (source: string, order: Record<string, unknown>, index = 0) => {
  const amount = pickFirstPositiveNumber(
    order?.inclTaxAmt, order?.exclTaxAmt, order?.totalAmount,
    order?.amount, order?.buyPrice, order?.sellPrice,
    order?.payableAmount, order?.receivableAmount
  );
  const grams = pickFirstPositiveNumber(
    order?.qty, order?.metalQuantity, order?.quantity, order?.goldAmount, order?.grams
  );
  const rate = pickFirstPositiveNumber(order?.exclTaxRate, order?.rate, order?.inclTaxRate);
  const transactionId = (order?.transactionId || order?.txnId || order?.transactionID || order?.id || "") as string;
  const merchantTransactionId = (order?.merchantTransactionId || order?.merchantTxnId || order?.merchantOrderId || "") as string;
  const uniqueId = (order?.uniqueId || order?.userUniqueId || order?.customerUniqueId || "") as string;
  const rawStatus = (order?.status || order?.orderStatus || order?.transactionStatus) as string | undefined;
  const status = rawStatus ? normalizeOrderStatus(rawStatus) : order?.cancelId ? "Cancelled" : "Completed";
  const createdAt = (order?.createdAt || order?.transactionDate || order?.orderDate || order?.date || order?.updatedAt || "") as string;

  return {
    id: merchantTransactionId || transactionId || `${source}-order-${index}`,
    type: source.toUpperCase(),
    amount,
    gold: grams,
    rate,
    taxRate: order?.taxRate ?? null,
    taxAmt: order?.taxAmt ?? null,
    date: createdAt,
    status,
    merchantTransactionId,
    transactionId,
    uniqueId,
    raw: order
  };
};

export const normalizeGoldRatePayload = (data: Record<string, unknown>) => {
  const payload = data?.payload as Record<string, unknown> | undefined;
  const result = payload?.result as Record<string, unknown> | undefined;
  const rates =
    (result?.data as Record<string, unknown>)?.rates ||
    result?.rates ||
    payload?.rates ||
    data?.rates ||
    {};

  const r = rates as Record<string, unknown>;
  const buyPrice = findRateValue(r, ["gBuy", "buy", "buyPrice", "goldBuy", "gold_buy"]);
  const sellPrice = findRateValue(r, ["gSell", "sell", "sellPrice", "goldSell", "gold_sell"]);
  const currentPrice = pickFirstPositiveNumber(r?.current, r?.price, r?.goldPrice, buyPrice, sellPrice);

  return {
    currentPrice,
    buyPrice: buyPrice || currentPrice,
    sellPrice: sellPrice || currentPrice,
    blockId: ((result?.data as Record<string, unknown>)?.blockId as string) || (result?.blockId as string) || (data?.blockId as string) || "",
    metalType: (r?.metalType as string) || "gold",
    updatedAt: (r?.updatedAt as string) || (r?.timestamp as string) || ((result?.data as Record<string, unknown>)?.updatedAt as string) || new Date().toISOString(),
    gold: { currentPrice, buyPrice: buyPrice || currentPrice, sellPrice: sellPrice || currentPrice },
    silver: {
      currentPrice: findRateValue(r, ["sCurrent", "silverCurrent", "silverPrice", "sPrice"]),
      buyPrice: findRateValue(r, ["sBuy", "silverBuy", "silver_buy", "silverBuyPrice"]),
      sellPrice: findRateValue(r, ["sSell", "silverSell", "silver_sell", "silverSellPrice"])
    },
    rawRates: r
  };
};

export const normalizeSipRatePayload = (data: Record<string, unknown>) => {
  const payload = data?.payload as Record<string, unknown> | undefined;
  const result = payload?.result as Record<string, unknown> | undefined;
  const rates =
    (result?.data as Record<string, unknown>)?.rates ||
    result?.rates ||
    payload?.rates ||
    data?.rates ||
    (result?.data as Record<string, unknown>) ||
    {};

  const r = rates as Record<string, unknown>;

  return {
    gold: {
      currentPrice: findRateValue(r, ["gBuy", "goldSipRate", "goldRate", "buy", "buyPrice"]),
      buyPrice: findRateValue(r, ["gBuy", "goldSipRate", "goldRate", "buy", "buyPrice"])
    },
    silver: {
      currentPrice: findRateValue(r, ["sBuy", "silverSipRate", "silverRate", "silverBuy"]),
      buyPrice: findRateValue(r, ["sBuy", "silverSipRate", "silverRate", "silverBuy"])
    },
    updatedAt: (r?.updatedAt as string) || ((result?.data as Record<string, unknown>)?.updatedAt as string) || new Date().toISOString(),
    rawRates: r
  };
};

export const normalizeRateHistoryPayload = (data: Record<string, unknown>, metalType = "gold") => {
  const payload = data?.payload as Record<string, unknown> | undefined;
  const source = Array.isArray(payload?.result as Record<string, unknown>)
    ? payload?.result as unknown as Array<Record<string, unknown>>
    : Array.isArray((payload?.result as Record<string, unknown>)?.data)
      ? (payload?.result as Record<string, unknown>).data as Array<Record<string, unknown>>
      : [];

  return source
    .map((item) => {
      const buyRate = toNumber(item?.buyRate);
      const sellRate = toNumber(item?.sellRate);
      return {
        date: (item?.date as string) || "",
        metalType: (item?.type as string) || metalType,
        buyRate,
        sellRate,
        label: (item?.date as string) || "",
        price: buyRate || sellRate || 0,
        updatedAt: (item?.date as string) || "",
        returns: {
          oneDay: item?.oneDayReturn ?? null,
          oneWeek: item?.oneWeekReturn ?? null,
          oneMonth: item?.oneMonthReturn ?? null,
          threeMonth: item?.threeMonthReturn ?? null,
          sixMonth: item?.sixMonthReturn ?? null,
          nineMonth: item?.nineMonthReturn ?? null,
          oneYear: item?.oneYearReturn ?? null,
          twoYear: item?.twoYearReturn ?? null,
          threeYear: item?.threeYearReturn ?? null,
          fourYear: item?.fourYearReturn ?? null,
          fiveYear: item?.fiveYearReturn ?? null
        },
        raw: item
      };
    })
    .filter((item) => item.buyRate > 0 || item.sellRate > 0);
};

const readGoldRateHistory = () => {
  try {
    const raw = localStorage.getItem(LIVE_GOLD_RATE_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((point: Record<string, unknown>) => point && point.label && Number.isFinite(Number(point.price))) : [];
  } catch { return []; }
};

const storeGoldRatePoint = (snapshot: Record<string, unknown>) => {
  const history = readGoldRateHistory();
  const timestamp = new Date((snapshot.updatedAt as string) || Date.now());
  const nextPoint = {
    label: timestamp.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    price: Number(Number(snapshot.currentPrice).toFixed(2)),
    updatedAt: (snapshot.updatedAt as string) || timestamp.toISOString()
  };
  const dedupedHistory = history.filter((point: Record<string, unknown>) => point.updatedAt !== nextPoint.updatedAt);
  const nextHistory = [...dedupedHistory, nextPoint].slice(-LIVE_GOLD_RATE_HISTORY_LIMIT);
  localStorage.setItem(LIVE_GOLD_RATE_HISTORY_KEY, JSON.stringify(nextHistory));
  return nextHistory;
};

export const getAugmontSession = () => {
  try {
    const raw = sessionStorage.getItem(AUGMONT_SESSION_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.merchantId ? parsed : { merchantId: DEFAULT_MERCHANT_ID };
  } catch { return { merchantId: DEFAULT_MERCHANT_ID }; }
};

const setAugmontSession = (session: Record<string, unknown>) => {
  sessionStorage.setItem(AUGMONT_SESSION_KEY, JSON.stringify({ merchantId: session?.merchantId || DEFAULT_MERCHANT_ID }));
};

export const clearAugmontSession = () => {
  sessionStorage.removeItem(AUGMONT_SESSION_KEY);
};

export const getAugmontUser = () => getStoredAugmontUser();
export const setAugmontUser = (user: Record<string, unknown>) => setStoredAugmontUser(user);

export const loginUser = async () => ({
  ok: true,
  merchantId: DEFAULT_MERCHANT_ID,
  message: "Provider authentication is handled internally by the goldplatform wrapper."
});

export const loginAugmont = async ({ force = false } = {}) => {
  const session = { merchantId: DEFAULT_MERCHANT_ID };
  if (force) clearAugmontSession();
  setAugmontSession(session);
  return { ok: true, ...session, message: "Provider authentication is handled internally by the goldplatform wrapper." };
};

export const createUser = async (userData: Record<string, unknown>) =>
  createAugmontUser({
    mobileNumber: (userData?.mobileNumber as string) || "",
    emailId: (userData?.email || userData?.emailId) as string || "",
    uniqueId: (userData?.uniqueId as string) || `USER-${Date.now()}`,
    userName: (userData?.name || userData?.userName) as string || "",
    stateName: (userData?.stateName as string) || "",
    cityName: (userData?.cityName as string) || "",
    userPincode: (userData?.userPincode as string) || ""
  }, userData?.merchantId as string);

const requestAugmontOrderEndpoint = async (path: string, body: Record<string, unknown> = {}, fallbackMessage = "Failed to complete order request") => {
  try {
    const resolvedMerchantId = (body?.merchantId as string) || getAugmontSession()?.merchantId || DEFAULT_MERCHANT_ID;
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantId: resolvedMerchantId, ...body })
    });
    const data = await getJson(res);
    const statusCode = String(extractStatusCode(data) || "");
    const isMinimalSuccess = res.ok && (data?.status === "success" || !data?.status || statusCode.startsWith("2") || /success/i.test(data?.message || ((data?.payload as Record<string, unknown>)?.message as string) || ""));
    if (!isMinimalSuccess) return { ok: false, message: extractBackendMessage(data, fallbackMessage), raw: data };
    return { ok: true, statusCode, data, raw: data };
  } catch (error) {
    console.error("AUGMONT ORDER API ERROR:", error);
    return { ok: false, message: fallbackMessage };
  }
};

export const fetchAugmontUserProfile = async (uniqueId: string) => {
  if (!uniqueId) return { ok: false, message: "Missing Augmont uniqueId" };
  const response = await requestAugmontOrderEndpoint("/api/v1/users/profile", { uniqueId });
  if (!response.ok) return response;
  const payload = response.data?.payload as Record<string, unknown> | undefined;
  const result = payload?.result as Record<string, unknown> | undefined;
  const profileData = result?.data || result || response.data?.data || {};
  const normalized = normalizeAugmontUserProfile(profileData as Record<string, unknown>, uniqueId);
  setStoredAugmontUser(normalized as unknown as Record<string, unknown>);
  return { ok: true, profile: normalized, raw: response.raw };
};

export const createAugmontUser = async (request: Record<string, unknown>, merchantId?: string) => {
  if (!request?.mobileNumber || !request?.emailId || !request?.uniqueId || !request?.userName || !(request?.stateId || request?.stateName) || !(request?.cityId || request?.cityName) || !request?.userPincode) {
    return { ok: false, message: "Missing required Augmont user fields" };
  }
  const locationRequest = request?.stateId && request?.cityId
    ? { stateId: String(request.stateId).trim(), cityId: String(request.cityId).trim() }
    : { stateName: String(request.stateName || "").trim(), cityName: String(request.cityName || "").trim() };
  const response = await requestAugmontOrderEndpoint("/api/v1/users/create", {
    merchantId: merchantId || DEFAULT_MERCHANT_ID,
    request: {
      mobileNumber: String(request?.mobileNumber || "").trim(),
      emailId: String(request?.emailId || "").trim(),
      uniqueId: String(request?.uniqueId || "").trim(),
      userName: String(request?.userName || "").trim(),
      ...locationRequest,
      userPincode: String(request?.userPincode || "").trim()
    }
  });
  if (!response.ok) return response;
  return {
    ok: true,
    statusCode: response.statusCode,
    message: ((response.raw as Record<string, unknown>)?.payload as Record<string, unknown>)?.message as string || (response.raw as Record<string, unknown>)?.message as string || "Augmont user create request accepted",
    raw: response.raw
  };
};

export const updateAugmontUser = async ({ uniqueId, request, merchantId }: { uniqueId: string; request: Record<string, unknown>; merchantId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/users/update", {
    merchantId: merchantId || DEFAULT_MERCHANT_ID,
    uniqueId: String(uniqueId || "").trim(),
    request: {
      mobileNumber: String(request?.mobileNumber || "").trim(),
      emailId: String(request?.emailId || "").trim(),
      userName: String(request?.userName || "").trim(),
      stateName: String(request?.stateName || "").trim(),
      cityName: String(request?.cityName || "").trim(),
      userPincode: String(request?.userPincode || "").trim()
    }
  });

export const fetchAugmontKycProfile = async (uniqueId: string, merchantId?: string) => {
  if (!uniqueId) return { ok: false, message: "Missing Augmont uniqueId" };
  const response = await requestAugmontOrderEndpoint("/api/v1/users/kyc/profile", { merchantId: merchantId || DEFAULT_MERCHANT_ID, uniqueId: String(uniqueId || "").trim() });
  if (!response.ok) return response;
  const payload = response.data?.payload as Record<string, unknown> | undefined;
  const result = payload?.result as Record<string, unknown> | undefined;
  const kycProfile = result?.data || result || response.data?.data || {};
  return { ok: true, kycProfile, raw: response.raw };
};

export const updateAugmontKyc = async ({ uniqueId, request, merchantId }: { uniqueId: string; request: Record<string, unknown>; merchantId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/users/kyc/update", { merchantId: merchantId || DEFAULT_MERCHANT_ID, uniqueId: String(uniqueId || "").trim(), request: request || {} });

export const createAugmontUserBank = async ({ uniqueId, request, merchantId }: { uniqueId: string; request: Record<string, unknown>; merchantId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/users/banks/create", {
    merchantId: merchantId || DEFAULT_MERCHANT_ID,
    uniqueId: String(uniqueId || "").trim(),
    request: {
      accountNumber: String(request?.accountNumber || "").trim(),
      accountName: String(request?.accountName || "").trim(),
      ifscCode: String(request?.ifscCode || "").trim()
    }
  });

export const updateAugmontUserBank = async ({ uniqueId, userBankId, request, merchantId }: { uniqueId: string; userBankId: string; request: Record<string, unknown>; merchantId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/users/banks/update", {
    merchantId: merchantId || DEFAULT_MERCHANT_ID,
    uniqueId: String(uniqueId || "").trim(),
    userBankId: String(userBankId || "").trim(),
    request: {
      accountNumber: String(request?.accountNumber || "").trim(),
      accountName: String(request?.accountName || "").trim(),
      ifscCode: String(request?.ifscCode || "").trim(),
      status: String(request?.status || "active").trim()
    }
  });

export const setPrimaryAugmontUserBank = async ({ uniqueId, userBankId }: { uniqueId: string; userBankId: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/users/banks/set-primary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider_client_reference: String(uniqueId || "").trim(), provider_bank_id: String(userBankId || "").trim() })
    });
    const data = await getJson(res);
    const statusCode = String(extractStatusCode(data) || "");
    const isSuccess = res.ok && (data?.ok || data?.status === "success" || !data?.status || statusCode.startsWith("2") || /success/i.test(data?.message || ((data?.payload as Record<string, unknown>)?.message as string) || ""));
    return isSuccess
      ? { ok: true, message: data?.message || ((data?.payload as Record<string, unknown>)?.message as string) || "Primary bank updated successfully", raw: data }
      : { ok: false, message: extractBackendMessage(data, "Failed to set primary bank"), raw: data };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to set primary bank" };
  }
};

export const fetchAugmontUserBanks = async (uniqueId: string, merchantId?: string) => {
  if (!uniqueId) return { ok: false, message: "Missing Augmont uniqueId", banks: [] };
  const response = await requestAugmontOrderEndpoint("/api/v1/users/banks/list", { merchantId: merchantId || DEFAULT_MERCHANT_ID, uniqueId: String(uniqueId || "").trim() });
  if (!response.ok) return { ...response, banks: [] };
  const payload = response.data?.payload as Record<string, unknown> | undefined;
  const result = payload?.result as Record<string, unknown> | undefined;
  const banksList = result?.data || (Array.isArray(result) ? result : null) || response.data?.data || [];
  return { ok: true, banks: Array.isArray(banksList) ? banksList : [], raw: response.raw };
};

export const fetchAugmontPrimaryUserBank = async ({ uniqueId }: { uniqueId: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/users/banks/primary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider_client_reference: String(uniqueId || "").trim() })
    });
    const data = await getJson(res);
    if (!res.ok || data?.ok === false || data?.status === "error") {
      return { ok: false, message: extractBackendMessage(data, "Failed to fetch primary bank"), banks: [], raw: data };
    }
    const banks = Array.isArray(data?.banks) ? data.banks : Array.isArray(data?.data?.banks) ? data.data.banks : [];
    return { ok: true, banks, bank: banks[0] || null, message: data?.message || "Primary bank account retrieved successfully", raw: data };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to fetch primary bank", banks: [] };
  }
};

export const deleteAugmontUserBank = async ({ uniqueId, userBankId, merchantId }: { uniqueId: string; userBankId: string; merchantId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/users/banks/delete", { merchantId: merchantId || DEFAULT_MERCHANT_ID, uniqueId: String(uniqueId || "").trim(), userBankId: String(userBankId || "").trim() });

export const createAugmontAddress = async ({ uniqueId, request, merchantId }: { uniqueId: string; request: Record<string, unknown>; merchantId?: string }) => {
  const resolvedMerchantId = merchantId || DEFAULT_MERCHANT_ID;
  const response = await requestAugmontOrderEndpoint("/api/v1/users/addresses/create", {
    merchantId: resolvedMerchantId,
    uniqueId: String(uniqueId || "").trim(),
    request: {
      name: String(request?.name || "").trim(),
      mobileNumber: String(request?.mobileNumber || "").trim(),
      email: String(request?.email || request?.emailId || "").trim(),
      address: String(request?.address || request?.fullAddress || "").trim(),
      pincode: String(request?.pincode || request?.userPincode || "").trim()
    }
  });
  if (!response.ok) return response;
  const addressListResponse = await fetchAugmontAddresses(uniqueId, resolvedMerchantId);
  return {
    ok: true,
    statusCode: response.statusCode,
    message: ((response.raw as Record<string, unknown>)?.payload as Record<string, unknown>)?.message as string || (response.raw as Record<string, unknown>)?.message as string || "Augmont address create request accepted",
    addresses: addressListResponse?.addresses || [],
    raw: response.raw,
    addressListRaw: addressListResponse?.raw || null
  };
};

export const fetchAugmontAddresses = async (uniqueId: string, merchantId?: string) => {
  if (!uniqueId) return { ok: false, message: "Missing Augmont uniqueId", addresses: [] };
  const response = await requestAugmontOrderEndpoint("/api/v1/users/addresses/list", { merchantId: merchantId || DEFAULT_MERCHANT_ID, uniqueId: String(uniqueId || "").trim() });
  if (!response.ok) return { ...response, addresses: [] };
  const payload = response.data?.payload as Record<string, unknown> | undefined;
  const result = payload?.result as Record<string, unknown> | undefined;
  const addresses = result?.data || result || response.data?.data || [];
  return { ok: true, addresses: Array.isArray(addresses) ? addresses : [], raw: response.raw };
};

export const fetchAugmontPassbook = async (uniqueId: string) => {
  if (!uniqueId) return { ok: false, message: "Missing Augmont uniqueId" };
  const response = await requestAugmontOrderEndpoint("/api/v1/users/passbook", { uniqueId: String(uniqueId || "").trim() });
  if (!response.ok) return response;
  const payload = response.data?.payload as Record<string, unknown> | undefined;
  const result = payload?.result as Record<string, unknown> | undefined;
  return { ok: true, passbook: result?.data || result || {}, raw: response.raw };
};

export const fetchAugmontProducts = async (page = 1, count = 10, merchantId?: string) => {
  try {
    const resolvedMerchantId = merchantId || DEFAULT_MERCHANT_ID;
    if (!resolvedMerchantId) return { ok: false, message: "Missing merchantId. Please retry." };
    const res = await fetch(`${BASE_URL}/api/v1/products/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantId: resolvedMerchantId, page, count })
    });
    const data = await getJson(res);
    if (!res.ok || data?.status !== "success") {
      return { ok: false, message: extractBackendMessage(data, "Failed to fetch products"), providerUrl: (data?.payload as Record<string, unknown>)?.providerUrl as string || "", products: [], pagination: normalizePagination() };
    }
    const payload = data?.payload as Record<string, unknown> | undefined;
    const result = payload?.result as Record<string, unknown> | undefined;
    return {
      ok: true,
      message: payload?.message as string || "",
      products: Array.isArray(result?.data) ? (result.data as Array<Record<string, unknown>>).map(normalizeProduct) : [],
      pagination: normalizePagination(result?.pagination as Record<string, unknown>),
      raw: data
    };
  } catch (error) {
    console.error("PRODUCT API ERROR:", error);
    return { ok: false, message: "Failed to fetch products", products: [], pagination: normalizePagination() };
  }
};

export const fetchAugmontProductDetail = async ({ merchantId = DEFAULT_MERCHANT_ID, sku }: { merchantId?: string; sku: string }) => {
  if (!sku) return { ok: false, message: "Missing product sku" };
  const response = await requestAugmontOrderEndpoint("/api/v1/products/detail", { merchantId, sku }, "Failed to fetch product detail");
  if (!response.ok) return response;
  const product = extractOrderResult(response.data);
  return { ok: true, product: normalizeProduct(product as Record<string, unknown>), raw: response.raw };
};

export const getGoldRates = async (merchantId = DEFAULT_MERCHANT_ID) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/rates/live`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantId })
    });
    return await getJson(res);
  } catch (error) {
    console.error("AUGMONT LIVE RATE ERROR:", error);
    return { ok: false, status: "error", payload: { message: "Failed to fetch live Augmont rates" } };
  }
};

export const fetchLiveGoldRateSnapshot = async (options = {}) =>
  withRateCache("live", { merchantId: DEFAULT_MERCHANT_ID }, async () => {
    try {
      const data = await getGoldRates();
      const snapshot = normalizeGoldRatePayload(data);
      if (snapshot.currentPrice <= 0) {
        return { ok: false, message: extractBackendMessage(data, "Live gold rate is unavailable"), snapshot, history: readGoldRateHistory(), raw: data };
      }
      const history = storeGoldRatePoint(snapshot);
      localStorage.setItem("goldPrice", String(snapshot.currentPrice));
      return { ok: true, snapshot, history, raw: data, blockId: snapshot.blockId || "" };
    } catch (error) {
      console.error("GOLD RATE ERROR:", error);
      return { ok: false, message: "Failed to fetch live gold rate", history: readGoldRateHistory() };
    }
  }, options);

export const fetchAugmontRateHistory = async ({ merchantId = DEFAULT_MERCHANT_ID, fromDate, toDate, metalType = "gold", force = false, allowNetwork = true }: {
  merchantId?: string; fromDate?: string; toDate?: string; metalType?: string; force?: boolean; allowNetwork?: boolean;
} = {}) =>
  withRateCache("history", { merchantId, fromDate, toDate, metalType }, async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/rates/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId, fromDate, toDate, metalType })
      });
      const data = await getJson(res);
      const history = normalizeRateHistoryPayload(data, metalType);
      if (!res.ok || history.length === 0) {
        return { ok: false, history, raw: data, message: extractBackendMessage(data, "Historical Augmont rates are unavailable") };
      }
      return { ok: true, history, raw: data };
    } catch (error) {
      console.error("AUGMONT RATE HISTORY ERROR:", error);
      return { ok: false, history: [], message: "Failed to fetch historical Augmont rates" };
    }
  }, { force, allowNetwork });

export const fetchAugmontSipRates = async (merchantId = DEFAULT_MERCHANT_ID, options = {}) =>
  withRateCache("sip", { merchantId }, async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/rates/sip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId })
      });
      const data = await getJson(res);
      const snapshot = normalizeSipRatePayload(data);
      if (!res.ok || (!snapshot.gold.currentPrice && !snapshot.silver.currentPrice)) {
        return { ok: false, snapshot, raw: data, message: extractBackendMessage(data, "SIP rates are unavailable") };
      }
      return { ok: true, snapshot, raw: data };
    } catch (error) {
      console.error("AUGMONT SIP RATE ERROR:", error);
      return { ok: false, snapshot: { gold: { currentPrice: 0, buyPrice: 0 }, silver: { currentPrice: 0, buyPrice: 0 } }, message: "Failed to fetch SIP rates" };
    }
  }, options);

const buildOrderReference = (order: Record<string, unknown>, fallback: Record<string, unknown> = {}) => {
  const reference = {
    merchantId: String(order?.merchantId || fallback?.merchantId || DEFAULT_MERCHANT_ID),
    merchantTransactionId: String(order?.merchantTransactionId || order?.merchantTxnId || fallback?.merchantTransactionId || ""),
    transactionId: String(order?.transactionId || order?.txnId || order?.transactionID || fallback?.transactionId || ""),
    uniqueId: String(order?.uniqueId || order?.userUniqueId || order?.customerUniqueId || fallback?.uniqueId || "")
  };
  storeOrderReference(reference);
  return reference;
};

export const getAugmontOrderReferences = () => getStoredOrderReferences();

export const createAugmontBuyOrder = async ({ merchantId = DEFAULT_MERCHANT_ID, request = {}, ...rest }: { merchantId?: string; request?: Record<string, unknown> } = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/buy/create", { merchantId, request, ...rest });
  if (!response.ok) return response;
  const order = extractOrderResult(response.data);
  const references = buildOrderReference(order as Record<string, unknown>, { merchantId, uniqueId: request?.uniqueId as string });
  return { ok: true, order, references, raw: response.raw, message: response.data?.message || ((response.data?.payload as Record<string, unknown>)?.message as string) || "Buy order created successfully" };
};

export const fetchAugmontBuyOrderDetail = async ({ merchantId = DEFAULT_MERCHANT_ID, merchantTransactionId, uniqueId }: { merchantId?: string; merchantTransactionId?: string; uniqueId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/buy/detail", { merchantId, merchantTransactionId, uniqueId });
  if (!response.ok) return response;
  const order = extractOrderResult(response.data);
  const references = buildOrderReference(order as Record<string, unknown>, { merchantId, merchantTransactionId, uniqueId });
  return { ok: true, order, references, raw: response.raw };
};

export const fetchAugmontBuyOrders = async ({ merchantId = DEFAULT_MERCHANT_ID, uniqueId }: { merchantId?: string; uniqueId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/buy/list", { merchantId, uniqueId });
  if (!response.ok) return { ...response, orders: [] };
  return { ok: true, orders: extractOrderArray(response.data).map((order: Record<string, unknown>, index: number) => normalizeAugmontOrder("buy", order, index)), raw: response.raw };
};

export const fetchAugmontBuyInvoice = async ({ merchantId = DEFAULT_MERCHANT_ID, transactionId }: { merchantId?: string; transactionId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/invoices/buy", { merchantId, transactionId });
  if (!response.ok) return response;
  return { ok: true, invoice: extractOrderResult(response.data), raw: response.raw };
};

export const createAugmontSellOrder = async ({ merchantId = DEFAULT_MERCHANT_ID, request = {}, ...rest }: { merchantId?: string; request?: Record<string, unknown> } = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/sell/create", { merchantId, request, ...rest });
  if (!response.ok) return response;
  const order = extractOrderResult(response.data);
  const references = buildOrderReference(order as Record<string, unknown>, { merchantId, uniqueId: request?.uniqueId as string });
  return { ok: true, order, references, raw: response.raw, message: (response.data?.payload as Record<string, unknown>)?.message as string || "Sell order created successfully" };
};

export const fetchAugmontSellOrderDetail = async ({ merchantId = DEFAULT_MERCHANT_ID, merchantTransactionId, uniqueId }: { merchantId?: string; merchantTransactionId?: string; uniqueId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/sell/detail", { merchantId, merchantTransactionId, uniqueId });
  if (!response.ok) return response;
  const order = extractOrderResult(response.data);
  const references = buildOrderReference(order as Record<string, unknown>, { merchantId, merchantTransactionId, uniqueId });
  return { ok: true, order, references, raw: response.raw };
};

export const fetchAugmontSellOrders = async ({ merchantId = DEFAULT_MERCHANT_ID, uniqueId }: { merchantId?: string; uniqueId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/sell/list", { merchantId, uniqueId });
  if (!response.ok) return { ...response, orders: [] };
  return { ok: true, orders: extractOrderArray(response.data).map((order: Record<string, unknown>, index: number) => normalizeAugmontOrder("sell", order, index)), raw: response.raw };
};

export const fetchAugmontSellInvoice = async ({ merchantId = DEFAULT_MERCHANT_ID, transactionId }: { merchantId?: string; transactionId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/invoices/sell", { merchantId, transactionId });
  if (!response.ok) return response;
  return { ok: true, invoice: extractOrderResult(response.data), raw: response.raw };
};

export const createAugmontRedeemOrder = async ({ merchantId = DEFAULT_MERCHANT_ID, request = {} }: { merchantId?: string; request?: Record<string, unknown> } = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/redeem/create", { merchantId, request });
  if (!response.ok) return response;
  const order = extractOrderResult(response.data);
  const references = buildOrderReference(order as Record<string, unknown>, { merchantId, uniqueId: request?.uniqueId as string });
  return { ok: true, order, references, raw: response.raw };
};

export const fetchAugmontRedeemOrderDetail = async ({ merchantId = DEFAULT_MERCHANT_ID, merchantTransactionId, uniqueId }: { merchantId?: string; merchantTransactionId?: string; uniqueId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/redeem/detail", { merchantId, merchantTransactionId, uniqueId });
  if (!response.ok) return response;
  return { ok: true, order: extractOrderResult(response.data), raw: response.raw };
};

export const fetchAugmontRedeemOrders = async ({ merchantId = DEFAULT_MERCHANT_ID, uniqueId }: { merchantId?: string; uniqueId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/redeem/list", { merchantId, uniqueId });
  if (!response.ok) return { ...response, orders: [] };
  return { ok: true, orders: extractOrderArray(response.data).map((order: Record<string, unknown>, index: number) => normalizeAugmontOrder("redeem", order, index)), raw: response.raw };
};

export const fetchAugmontRedeemInvoice = async ({ merchantId = DEFAULT_MERCHANT_ID, transactionId }: { merchantId?: string; transactionId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/invoices/redeem", { merchantId, transactionId });
  if (!response.ok) return response;
  return { ok: true, invoice: extractOrderResult(response.data), raw: response.raw };
};

export const createAugmontTransferOrder = async ({ merchantId = DEFAULT_MERCHANT_ID, request = {} }: { merchantId?: string; request?: Record<string, unknown> } = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/transfer/create", { merchantId, request });
  if (!response.ok) return response;
  const order = extractOrderResult(response.data);
  const references = buildOrderReference(order as Record<string, unknown>, { merchantId, uniqueId: (request?.senderUniqueId || request?.uniqueId) as string });
  return { ok: true, order, references, raw: response.raw };
};

export const fetchAugmontTransferOrderDetail = async ({ merchantId = DEFAULT_MERCHANT_ID, merchantTransactionId, uniqueId }: { merchantId?: string; merchantTransactionId?: string; uniqueId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/transfer/detail", { merchantId, merchantTransactionId, uniqueId });
  if (!response.ok) return response;
  return { ok: true, order: extractOrderResult(response.data), raw: response.raw };
};

export const fetchAugmontTransferOrders = async ({ merchantId = DEFAULT_MERCHANT_ID, uniqueId }: { merchantId?: string; uniqueId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/transfer/list", { merchantId, uniqueId });
  if (!response.ok) return { ...response, orders: [] };
  return { ok: true, orders: extractOrderArray(response.data).map((order: Record<string, unknown>, index: number) => normalizeAugmontOrder("transfer", order, index)), raw: response.raw };
};

export const fetchAugmontWithdrawDetail = async ({ merchantId = DEFAULT_MERCHANT_ID, sellTransactionId, uniqueId }: { merchantId?: string; sellTransactionId?: string; uniqueId?: string }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/withdraw/detail", { merchantId, sellTransactionId, uniqueId });
  if (!response.ok) return response;
  return { ok: true, withdraw: extractOrderResult(response.data), raw: response.raw };
};

export const updateAugmontWithdraw = async ({ merchantId = DEFAULT_MERCHANT_ID, sellTransactionId, uniqueId, request = {} }: { merchantId?: string; sellTransactionId?: string; uniqueId?: string; request?: Record<string, unknown> }) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/withdraw/update", { merchantId, sellTransactionId, uniqueId, request });
  if (!response.ok) return response;
  return { ok: true, withdraw: extractOrderResult(response.data), raw: response.raw };
};

export const fetchAugmontFdSchemes = async ({ merchantId = DEFAULT_MERCHANT_ID }: { merchantId?: string } = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/fd/schemes", { merchantId });
  if (!response.ok) return { ...response, schemes: [] };
  return { ok: true, schemes: Array.isArray(extractOrderResult(response.data)) ? extractOrderResult(response.data) : [], raw: response.raw };
};

export const preOrderAugmontFd = async ({ merchantId = DEFAULT_MERCHANT_ID, request = {} }: { merchantId?: string; request?: Record<string, unknown> } = {}) =>
  requestAugmontOrderEndpoint("/api/v1/fd/pre-order", { merchantId, request });

export const createAugmontFdOrder = async ({ merchantId = DEFAULT_MERCHANT_ID, request = {} }: { merchantId?: string; request?: Record<string, unknown> } = {}) =>
  requestAugmontOrderEndpoint("/api/v1/fd/orders/create", { merchantId, request });

export const fetchAugmontFdOrderDetail = async ({ merchantId = DEFAULT_MERCHANT_ID, merchantTransactionId }: { merchantId?: string; merchantTransactionId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/fd/orders/detail", { merchantId, merchantTransactionId });

export const fetchAugmontFdOrders = async ({ merchantId = DEFAULT_MERCHANT_ID, uniqueId, status, page = 1, count = 25 }: { merchantId?: string; uniqueId?: string; status?: string; page?: number; count?: number }) =>
  requestAugmontOrderEndpoint("/api/v1/fd/orders/list", { merchantId, uniqueId, status, page, count });

export const preCloseAugmontFdOrder = async ({ merchantId = DEFAULT_MERCHANT_ID, transactionId }: { merchantId?: string; transactionId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/fd/orders/pre-close", { merchantId, transactionId });

export const closeAugmontFdOrder = async ({ merchantId = DEFAULT_MERCHANT_ID, transactionId }: { merchantId?: string; transactionId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/fd/orders/close", { merchantId, transactionId });

export const fetchAugmontFdTransactions = async ({ merchantId = DEFAULT_MERCHANT_ID, transactionId }: { merchantId?: string; transactionId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/fd/transactions", { merchantId, transactionId });

export const fetchAugmontFdPassbook = async ({ merchantId = DEFAULT_MERCHANT_ID, uniqueId }: { merchantId?: string; uniqueId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/fd/passbook", { merchantId, uniqueId });

export const fetchAugmontFdTerms = async ({ merchantId = DEFAULT_MERCHANT_ID, schemeId, uniqueId }: { merchantId?: string; schemeId?: string; uniqueId?: string }) =>
  requestAugmontOrderEndpoint("/api/v1/fd/terms", { merchantId, schemeId, uniqueId });
