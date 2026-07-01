export const init = async (RESOLVE) => {
    const info = await RESOLVE.get({
        helpers: "/framework/config/helpers.json",
/*         styles: "/framework/config/styles.json",
        animations: "/framework/config/animations.json",
        components: "/framework/config/components.json"
 */    })

    RESOLVE.get(info)
    console.log(info)

    const helpersNum = Object.keys(info.helpers).length || 0
    const stylesNum = Object.keys(info.styles ?? {}).length || 0
    const animationsNum = Object.keys(info.animations ?? {}).length || 0
    const componentsNum = Object.keys(info.components ?? {}).length || 0

    const helperCounter = document.querySelector("#helpersCounter")
    const stylesCounter = document.querySelector("#stylesCounter")
    const animationsCounter = document.querySelector("#animationsCounter")
    const componentsCounter = document.querySelector("#componentsCounter")

    helperCounter.textContent = helpersNum
    stylesCounter.textContent = stylesNum
    animationsCounter.textContent = animationsNum
    componentsCounter.textContent = componentsNum
}