import * as RESOLVE from "/framework/dependencies/helpers/resolve.js"

class Module {
    ANIMATION = {}
    FONT = []
    HELPER = {}
    STYLE = {}
    CUSTOM_STYLE = {}
    NAME = null
    #JSON = null
    #STATE = true

    #validateConfig({ animation, font, helper, style, custom_style, name }) {
        if (!animation && !font && !helper && !style && !custom_style && !name) {
            console.error("no config, what you want to do????", this)
            return null
        }

        if (!name) {
            console.error("no NAME in MODULE", this)
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
        for (const item of font) {
            if (!item.name || !item.src) {
                console.error(`no correct KEYS in font: ${item}`, this)
                this.#STATE = null
            }
            this.FONT.push(item)
        }
        this.#STATE && await this.HELPER.font.add(this.FONT, this.NAME)
    }

    async init({
        animation = null,
        font = null,
        helper = null,
        style = null,
        custom_style = null,
        name = null
    }) {
        /* validate config */
        if (!this.#validateConfig({ animation, font, helper, style, custom_style, name })) return null
        this.NAME = name

        /* add config for resolve */
        const config = {}
        helper && (config["helper"] = "/framework/config/helpers.json")

        /* resolve JSON config */
        Object.keys(config).length > 0 && (this.#JSON = await RESOLVE.get(config))

        /* resolve HELPER config*/
        helper && await this.#resolveHelpers(helper)

        /* resolve OTHERS DEPENDENCIES */
        const resolves = []
        font && resolves.push(this.#resolveFonts(font))

        await Promise.all(resolves)

        /* return */
        if (!this.#STATE) return null
        return true

    }
}
export default Module