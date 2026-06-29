export const init = async () => {
    console.log("landing")

    const [render, infoCounters] = await Promise.all([
        import("/app/modules/landing/visual/render.js"),
        import("/app/modules/landing/logic/infoCounters.js")
    ])

    /* render sequence */
    render.init()
    infoCounters.init()
}
