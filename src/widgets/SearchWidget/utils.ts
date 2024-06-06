export function parseQueryParams(uri: string) {
    // Extract the query string from the URI
    const queryString = uri.split('?')[1];

    // Check if there are no query parameters
    if (!queryString) {
        return [];
    }

    // Split the query string into individual parameters
    const queryParams = queryString.split('&');

    // Map each parameter to an object with key and value
    return queryParams.map(param => {
        const [key, value] = param.split('=');
        return { key, value };
    });
}
