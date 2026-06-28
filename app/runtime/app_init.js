const appInit = async () => {
    console.log("app init")
    const level = await import("/level/runtime/level_init.js")
    level.levelInit()
}

appInit()