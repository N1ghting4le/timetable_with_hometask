const useHttp = () => {
    const request = async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}, cache = "no-store") => {
        const res = await fetch(url, { method, headers, body, cache });

        if (!res.ok) {
            throw new Error(`Failed to fetch ${url}, status: ${res.status}`);
        }

        return res.json();
    }

    return request;
}

export default useHttp;