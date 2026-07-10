import module from "/framework/dependencies/classes/moduleResolver.js"

export const init = async () => {
    const styles = {
        landing: "/app/modules/landing/styles/main.css",
    }

    const dinamics = ["neon"]

    const animations = ["glitch"]

    const modules = {
        render: "/app/modules/landing/visual/render.js",
        logic: {
            counter: "/app/modules/landing/logic/infoCounters.js",
            events: "/app/modules/landing/logic/events.js"
        }
    }

    /* preload sequence */
    await module.init({
        name: "landing-module",
        modules: modules,
        styles: styles,
        register: true
    })

    console.log(module)
    /* init sequence */
/*     module.MODULES.render.init(module)
 *//*     module.MODULES.logic.counter.init(module)
    module.MODULES.logic.events.init(module)
 */}
