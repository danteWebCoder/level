export const add = ({
    element = null,
    id = null,
    box = null,
    css = [/* classes */],
    attr = [/* objects */]
}) => {
    if (!element) {
        console.error("DOM add: no element declared")
        return null
    }

    const newElement = document.createElement(element)

    id && (newElement.id = id)
    css.length > 0 && (newElement.className = css.join(" "))
    attr.length > 0 && attr.forEach(item => {
        Object.entries(item).forEach(([key, value]) => {
            newElement.setAttribute(key, value)
        })
    })

    box && box.appendChild(newElement)
    return newElement
}