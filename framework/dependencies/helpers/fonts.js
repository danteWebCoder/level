const addFontStyle = (font, module = null) => {
    const fontStyle = document.createElement("style")
    module && (fontStyle.dataset.module = module)
    fontStyle.dataset.font = font.name
    document.head.appendChild(fontStyle)
    return fontStyle
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
        const ext = font.src.split(".").pop()
        const format = formatMap[ext] || ext
        const fontStyle = addFontStyle(font, module)

        fontStyle.textContent = `
            @font-face {
                font-family: "${font.name}";
                src: url("${font.src}") format("${format}");
            }
        `
    })
}