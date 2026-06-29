import * as IMPORT from "/level/helpers/import.js"

export const init = async () => {
    const helpers = await IMPORT.get("/level/config/helpers.json")
    const helpersNum = helpers ? Object.keys(helpers).length : 0

    const animations = await IMPORT.get("/level/config/animations.json")
    const animationsNum = animations ? Object.keys(animations).length : 0

    const components = await IMPORT.get("/level/config/components.json")
    const componentsNum = components ? Object.keys(components).length : 0

    const helperCounter = document.querySelector("#helperCounter")
    const animationsCounter = document.querySelector("#animationsCounter")
    const componentsCounter = document.querySelector("#componentsCounter")

    helperCounter.textContent = helpersNum
    animationsCounter.textContent = animationsNum
    componentsCounter.textContent = componentsNum
}