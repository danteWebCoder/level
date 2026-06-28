import * as DOM from "/level/helpers/dom.js"

export const init = () => {
    const mainBox = DOM.add({
        element: "div",
        css: ["mainBox"]
    })

    const whiteBox = DOM.add({
        element: "section",
        css: ["whiteBox"],
        box: mainBox
    })

    const blackBox = DOM.add({
        element: "section",
        css: ["blackBox"],
        box: mainBox
    })

    document.body.appendChild(mainBox)
}