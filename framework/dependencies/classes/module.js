import * as RESOLVE from "/framework/dependencies/helpers/resolve.js"

class Module {
    NAME = null
    ANIMATIONS = []
    FONTS = []
    HELPERS = {}
    STYLES = {}
    DINAMICS = {}
    #JSON = null
    #STATE = true

    #validateConfig({ name, animations, fonts, helpers, styles, dinamics }) {
        if (!name && !animations && !fonts && !helpers && !styles && !dinamics) {
            console.error("no config, what you want to do????", this)
            return null
        }

        if (!name) {
            console.error("no NAME in MODULE CLASS", this)
            return null
        }
        /* falta validacion para animations */

        if (fonts && typeof fonts !== "object") {
            console.error("FONTS config FORMAT ERROR, needed OBJECT", this)
            return null
        }

        if (styles && typeof styles !== "object") {
            console.error("STYLE config FORMAT ERROR, needed OBJECT", this)
            return null
        }

        if (dinamics && !Array.isArray(dinamics)) {
            console.error("DINAMICS config FORMAT ERROR, needed ARRAY", this)
            return null
        }

        /* Forgotten dependencies */
        if (fonts && !helpers.includes("fonts")) helpers.push("fonts")
        if (styles && !helpers.includes("css")) helpers.push("css")

        return true
    }

    async #resolveHelpers(helpers) {
        helpers.forEach(item => {
            const helperPath = this.#JSON.helpers[item] || null
            if (!helperPath) {
                console.error(`no HELPER ${item.toUpperCase()} found`, this)
                this.#STATE = null
            }
            this.HELPERS[item] = helperPath
        })
        this.#STATE && await RESOLVE.get(this.HELPERS)
    }

    async #resolveFonts(fonts) {
        for (const item of fonts) {
            if (!item.name || !item.src) {
                console.error(`no correct KEYS in font: ${item}`, this)
                this.#STATE = null
            }
            this.FONTS.push(item)
        }
        this.#STATE && await this.HELPERS.fonts.add({ fonts: this.FONTS, name: this.NAME })
    }

    async #resolveStyles(styles) {
        this.HELPERS.css.add({ styles: styles, moduleName: this.NAME })
        return true
    }

    async #resolveDinamics(dinamics) {
        dinamics.forEach(item => {
            const dinamicPath = this.#JSON.styles[item] || null
            if (!dinamicPath) {
                console.error(`no STYLE ${item.toUpperCase()} found`, this)
                this.#STATE = null
            }
            this.DINAMICS[item] = dinamicPath
        })
        this.#STATE && await RESOLVE.get(this.DINAMICS)
    }

    async init({
        name = null,
        animations = null,
        fonts = null,
        helpers = null,
        styles = null,
        dinamics = null
    }) {
        /* validate config */
        if (!this.#validateConfig({ name, animations, fonts, helpers, styles, dinamics })) return null
        this.NAME = name

        /* add config for resolve */
        const config = {}
        helpers && (config["helpers"] = "/framework/config/helpers.json")
        dinamics && (config["styles"] = "/framework/config/dinamicStyles.json")

        /* resolve JSON config */
        Object.keys(config).length > 0 && (this.#JSON = await RESOLVE.get(config))

        /* resolve HELPER config*/
        helpers && await this.#resolveHelpers(helpers)

        /* resolve OTHERS DEPENDENCIES */
        const resolves = []
        fonts && resolves.push(this.#resolveFonts(fonts))
        styles && resolves.push(this.#resolveStyles(styles))
        dinamics && resolves.push(this.#resolveDinamics(dinamics))

        await Promise.all(resolves)

        /* return */
        if (!this.#STATE) return null
        return true
    }
}
export default Module