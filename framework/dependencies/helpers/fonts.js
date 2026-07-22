const test = async (path) => {
    try {
        const test = await fetch(path, { method: 'HEAD' })
        return test.ok
    } catch (e) {
        return false
    }
}

const addFontStyle = (font, module = null) => {
    const fontStyle = document.createElement("style")
    fontStyle.dataset.font = font.name
    fontStyle.dataset.src = font.src
    module && (fontStyle.dataset.module = module)
    document.head.appendChild(fontStyle)
    return fontStyle
}

export const add = async ({
    fonts = null,
    module = null
}) => {
    const formatMap = {
        woff2: "woff2",
        woff: "woff",
        ttf: "truetype",
        otf: "opentype",
        eot: "embedded-opentype",
        svg: "svg"
    }

    const results = await Promise.all(fonts.map(async (font) => {
        const previousFont = document.head.querySelector(`style[data-src="${font.src}"]`)

        if (!previousFont) {
            const ext = font.src.split(".").pop()
            const format = formatMap[ext] || ext
            const testFont = await test(font.src)

            if (testFont) {
                const fontStyle = addFontStyle(font, module)
                fontStyle.textContent = `
                    @font-face {
                        font-family: "${font.name}";
                        src: url("${font.src}") format("${format}");
                    }
                `
                return { name: font.name, ok: true }
            } else {
                return { name: font.name, ok: false }
            }


        } else {
            if (module) {
                const previousModules = Array.from(previousFont.dataset.module.split(", "))
                if (!previousModules.includes(module)) {
                    previousModules.push(module)
                    previousFont.dataset.module = previousModules.join(", ")
                }
            }
            return { name: font.name, ok: true }
        }
    }))
    const validate = !results.some(result => result.ok === false)
    return { results, ok: validate }
}