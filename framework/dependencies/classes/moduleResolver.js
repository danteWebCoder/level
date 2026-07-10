class ModuleResolver {
    NAME = null
    MODULES = null
    DEPS = {}
    REGISTER = { LOCAL: null, GLOBAL: null }

    #STATE = true /* true, null, working */


    #validateInit(name, modules, styles) {
        if (!name || !modules || !styles) {
            console.error("config error", this)
            return null
        }

        if (typeof name !== "string") {
            console.error("name error", this)
            return null
        }

        if (typeof modules !== "object") {
            console.error("modules error", this)
            return null
        }

        if (typeof styles !== "object") {
            console.error("styles error", this)
            return null
        }
        return true
    }

    initINFO() {
        console.info(this)
        console.info(`MODULERESOLVER {
            init ({
                name:          string - module name used for dom injects
                modules:       object - scripts used in module 
                styles:        object - stylesheets modules
            })
        }`)
    }

    async init({
        name = null,
        modules = null,
        styles = null,
    }) {

        /* validate params */
        !this.#validateInit(name, modules, styles) && this.initINFO()


    }
}
export default new ModuleResolver()