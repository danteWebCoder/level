import { get as RESOLVE } from "/framework/dependencies/helpers/resolve.js"

class Module {
    NAME = null
    MODULES = null
    ANIMATIONS = []
    FONTS = []
    HELPERS = {}
    STYLES = {}
    DINAMICS = {}
    #JSON = null
    #STATE = true /* true, null, loading, ready */

    #validateConfig({ modules, name, animations, fonts, helpers, styles, dinamics }) {
        if (!modules && !name && !animations && !fonts && !helpers && !styles && !dinamics) {
            console.error("no config, what you want to do????", this)
            return null
        }

        if (modules && typeof modules !== "object") {
            console.error("MODULES config FORMAT ERROR, needed OBJECT", this)
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
        this.#STATE && await RESOLVE(this.HELPERS)
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
        this.#STATE && await RESOLVE(this.DINAMICS)
    }

    async #resolveAnimations(animations) {
        animations.forEach(item => {
            const dinamicPath = this.#JSON.animations[item] || null
            if (!dinamicPath) {
                console.error(`no ANIMATION ${item.toUpperCase()} found`, this)
                this.#STATE = null
            }
            this.ANIMATIONS[item] = dinamicPath
        })
        this.#STATE && await RESOLVE(this.ANIMATIONS)
    }

    async #resolveModules(modules) {
        if (!this.#STATE) return null
        this.MODULES = await RESOLVE(modules)
        return true
    }

    async init({
        name = null,
        modules = null,
        animations = null,
        fonts = null,
        helpers = null,
        styles = null,
        dinamics = null
    }) {
        this.#STATE = "loading"
        if (this.STATE === "ready" || this.STATE === "loading") {
            console.info("class previously initialized", this)
            return null
        }
        /* validate config */
        if (!this.#validateConfig({ modules, name, animations, fonts, helpers, styles, dinamics })) return null
        this.NAME = name

        /* add config for resolve */
        const config = {}
        helpers && (config["helpers"] = "/framework/config/helpers.json")
        dinamics && (config["styles"] = "/framework/config/dinamicStyles.json")
        animations && (config["animations"] = "/framework/config/animations.json")

        /* resolve JSON config */
        Object.keys(config).length > 0 && (this.#JSON = await RESOLVE(config))

        /* resolve HELPER config*/
        helpers && await this.#resolveHelpers(helpers)

        /* resolve OTHERS DEPENDENCIES */
        await Promise.all([
            modules && this.#resolveModules(modules),
            fonts && this.#resolveFonts(fonts),
            styles && this.#resolveStyles(styles),
            dinamics && this.#resolveDinamics(dinamics),
            animations && this.#resolveAnimations(animations)
        ])

        /* return */
        if (!this.#STATE) return null
        this.#STATE = "ready"
        return true
    }
}
export default Module