import { get as resolve } from "/framework/dependencies/helpers/resolve.js"

class Module {
    ANIMATIONS = []
    HELPERS = {}
    STYLES = {}
    DINAMICS = {}
    RESOLVE = resolve
    NAME = null
    MODULES = null
    LOCAL_REGISTER = null
    MODULES_REGISTER = null
    #JSON = {}
    #STATE = true /* true, null, loading, ready */

    #validateConfig({ modules, name, styles, local_register }) {
        if (!modules && !name && !styles) {
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


        if (styles && typeof styles !== "object") {
            console.error("STYLE config FORMAT ERROR, needed OBJECT", this)
            return null
        }

        /*         if (dinamics && !Array.isArray(dinamics)) {
                    console.error("DINAMICS config FORMAT ERROR, needed ARRAY", this)
                    return null
                }
         */
        if (local_register && typeof local_register !== "boolean") {
            console.error("LOCAL_REGISTER value TRUE / FALSE - default false")
            return null
        }
        return true
    }

    async #addHelpers(helpers) {
        const resolveHelpers = {}

        helpers.forEach(item => {
            const helperPath = this.#JSON.helpers[item] || null
            if (!helperPath) {
                console.error(`no HELPER ${item.toUpperCase()} found`, this)
                this.#STATE = null
            }
            resolveHelpers[item] = helperPath
        })

        this.#STATE && await this.RESOLVE(resolveHelpers)
        Object.entries(resolveHelpers).forEach(([key, value]) => {
            !this.HELPERS[key] && (this.HELPERS[key] = value)
        })
    }

    async addFonts(fonts) {
        if (fonts && typeof fonts !== "object") {
            console.error("FONTS config FORMAT ERROR, needed OBJECT", this)
            return null
        }

        for (const item of fonts) {
            if (!item.name || !item.src) {
                console.error(`no correct KEYS in font: ${item}`, this)
                this.#STATE = null
            }
        }
        console.log(fonts)
        this.#STATE && await this.HELPERS.fonts.add({ "fonts": fonts, "name": this.NAME })
    }

    async #addStyles(styles) {
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
        this.#STATE && await this.RESOLVE(this.DINAMICS)
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
        this.#STATE && await this.RESOLVE(this.ANIMATIONS)
    }

    async #resolveModules(modules) {
        if (!this.#STATE) return null
        this.MODULES = await this.RESOLVE(modules)
    }

    #validateHelpers() {

    }

    async init({
        name = null,
        modules = null,
        styles = null,
        register = null
        /*         animations = null,
                fonts = null,
                helpers = null,
                dinamics = null,
         */
    }) {
        this.#STATE = "loading"
        if (this.STATE === "ready" || this.STATE === "loading") {
            console.info("class previously initialized", this)
            return null
        }

        /* validate config */
        if (!this.#validateConfig({
            name: name,
            modules: modules,
            styles: styles,
            register: register
        })) return null


        this.NAME = name
        this.REGISTER = register
        await this.#resolveModules(modules)
        styles && this.#addStyles(styles)

        /* resolve JSON config */
        /*         Object.keys(config).length > 0 && (this.#JSON = await this.RESOLVE(config))
         */


        /* local register */

        /* return */
        if (!this.#STATE) return null
        this.#STATE = "ready"
        return true
    }

    async configure({
        helpers = null
    }) {
        /* resolve json */
        await Promise.all([
            helpers && (this.#JSON["helpers"] = "/framework/config/helpers.json")
        ])

        Object.keys(this.#JSON).length > 0 && await this.RESOLVE(this.#JSON)

        /* resolve dependencies */
        helpers && await this.#addHelpers(helpers)

    }
}
export default new Module()