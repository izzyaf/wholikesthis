const personaToCookieString = (cookie) => {
    return Object.entries(cookie).map(pair => pair.join('=')).join('; ')
};

const process = async (key, pageId, offset, limit, cookie, fb_dtsg) => {
    const data = [];

    const response = await fetch(`https://www.facebook.com/pages/admin/people_and_other_pages/entquery/?query_edge_key=${key}&page_id=${pageId}&offset=${offset}&limit=${limit}`, {
        "credentials": "include",
        "headers": {
            "accept": "*/*",
            "accept-language": "en,vi;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "viewport-width": "1002",
            "cookie": cookie
        },
        "referrerPolicy": "origin-when-cross-origin",
        "body": `__a=1&fb_dtsg=${fb_dtsg}`,
        "method": "POST",
        "mode": "cors"
    });

    const responseBody = await response.text();

    if (responseBody.startsWith('for (;;);')) {
        const json = JSON.parse(responseBody.replace('for (;;);', ''));

        if (json.payload && Array.isArray(json.payload.data)) {
            if (json.payload.data.length === 0) {
                return data
            }

            return data.concat(json.payload.data)
        }
    }

    return data
};

export default async (pageId, stringifiedPersona) => {
    const offset = 0;
    const limit = 20;
    const persona = JSON.parse(stringifiedPersona);

    const keys = ['PEOPLE_WHO_LIKE_THIS_PAGE', 'PEOPLE_WHO_FOLLOW_THIS_PAGE', 'PAGES_THAT_LIKE_THIS_PAGE'];

    return Promise.all(keys.map(key =>
        process(key, pageId, offset, limit, personaToCookieString(persona.cookie), encodeURIComponent(persona.token))
    ));
}
