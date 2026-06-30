const appInit = async () => {

    /* level framework */
    await import("../../framework/runtime/levelInit.js")

    /* landing module */
    const landing = await import("/app/modules/landing/main.js")
    await landing.init()
}

appInit()