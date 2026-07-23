const testFetch = async (path) => {
    try {
        const fetchResult = await fetch(path, { method: 'HEAD' })
        return fetchResult.ok
    } catch (e) { return false }
}

const addFontStyle = (font, format, module = null) => {
    const fontStyle = document.createElement("style")
    fontStyle.dataset.font = font.name
    fontStyle.dataset.src = font.src
    module && (fontStyle.dataset.module = module)
    document.head.appendChild(fontStyle)

    fontStyle.textContent = `
        @font-face {
            font-family: "${font.name}";
            src: url("${font.src}") format("${format}");
        }`
}

const formatMap = {
    woff2: "woff2",
    woff: "woff",
    ttf: "truetype",
    otf: "opentype",
    eot: "embedded-opentype",
    svg: "svg"
}

const validations = (fonts) => {
    if (!fonts) {
        console.error("HELPER FONTS ADD - parameter error: no fonts")
        return null
    }
    if (!Array.isArray(fonts)) {
        console.error("HELPER FONTS ADD - parameter fonts error: format not array")
        return null
    }
    if (!fonts.length) {
        console.error("HELPER FONTS ADD - parameter fonts error: array empty")
        return null
    }
    return true
}

export const add = async ({
    fonts = null,
    module = null
}) => {
    const config = validations(fonts)
    if (!config) return { results: null, ok: false }

    const results = await Promise.all(fonts.map(async (font) => {
        const previousFont = document.head.querySelector(`style[data-src="${font.src}"]`)

        if (!previousFont) {
            const ext = font.src.split(".").pop()
            const format = formatMap[ext] || ext
            const testFont = await testFetch(font.src)

            if (testFont) {
                addFontStyle(font, format, module)
                return { name: font.name, ok: true }
            } else {
                return { name: font.name, ok: false }
            }
        } else {
            if (module) {
                const previousInject = previousFont.dataset.module?.split(", ") || []
                if (!previousInject.includes(module)) {
                    previousInject.push(module)
                    previousFont.dataset.module = previousInject.join(", ")
                }
            }
            return { name: font.name, ok: true }
        }
    }))
    const validate = !results.some(result => result.ok === false)
    return { results, ok: validate }
}