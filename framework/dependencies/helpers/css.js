const tryFetch = async (name, path) => {
    try {
        const response = await fetch(path)
        if (!response.ok) return { name: name, src: path, error: `HTTP ${response.status} ${response.statusText}` }
        return { name: name, src: path, result: await response.text() }
    } catch (e) {
        return { name: name, src: path, error: `Network/CORS error: ${e.message} (${path})` }
    }
}

const addStyle = (item, module = null) => {
    const newStyle = document.createElement("style")
    newStyle.textContent = item.result
    newStyle.dataset.style = item.name
    newStyle.dataset.src = item.src
    module && (newStyle.dataset.module = module)
    document.head.appendChild(newStyle)
}

const validations = (css) => {
    if (!css) {
        console.error("HELPER CSS ADD - parameter error: css")
        return null
    }
    if (!Array.isArray(css)) {
        console.error("HELPER CSS ADD - parameter css error: format not array")
        return null
    }
    if (!css.length) {
        console.error("HELPER CSS ADD - parameter css error: array empty")
        return null
    }
    return true
}

export const add = async ({
    css = null,
    module = null
}) => {
    const config = validations(css)
    if (!config) return { results: null, ok: false }

    const imports = {}
    await Promise.all(css.map(async (item) => {
        const previousLink = document.head.querySelector(`style[data-src="${item.src}"]`)
        !previousLink && (imports[item.name] = await tryFetch(item.name, item.src))
    }))

    const lostCss = Object.values(imports).filter(value => value.error)
    lostCss.length && lostCss.forEach(item => console.error(`HELPER CSS ADD - ${item.name} ${item.error}`))

    Object.values(imports).forEach(item => addStyle(item, module))
    return { results: imports, ok: lostCss.length ? "partial" : true }
}