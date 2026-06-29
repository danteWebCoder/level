import * as DOM from "/framework/helpers/dom.js"

const fonts = [
    { name: "neuropol", src: "/app/src/fonts/neuropol.otf" },
    { name: "ronduit", src: "/app/src/fonts/ronduitCapitalsLight.woff" },
    { name: "nasa", src: "/app/src/fonts/nasalization_rg.otf" },
    { name: "matrix", src: "/app/src/fonts/whiteRabbit.woff" },
]

const addFontStyle = () => {
    const fontStyle = document.createElement("style")
    document.head.appendChild(fontStyle)
    return fontStyle
}

const addFonts = (fonts) => {
    const fontStyle = addFontStyle()

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

const addStyles = () => {
    fonts.length && addFonts(fonts)
    const newLink = document.createElement("link")
    newLink.href = "/app/modules/landing/styles/render.css"
    newLink.rel = "stylesheet"
    document.head.appendChild(newLink)
}

export const init = () => {
    addStyles()

    const mainBox = DOM.add({
        element: "div",
        css: ["landingBox"],
        node: document.body
    })

    mainBox.innerHTML = `
       <section class="blackBox mainBox">
            <div class="title1 title">Level</div>
            <div class="title2 title">Modular framework</div>
       </section>
        <section class="whiteBox mainBox">
            <ul class="infoBox">
                <li class="counter">helpers <span id="helperCounter" class="number"></span></li>
                <li class="counter">animations <span id="animationsCounter" class="number"></span></li>
                <li class="counter">components <span id="componentsCounter" class="number"></span></li>
            </ul>
        </section>
    `
}