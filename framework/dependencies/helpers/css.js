export const add = ({
    styles = null,
    name = null
}) => {
    if (!styles) {
        console.error("no styles in CSS ADD")
        return null
    }

    if (!name) {
        console.error("no name in CSS ADD")
        return null
    }

    Object.entries(styles).forEach(([style, path]) => {
        const newLink = document.createElement("link")
        newLink.setAttribute("data-module", name)
        newLink.href = path
        newLink.rel = "stylesheet"
        document.head.appendChild(newLink)
    })
    return true
}
