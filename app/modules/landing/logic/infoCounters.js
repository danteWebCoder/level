import * as IMPORT from "/framework/dependencies/helpers/import.js"

export const init = async () => {
    const helpers = await IMPORT.get("/framework/config/helpers.json")
    const helpersNum = helpers ? Object.keys(helpers).length : 0

    const styles = await IMPORT.get("/framework/config/styles.json")
    const stylesNum = styles ? Object.keys(components).length : 0

    const animations = await IMPORT.get("/framework/config/animations.json")
    const animationsNum = animations ? Object.keys(animations).length : 0

    const components = await IMPORT.get("/framework/config/components.json")
    const componentsNum = components ? Object.keys(components).length : 0

    const helperCounter = document.querySelector("#helperCounter")
    const animationsCounter = document.querySelector("#animationsCounter")
    const stylesCounter = document.querySelector("#stylesCounter")
    const componentsCounter = document.querySelector("#componentsCounter")

    helperCounter.textContent = helpersNum
    stylesCounter.textContent = stylesNum
    animationsCounter.textContent = animationsNum
    componentsCounter.textContent = componentsNum
}