const addFontStyle = (font, name) => {
    const fontStyle = document.createElement("style")
    fontStyle.dataset.module = name
    fontStyle.dataset.font = font.name
    document.head.appendChild(fontStyle)
    console.log(fontStyle)
    return fontStyle
}

export const add = ({
    fonts = null,
    name = null
}) => {

    const formatMap = {
        woff2: "woff2",
        woff: "woff",
        ttf: "truetype",
        otf: "opentype",
        eot: "embedded-opentype",
        svg: "svg"
    }

    fonts.forEach(item => {
        const ext = item.src.split(".").pop()
        const format = formatMap[ext] || ext
        const fontStyle = addFontStyle(item, name)

        fontStyle.textContent += `
            @font-face {
                font-family: "${item.name}";
                src: url("${item.src}") format("${format}");
            }
        `
    })
}