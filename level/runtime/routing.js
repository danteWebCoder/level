export const init = () => {
    const path = window.location.pathname
    const base = path === "/" ? "" : path.substring(0, path.lastIndexOf('/'))

    const baseTag = document.createElement('base')
    baseTag.href = `${window.location.origin}${base}`
    document.head.prepend(baseTag)
    console.log(`routing: ${base === "" ? "/" : base}`)
}

init()