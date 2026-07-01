export const add = (
    styles = null
) => {
    /*     fonts.length && FONT.addFonts(fonts, "landing")
     */
    if(!styles) {
        console.error("no styles in addStyles call")
        return null
    }

    Object.entries(styles).forEach(([name, path]) => {
        const newLink = document.createElement("link")
        newLink.setAttribute("data-name", name)
        newLink.href = path
        newLink.rel = "stylesheet"
        document.head.appendChild(newLink)
    })
}
