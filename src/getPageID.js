const FACESCRAPER_API = process.env.FACESCRAPER_API || 'https://facescraper-ltvclrd2dq-an.a.run.app'

export default async (url) => {
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
