import streamSaver from "streamsaver";

export const writeToFile = (fileName) => {
    const encoder = new TextEncoder()
    const stream = streamSaver.createWriteStream(fileName)
    const writer = stream.getWriter()

    return async (content, exhausted) => {
        await writer.write(encoder.encode(content))

        if (exhausted) {
            await writer.close()
        }
    }
}

export const stringifyUser = (type, user) => {
    const {profile, timestamp} = user

    const date = new Date(timestamp * 1000) // Convert to milliseconds

    const d = `${date.getDate()}`.padStart(2, '0')
    const m = `${date.getMonth() + 1}`.padStart(2, '0')
    const y = `${date.getFullYear()}`

    let formattedType

    switch (type) {
        case 'PEOPLE_WHO_LIKE_THIS_PAGE': {
            formattedType = 'USER_LIKE'
            break
        }
        case 'PEOPLE_WHO_FOLLOW_THIS_PAGE': {
            formattedType = 'USER_FOLLOW'
            break
        }
        case 'PAGES_THAT_LIKE_THIS_PAGE': {
            formattedType = 'PAGE_LIKE'
            break
        }
        default: {
            formattedType = 'UNKNOWN'
            break
        }
    }

    const hyperlink = `=HYPERLINK("https://facebook.com/${profile.id}")`

    return `${hyperlink},"${profile.name}",${d}-${m}-${y},${formattedType}`
}
