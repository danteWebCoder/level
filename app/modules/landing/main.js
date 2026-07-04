import * as DOM from "/framework/dependencies/helpers/dom.js"
import * as CSS from "/framework/dependencies/helpers/css.js"
import * as FONT from "/framework/dependencies/helpers/fonts.js"
import * as RESOLVE from "/framework/dependencies/helpers/resolve.js"

export const init = async () => {
    console.log("landing")

    let module = await import("/framework/dependencies/classes/module.js")
    const landing = new module.default()

    const helpers = ["dom"]

    const fonts = [
        { name: "neuropol", src: "/app/src/fonts/neuropol.otf" },
        { name: "nasa", src: "/app/src/fonts/nasalizationRG.otf" },
        { name: "nasi", src: "/app/src/fonts/nasi.otf" },
        { name: "digi", src: "/app/src/fonts/digital-7.ttf" },
    ]

    const styles = {
        landing: "/app/modules/landing/styles/main.css",
    }

    const dinamics = ["neon"]

    const modules = {
        render: "/app/modules/landing/visual/render.js",
        logic: {
            counter: "/app/modules/landing/logic/infoCounters.js",
            events: "/app/modules/landing/logic/events.js"
        }
    }

    /* preload sequence */
    await landing.init({
        name: "landing-module",
        modules: modules,
        fonts: fonts,
        helpers: helpers,
        styles: styles,
        dinamics: dinamics
    })

    console.log(landing)
    /* init sequence */
    landing.MODULES.render.init(DOM)
    landing.MODULES.logic.counter.init(RESOLVE)
    landing.MODULES.logic.events.init()
}
