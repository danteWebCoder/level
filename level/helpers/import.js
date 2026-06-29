const getFetch = async (path) => {
    const data = await fetch(path)

    if (!data.ok) {
        console.error(`fecth failed: ${data.status}`)
        return null
    }

    const jsonData = await data.json() ?? null
    if (!jsonData) {
        console.error("json not valid")
        return null
    }

    return jsonData
}

export const get = async (path) => {
    const extension = path.split(".").pop()
    if(!extension) {
        console.error("path is no a file?")
        return null
    }
    if(extension === "json") return await getFetch(path)

    return null
}