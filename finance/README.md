# TAXI TIME — Finance V1 (staging-only)

This is an isolated **pure calculation prototype**. It is **not deployed** and does not alter live orders, drivers, deposits or Cloudflare Worker.

## Rules
- Driver's net offer 70 AZN -> passenger price 77 AZN, company fee 7 AZN.
- Fee is charged **only once**, after confirmed completion of an assigned order.
- If deposit is insufficient, balance bottoms at zero and the remainder becomes debt.
- Future top-ups repay debt before adding deposit.
- All monetary values are converted to integer qəpik for calculations.

## Run
`node finance.test.mjs` (Node.js 20+).

## Mandatory before production
1. Store orders, balances, unique order commission ledger and top-ups in Cloudflare D1 with transactions and unique constraints (not GitHub data.json read-modify-write).
2. Authenticate and authorize Admin and Driver operations; do not trust client-provided fee or completion status.
3. Ensure completed-order transition and commission ledger entry are in one transaction; reject duplicates and cross-driver order IDs.
4. Make top-ups idempotent with a unique payment reference, admin audit and immutable ledger.
5. Keep driver net price, fee and balances private from public GET/Passenger APIs.
6. Test integration with current Worker V2.8.0 and Android clients before deployment.
