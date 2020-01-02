const FACESCRAPER_API = process.env.REACT_APP_FACESCRAPER_API || 'http://localhost:3333'

export const getPageID = async (url) => {
    const searchParams = new URLSearchParams({
        action: 'getPageID',
        url: encodeURIComponent(url)
    }).toString()

    const response = await fetch(`${FACESCRAPER_API}?${searchParams}`)

    const responseBody = await response.json()

    if (responseBody.data) {
        return responseBody.data.id
    }

    return null
}

export const getPageFans = async (pageId, limit, offset, token, cookie) => {
    const searchParams = new URLSearchParams({
        action: 'getPageFans',
    }).toString()

    const payload = {
        id: pageId,
        limit,
        offset,
        token,
        cookie
    }

    const response = await fetch(`${FACESCRAPER_API}?${searchParams}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload, null, 2)
    })

    const responseBody = await response.json()

    if (responseBody.data) {
        return responseBody.data
    }

    return null
}
