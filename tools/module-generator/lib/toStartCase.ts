export function toStartCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function forceOnlyStartCase(str: string) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}
