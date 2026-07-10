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
    #JSON = null
    #STATE = true /* true, null, loading, ready */

    #validateConfig({ modules, name, animations,  helpers, styles, dinamics, local_register }) {
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


        if (styles && typeof styles !== "object") {
            console.error("STYLE config FORMAT ERROR, needed OBJECT", this)
            return null
        }

        if (dinamics && !Array.isArray(dinamics)) {
            console.error("DINAMICS config FORMAT ERROR, needed ARRAY", this)
            return null
        }

        if (local_register && typeof local_register !== "boolean") {
            console.error("LOCAL_REGISTER value TRUE / FALSE - default false")
            return null
        }
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
        this.#STATE && await this.RESOLVE(this.HELPERS)
    }

    async addFonts(fonts) {
        console.log(fonts)
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
        this.#STATE && await this.HELPERS.fonts.add({ "fonts": fonts, "name": this.NAME })
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

    async resolveModules(modules) {
        if (!this.#STATE) return null
        this.MODULES = await this.RESOLVE(modules)
        return true
    }

    /* api methods */
    #registerEvent() {

    }

    #unregisterEvent() {

    }

    async init({
        name = null,
        modules = null,
        animations = null,
/*         fonts = null,
 */        helpers = null,
        styles = null,
        dinamics = null,
        register = null
    }) {
        this.#STATE = "loading"
        if (this.STATE === "ready" || this.STATE === "loading") {
            console.info("class previously initialized", this)
            return null
        }
        /* validate config */
        if (!this.#validateConfig({ modules, name, animations,  helpers, styles, dinamics })) return null
        this.NAME = name
        this.REGISTER = register

        /* add config for resolve */
        const config = {}
        helpers && (config["helpers"] = "/framework/config/helpers.json")
        dinamics && (config["styles"] = "/framework/config/dinamicStyles.json")
        animations && (config["animations"] = "/framework/config/animations.json")

        /* resolve JSON config */
        Object.keys(config).length > 0 && (this.#JSON = await this.RESOLVE(config))

        /* API */
        helpers && await this.#resolveHelpers(helpers)

        await Promise.all([
            modules && this.resolveModules(modules),
/*             fonts && this.#addFonts(fonts),
 */            styles && this.#resolveStyles(styles),
            dinamics && this.#resolveDinamics(dinamics),
            animations && this.#resolveAnimations(animations),
        ])


        /* local register */

        /* return */
        if (!this.#STATE) return null
        this.#STATE = "ready"
        return true
    }
}
export default new Module()