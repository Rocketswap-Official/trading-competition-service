export function gotoPath(path: string) {
    window.location = path as Location & string;
}

export function openLinkInNewTab(url: string) {
    window.open(url, '_blank');
}