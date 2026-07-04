const addLink = (name, value, moduleName) => {
    const newLink = document.createElement("link")
    newLink.setAttribute("data-module", moduleName)
    newLink.href = value
    newLink.rel = "stylesheet"
    document.head.appendChild(newLink)
}

export const add = ({
    styles = null,
    moduleName = null
}) => {
    if (!styles) {
        console.error("no styles in CSS ADD")
        return null
    }

    if (!moduleName) {
        console.error("no name in CSS ADD")
        return null
    }

    Object.values(styles).forEach(value => {
        addLink(name, value, moduleName)
    })
    return true
}

/* export const addCustom = ({
    styles = null,
    moduleName = null
}) => {
    styles.forEach(item => {
        const linkName = moduleName + "_CUSTOM_" + item.name
        addLink(item.name, item.path, linkName)
    })
}
 */