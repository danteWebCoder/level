import * as DOM from "/framework/dependencies/helpers/dom.js"
import * as CSS from "/framework/dependencies/helpers/css.js"
import * as FONT from "/framework/dependencies/helpers/font.js"
import * as RESOLVE from "/framework/dependencies/helpers/resolve.js"

export const init = async () => {
    console.log("landing")

    const helpers = ["dom", "css", "font", "resolve"]

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

    const modules = {
        render: "/app/modules/landing/visual/render.js",
        counter: "/app/modules/landing/logic/infoCounters.js"
    }

    /* preload sequence */
    await Promise.all([
        FONT.add(fonts),
        CSS.add(styles),
        RESOLVE.get(modules)
    ])

    /* init sequence */
    modules.render.init(DOM)
    modules.counter.init(RESOLVE)
}
