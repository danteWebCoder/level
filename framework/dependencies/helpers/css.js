const addLink = (item, module = null) => {
    const newLink = document.createElement("link")
    newLink.setAttribute("data-module", module)
    newLink.href = item.src
    newLink.rel = "stylesheet"
    document.head.appendChild(newLink)
}

export const add = ({
    css = null,
    module = null
}) => {
    if (!css) {
        console.error("HELPER CSS ADD - no styles")
        return null
    }

    if (!module) {
        console.error("HELPER CSS ADD - no name")
        return null
    }

    css.forEach(item => addLink(item, module))
    return true
}