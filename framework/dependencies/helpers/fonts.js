const addFontStyle = (font, module = null) => {
    const fontStyle = document.createElement("style")
    fontStyle.dataset.font = font.name
    fontStyle.dataset.src = font.src
    module && (fontStyle.dataset.module = module)
    document.head.appendChild(fontStyle)
    return fontStyle
}

const verifyExists = (font) => {
    return Array.from(document.head.querySelectorAll("style")).find(item => item.dataset.src === font.src) || false
}

export const add = ({
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

    fonts.forEach((font) => {
        const previousFont = verifyExists(font)
        
        if (!previousFont) {
            const ext = font.src.split(".").pop()
            const format = formatMap[ext] || ext
            const fontStyle = addFontStyle(font, module)

            fontStyle.textContent = `
                @font-face {
                    font-family: "${font.name}";
                    src: url("${font.src}") format("${format}");
                }
            `
        } else {
            if (module) {
                const previousModules = Array.from(previousFont.dataset.module.split(", "))
                if (!previousModules.includes(module)) {
                    previousModules.push(module)
                    previousFont.dataset.module = previousModules.join(", ")
                }
            }
        }
    })
}