import * as DOM from "/level/helpers/dom.js"

const fonts = [
    { name: "neuropol", src: "/app/src/fonts/neuropol.otf" },
    { name: "ronduit", src: "/app/src/fonts/ronduitCapitals_Light.woff" },
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
       </section>
        <section class="whiteBox mainBox">
            <div class="title2 title">
                Modular framework
                <ul class="infoBox">
                    <li class="counterBox">

                    </li>
                    <li class="counterBox">

                    </li>
                    <li class="counterBox">

                    </li>
                </ul>
            </div>
        </section>
    `
}