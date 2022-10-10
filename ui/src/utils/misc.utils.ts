export const formatAccountAddress = (account, lsize = 4, rsize = 4) => {
  return account.substring(0, lsize) + '...' + account.substring(account.length - rsize)
}

export const openNewTab = (url) => window.open(url);

export function addCommas(x: any, decimal_points: number = 0) {
  x = Number(x)
  x = x.toFixed(decimal_points)
  if (decimal_points) {
    const parts = x.split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    x = `${parts[0]}.${parts[1]}`
  } else {
    x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x
}


export function getDateFromUnix(unix_timestamp: number) {
  const d = new Date(unix_timestamp);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

export function getUtcTimeFromUnix(unix_timestamp: number) {
  const d = new Date(unix_timestamp)
    return`${toTwoChars(d.getUTCHours())}:${toTwoChars(d.getUTCMinutes())} UTC`
}

function toTwoChars(num: number) {
  return num.toString().length === 1 ? "0" + num.toString() : num.toString()
}


export function getFullPrize(prizes: number[]) {
  return prizes.reduce((accum, prize) => Number(accum) + Number(prize), 0);
}