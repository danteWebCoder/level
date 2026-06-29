import * as IMPORT from "/level/helpers/import.js"

export const init = async () => {
    const helpers = await IMPORT.get("/level/config/helpers.json")
    const helpersNum = Object.keys(helpers).length || 0
    console.log(helpersNum)
}