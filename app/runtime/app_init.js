const appInit = async () => {

    /* level framework */
    const level = await import("/level/runtime/level_init.js")
    level.levelInit()


    /* landing module */
    const landing = await import("../modules/landing/main.js")
    await landing.init()
}

appInit()