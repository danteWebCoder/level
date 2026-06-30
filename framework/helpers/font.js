const addFontStyle = (name) => {
    const fontStyle = document.createElement("style")
    fontStyle.setAttribute("data-module", name)
    document.head.appendChild(fontStyle)
    return fontStyle
}


export const addFonts = (fonts, name) => {
    const fontStyle = addFontStyle(name)

    const formatMap = {
        woff2: "woff2",
        woff: "woff",
        ttf: "truetype",
        otf: "opentype",
        eot: "embedded-opentype",
        svg: "svg"
    }

    fonts.forEach(item => {
        Object.entries(item).forEach(([key, value]) => {
            const ext = item.src.split(".").pop()
            const format = formatMap[ext] || ext

            fontStyle.textContent += `
                @font-face {
                    font-family: "${item.name}";
                    src: url("${item.src}") format("${format}");
                }
            `
        })
    })
}