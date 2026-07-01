import * as DOM from "/framework/dependencies/helpers/dom.js"
import * as CSS from "/framework/dependencies/helpers/css.js"
import * as FONT from "/framework/dependencies/helpers/font.js"

export const init = async () => {
    console.log("landing")

    const helpers = ["dom", "css", "font"]

    const fonts = [
        { name: "neuropol", src: "/app/src/fonts/neuropol.otf" },
        { name: "nasa", src: "/app/src/fonts/nasalizationRG.otf" },
        { name: "ronduit", src: "/app/src/fonts/ronduitCapitalsLight.otf" },
        { name: "nasi", src: "/app/src/fonts/nasi.otf" },
        { name: "neuropolitical", src: "/app/src/fonts/nasi.otf" },
    ]

    const styles = {
        landing: "/app/modules/landing/styles/main.css"
    }



    const [render, infoCounters] = await Promise.all([
        import("/app/modules/landing/visual/render.js"),
        import("/app/modules/landing/logic/infoCounters.js")
    ])

    /* render sequence */
    FONT.add
    CSS.add(styles)




    /* init sequence */
    render.init(DOM)
    infoCounters.init()
}
