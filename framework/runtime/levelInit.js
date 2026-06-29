export const levelInit = async () => {
    const verbose = true

    const routing = await import("./routing.js")
    const base = routing.init()

    verbose && console.info({level:
        {base: base}
    })
}