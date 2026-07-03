import * as RESOLVE from "/framework/dependencies/helpers/resolve.js"

class Module {
    ANIMATION = {}
    FONT = {}
    HELPER = {}
    STYLE = {}
    CUSTOM_STYLE = {}
    #JSON = null
    #STATE = true

    #validateConfig(animation, font, helper, style, custom_style) {
        if (!animation && !font && !helper && !style && !custom_style) {
            console.error("no config, what you want to do????", this)
            return null
        }

        /* falta validacion para animation */

        if (typeof font !== "object") {
            console.error("FONT config FORMAT ERROR, must be OBJECT", this)
            return null
        }

        /* Forgotten dependencies */
        if (font && !helper.includes("font")) helper.push("font")

        return true
    }

    async #resolveHelpers(helper) {
        helper.forEach(item => {
            const helperPath = this.#JSON.helper[item] || null
            if (!helperPath) {
                console.error(`no helper ${item.toUpperCase()} found`, this)
                this.#STATE = null
            }
            this.HELPER[item] = helperPath
        })
        this.#STATE && await RESOLVE.get(this.HELPER)
    }

    async #resolveFonts(font) {

    }

    async init({
        animation = null,
        font = null,
        helper = null,
        style = null,
        custom_style = null
    }) {

        /* validate config */
        if (!this.#validateConfig(animation, font, helper, style, custom_style)) return null

        /* add config for resolve */
        const config = {}
        helper && (config["helper"] = "/framework/config/helpers.json")

        /* resolve JSON config */
        Object.keys(config).length > 0 && (this.#JSON = await RESOLVE.get(config))

        /* resolve MODULE config*/
        const resolves = []
        helper && resolves.push(this.#resolveHelpers(helper))
        font && resolves.push(this.#resolveFonts(font))

        await Promise.all(resolves)

        if (!this.#STATE) return null
        return true

    }
}
export default Module