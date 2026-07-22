const addLink = (item, module = null) => {
    const newLink = document.createElement("link")
    module && (newLink.dataset.module = module)
    newLink.href = item.src
    newLink.rel = "stylesheet"
    document.head.appendChild(newLink)
}

export const add = async ({
    css = null,
    module = null
}) => {
    if (!css) {
        console.error("HELPER CSS ADD - no styles")
        return null
    }

    css.forEach(item => addLink(item, module))
    return true
}