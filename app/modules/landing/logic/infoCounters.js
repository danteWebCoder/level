export const init = async (RESOLVE) => {
    const info = await RESOLVE.get({
        helpers: "/framework/config/helpers.json",
        styles: "/framework/config/dinamicStyles.json",
        animations: "/framework/config/animations.json",
        components: "/framework/config/components.json"
    })

    const helpersNum = Object.keys(info.helpers).length || 0
    const stylesNum = Object.keys(info.styles).length || 0
    const animationsNum = Object.keys(info.animations ?? {}).length || 0
    const componentsNum = Object.keys(info.components ?? {}).length || 0

    const helpersCounter = document.querySelector("#helpersCounter")
    const stylesCounter = document.querySelector("#stylesCounter")
    const animationsCounter = document.querySelector("#animationsCounter")
    const componentsCounter = document.querySelector("#componentsCounter")

    helpersCounter.textContent = helpersNum
    stylesCounter.textContent = stylesNum
    animationsCounter.textContent = animationsNum
    componentsCounter.textContent = componentsNum

    const backHelpers = document.querySelector("#backHelpers")
    const backStyles = document.querySelector("#backStyles")
    const backAnimations = document.querySelector("#backAnimations")
    const backComponents = document.querySelector("#backComponents")

    backHelpers.textContent += helpersNum
    backStyles.textContent += stylesNum
    backAnimations.textContent += animationsNum
    backComponents.textContent += componentsNum
}