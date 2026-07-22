const appInit = async () => {

    /* level framework */
    await import("../../framework/runtime/level.js")

    /* landing module */
    const landing = await import("/app/modules/landing/main.js")
    await landing.init()
}

appInit()