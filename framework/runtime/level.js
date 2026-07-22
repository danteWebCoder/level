import { config } from "/framework/config/level.js"

const init = async () => {

    /* routing */
    const routing = await import("./routing.js")
    const base = routing.init()

    /* register */

    config.verbose && console.info(config, {
        base: base
    })
}

init()