import * as DOM from "/framework/dependencies/helpers/dom.js"
import * as CSS from "/framework/dependencies/helpers/css.js"
import * as FONT from "/framework/dependencies/helpers/font.js"
import * as RESOLVE from "/framework/dependencies/helpers/resolve.js"

export const init = async () => {
    console.log("landing")

    let module = await import("/framework/dependencies/classes/module.js")
    module = new module.default()

    const helpers = ["dom", "css", "font", "resolve"]

    const fonts = [
        { name: "neuropol", src: "/app/src/fonts/neuropol.otf" },
        { name: "nasa", src: "/app/src/fonts/nasalizationRG.otf" },
        { name: "nasi", src: "/app/src/fonts/nasi.otf" },
        { name: "digi", src: "/app/src/fonts/ds-digi.ttf" },
    ]

    const customStyles = ["neonLight"]

    const styles = {
        landing: "/app/modules/landing/styles/main.css",
    }

    const modules = {
        render: "/app/modules/landing/visual/render.js",
        logic: {
            counter: "/app/modules/landing/logic/infoCounters.js",
            events: "/app/modules/landing/logic/events.js"
        }

    }

    /* preload sequence */
    await module.init({
        font: fonts,
        helper: helpers,
        style: styles,
        custom_style: customStyles
    })

    await Promise.all([
        FONT.add(fonts),
        CSS.add(styles),
        RESOLVE.get(modules)
    ])


    /* init sequence */
    modules.render.init(DOM)
    modules.logic.counter.init(RESOLVE)
    modules.logic.events.init()
}
