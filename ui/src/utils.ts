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