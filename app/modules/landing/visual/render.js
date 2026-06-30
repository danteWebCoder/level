import * as DOM from "/framework/helpers/dom.js"

const fonts = [
    { name: "neuropol", src: "/app/src/fonts/neuropol.otf" },
    { name: "nasa", src: "/app/src/fonts/nasalizationRG.otf" },
    { name: "ronduit", src: "/app/src/fonts/ronduitCapitalsLight.otf" },
    { name: "amped", src: "/app/src/fonts/amped.otf" },
    { name: "other", src: "/app/src/fonts/hemicube.ttf" },    
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
            <h1 class="title1 title">Level</h1>
            <h2 class="title2 title">Modular framework</h2>

            <div class="actionBox">
                <div class="button"><span class="text">Enter</span></div>
                <span class="separator"></span>
                <div class="button"><span class="text">Download</span></div>
                <span class="separator"></span>
                <div class="button"><span class="text">Info</span></div>
            </div>

       </section>
        <section class="whiteBox mainBox">
            <h3 class="title3">Progress</h3>
            <ul class="infoBox">
                <li class="counter">
                    <div class="title">
                        Helpers
                    </div>
                    <span id="helperCounter" class="number"></span>
                </li>
                <li class="counter">
                    <div class="title">
                        Animations
                    </div>
                    <span id="animationsCounter" class="number"></span>
                </li>
                <li class="counter">
                    <div class="title">
                        Components
                    </div>
                    <span id="componentsCounter" class="number"></span>
                </li> 
                </ul>
        </section>
    `
}