export const init = async () => {
    console.log("landing")

    const [render] = await Promise.all([
        import("/app/modules/landing/render/render.js")
        /* logic */
        /* styles */
    ])

    /* render sequence */
    /* styles */
    render.init()
    /* logic */
}
