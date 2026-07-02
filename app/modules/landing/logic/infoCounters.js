export const init = async (RESOLVE) => {
    const info = await RESOLVE.get({
        helpers: "/framework/config/helpers.json",
        styles: "/framework/config/styles.json",
        animations: "/framework/config/animations.json",
        components: "/framework/config/components.json"
    })

    const helperCounter = document.querySelector("#helpersCounter")
    const stylesCounter = document.querySelector("#stylesCounter")
    const animationsCounter = document.querySelector("#animationsCounter")
    const componentsCounter = document.querySelector("#componentsCounter")

    helperCounter.textContent = Object.keys(info.helpers).length || 0
    stylesCounter.textContent = Object.keys(info.styles ?? {}).length || 0
    animationsCounter.textContent = Object.keys(info.animations ?? {}).length || 0
    componentsCounter.textContent = Object.keys(info.components ?? {}).length || 0
}