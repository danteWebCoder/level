import moduleResolver from "/framework/dependencies/classes/moduleResolver.js"

export const init = async () => {
    const modules = {
        render: "/app/modules/landing/visual/render.js",
        logic: {
            counter: "/app/modules/landing/logic/infoCounters.js",
            events: "/app/modules/landing/logic/events.js"
        }
    }

    /* preload sequence */
    const landing = new moduleResolver()
    await landing.init({
        name: "landing",
        modules: modules,
        register: null,
    })

    /* init sequence */
    console.log(landing)
    if (!landing.STATE.loaded) return null
    landing.MODULES.render.init()
/*     landing.MODULES.logic.counter.init()
    landing.MODULES.logic.events.init()
 */}
