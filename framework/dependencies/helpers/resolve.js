const getFetch = async (path) => {
    let response
    try {
        response = await fetch(path)
        response = (response && response.ok) && await response.json() || null
    } catch (error) {
        console.error(`fecth failed: ${error} no data ${path}`)
        response = null
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

export const get = async (object) => {
    if (typeof object !== "object" || object === null) {
        console.error(`${object} no object`)
        return null
    }

    await Promise.all(Object.entries(object).map(async ([name, path]) => {
        const extension = getExtension(path)
        extension === "json" && (object[name] = await getFetch(path))
        extension !== "json" && (object[name] = await getImport(path))
    }))
    return object
}