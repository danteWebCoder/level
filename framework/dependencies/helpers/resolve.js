const getFetch = async (path) => {
    let response
    try {
        response = await fetch(path)
        response = (response && response.ok) && await response.json() || null
    } catch (error) {
        console.error(`fecth failed: ${error} no data ${path}`)
        return null
    }

    if (!response) {
        console.error(`json not valid: ${path}`)
        response = null
    }
    return response
}

const getImport = async (path) => {
    let module
    try {
        module = await import(path)
        module = module.default ?? module
    } catch (error) {
        console.error(`import error ${error} ${path}`)
        module = null
    }
    return module
}

const getExtension = (path) => {
    const extension = path.split(".").pop()
    if (!extension) {
        console.error("path is no a file with extension?")
        return null
    }
    return extension
}

export const get = async (object = null) => {
    if (!object) {
        console.error("RESOLVE helper: call without object to resolve")
        return null
    }

    if (object.resolved) {
        console.error("previous resolved:", object)
        return object
    }

    if (typeof object !== "object" || object === null) {
        console.error(`${object} no object`)
        return null
    }

    await Promise.all(Object.entries(object).map(async ([name, value]) => {
        typeof value === "object" && await get(value)

        if (typeof value === "string") {
            const extension = getExtension(value)
            extension === "json" && (object[name] = await getFetch(value))
            extension !== "json" && (object[name] = await getImport(value))
        }
    }))
    return object
}