/**
 * 숫자를 통화 형식으로 변환합니다.
 * @param amount 변환할 금액
 * @returns 한국 원화 형식으로 변환된 문자열 (예: ₩10,000)
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  }).format(amount);
}
