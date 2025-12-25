export function aedToFils(amountAed) {
  return Math.round(Number(amountAed) * 100);
}

export function calculateTotalAed({ adultCount, childCount, adultPriceAed, childPriceAed, extraMode, extraPerBookingAed, extraPerPersonAed }) {
  const validAdult = Number.isFinite(adultCount) ? adultCount : 0;
  const validChild = Number.isFinite(childCount) ? childCount : 0;
  let total = (validAdult * Number(adultPriceAed)) + (validChild * Number(childPriceAed));
  if (extraMode === 'per_booking') {
    total += Number(extraPerBookingAed || 0);
  } else if (extraMode === 'per_person') {
    total += Number(extraPerPersonAed || 0) * (validAdult + validChild);
  }
  return Number(total.toFixed(2));
}

export function calculateTotalFils(args) {
  return aedToFils(calculateTotalAed(args));
}
