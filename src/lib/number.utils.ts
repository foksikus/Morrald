export function formatNumber(number: number): string {
    const numString = number.toString();
    const formattedNumber = numString.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return formattedNumber;
  }