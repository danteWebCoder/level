const appInit = async () => {

    /* level framework */
    const level = await import("/framework/runtime/levelInit.js")
    level.levelInit()


    /* landing module */
    const landing = await import("../modules/landing/main.js")
    await landing.init()
}

appInit()