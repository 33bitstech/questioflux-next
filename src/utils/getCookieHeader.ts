type RequestCookie = {
    name: string;
    value: string;
};

export function getCookieHeader(cookiesList: RequestCookie[]): string {
    if (!cookiesList || cookiesList.length === 0) {
        return '';
    }

    return cookiesList
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
}