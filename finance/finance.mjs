// TAXI TIME Finance V1 — pure, side-effect-free calculation layer.
// NOT wired to production Worker. All amounts are integer qəpik internally.
// Server must authenticate actors, validate order ownership and persist atomically.
export const COMMISSION_BASIS_POINTS = 1000; // 10%
const assertCents = (n) => {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error("INVALID_MONEY");
  return n;
};
export function toCents(azn) {
  if (typeof azn !== "number" || !Number.isFinite(azn) || azn < 0 || azn > 1e9)
    throw new Error("INVALID_MONEY");
  return assertCents(Math.round((azn + Number.EPSILON) * 100));
}
export function toAZN(cents) { return assertCents(cents) / 100; }
export function quoteDriverOffer(driverPriceAZN) {
  const driverCents = toCents(driverPriceAZN);
  const feeCents = Math.round(driverCents * COMMISSION_BASIS_POINTS / 10000);
  return {
    driverPrice: toAZN(driverCents),
    commission: toAZN(feeCents),
    passengerPrice: toAZN(driverCents + feeCents)
  };
}
export function initialAccount() {
  return { depositCents: 0, debtCents: 0, chargedOrderIds: [] };
}
function accountCopy(account) {
  const a = account ?? initialAccount();
  return {
    depositCents: assertCents(a.depositCents),
    debtCents: assertCents(a.debtCents),
    chargedOrderIds: [...(a.chargedOrderIds ?? [])]
  };
}
// Only invoke after a verified completion transition for a specific assigned driver.
// The transaction must atomically update order + driver account + unique ledger entry.
export function completeOrderCommission(account, orderId, feeAZN) {
  const a = accountCopy(account);
  if (typeof orderId !== "string" || !orderId.trim()) throw new Error("ORDER_ID_REQUIRED");
  if (a.chargedOrderIds.includes(orderId))
    return { account: a, charged: false, deducted: 0, newDebt: 0 };
  const fee = toCents(feeAZN);
  const deducted = Math.min(a.depositCents, fee);
  a.depositCents -= deducted;
  a.debtCents += fee - deducted;
  a.chargedOrderIds.push(orderId);
  return {
    account: a, charged: true,
    deducted: toAZN(deducted), newDebt: toAZN(fee - deducted)
  };
}
// Admin-only top-up, after authenticated authorization and audited payment proof.
// Incoming funds settle outstanding debt first.
export function topUpDeposit(account, amountAZN) {
  const a = accountCopy(account);
  const incoming = toCents(amountAZN);
  if (!incoming) throw new Error("TOPUP_MUST_BE_POSITIVE");
  const repaid = Math.min(a.debtCents, incoming);
  a.debtCents -= repaid;
  a.depositCents += incoming - repaid;
  return { account: a, debtRepaid: toAZN(repaid), depositAdded: toAZN(incoming - repaid) };
}
