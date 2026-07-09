const appInit = async () => {

    /* level framework */
    await import("../../framework/runtime/levelInit.js")
    const register = await import("../../framework/runtime/register.js")

    /* landing module */
    const landing = await import("/app/modules/landing/main.js")
    await landing.init(register)
}

appInit()