class ModuleResolver {
    NAME = null
    MODULES = {}
    DEPS = {}
    REGISTER = { LOCAL: null, GLOBAL: null }

    #JSON = {}
    #STATE = {
        initialized: false,
        working: false,
        error: false
    }

    #validateInit(name, modules) {
        if (!name || !modules) {
            console.error(this, "config error")
            return null
        }

        if (typeof name !== "string") {
            console.error(this, "name error")
            return null
        }

        if (typeof modules !== "object") {
            console.error(this, "modules error")
            return null
        }

/*         if (typeof styles !== "object") {
            console.error(this, "styles error")
            return null
        }
 */        return true
    }

    /* modules */
    async #importModules(object, target = null) {
        const resolveModules = async (path) => {
            try {
                let module = await import(path)
                return module.default ?? module
            } catch (error) {
                console.error(this, `import error ${error} ${path}`)
                this.#STATE.error = true
                return null
            }
        }

        target = target || this.MODULES
        const promises = Object.entries(object).map(async ([key, value]) => {
            if (typeof value === "string") {
                target[key] = await resolveModules(value)
            }

            if (typeof value === "object" && value !== null) {
                target[key] = {}
                await this.#importModules(value, target[key])
            }
        })
        await Promise.all(promises)
    }

    async #requireJSON() {
        let importJSON = null

        Object.entries(this.MODULES).forEach(([key, value]) => {
            const require = value.require || null
            if (!require) return
            if (require.helpers && !this.#JSON.helpers) this.#JSON.helpers = "/framework/config/helpers.json"
            if (require.animations && !this.#JSON.animations) this.#JSON.animations = "/framework/config/animations.json"
            if (require.dinamics && !this.#JSON.dinamics) this.#JSON.dinamics = "/framework/config/dinamics.json"
            if (require.components && !this.#JSON.components) this.#JSON.components = "/framework/config/components.json"
/*             if (require.helpers || require.animations || require.dinamics || require.components) importJSON = true
 */        })
    }

    async #resolveJSON(path) {
        console.log(path)
        let response
        try {
            response = await fetch(path)
            response = (response && response.ok) && await response.json() || null
        } catch (error) {
            console.error(this, `fecth failed: ${error} ${path}`)
            this.#STATE.error = true
            return null
        }

        if (!response) {
            console.error(this, `json not valid: ${path}`)
            this.#STATE.error = true
            response = null
        }
        console.log(response)
        return response
    }

    async #hydrateModule(module) {
        const dependencies = this.MODULES[module].require || null
        if (!dependencies || Object.keys(dependencies).length === 0) {
            console.error(this, `${module} require error`)
            this.#STATE.error = true
        }

        const jsonInfo = []
        dependencies.helpers && jsonInfo.push("helpers")
        dependencies.styles && jsonInfo.push("styles")
        dependencies.animations && jsonInfo.push("animations")
        dependencies.components && jsonInfo.push("components")



        let toHydrate = []
        /*         dependencies.helpers && toHydrate.push(await this.#resolveHelpers(dependencies.helpers))
         */
/*         await this.#resolve(toHydrate)
 */    }


    /*     async #resolve(object) {
            console.log(object)
            const resolves = Object.entries(object).map(async ([key, value]) => {
                const target = object === this.MODULES ? this.MODULES : this.#JSON
                if (typeof value === "string" && value.endsWith(".js")) {
                    console.log("str", value)
                    this.MODULES[key] = await this.#importModule(value)
                }
                if (typeof value === "string" && value.endsWith(".json")) {
                    object[key] = await this.#resolveJSON(value)
                }
                if (typeof value === "object") {
                    console.log("obj")
                    await this.#resolve(value);
                }
            })
            !this.#STATE.error && await Promise.all(resolves)
        }
     */

    /* dependencies */
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

    #addStyles(styles) {
        const injectLink = (key, value) => {
            const newLink = document.createElement("link")
            newLink.setAttribute("data-module", this.NAME)
            newLink.setAttribute("data-name", key)
            newLink.href = value
            newLink.rel = "stylesheet"
            document.head.appendChild(newLink)
        }

        Object.entries(styles).forEach(([key, value]) => {
            injectLink(key, value)
        })
    }


    initINFO() {
        console.info(this, `\nMODULERESOLVER {
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
        if (this.#STATE.initialized) {
            console.log(this, "ModuleResolver instance already initialized", this.#STATE)
            return null
        }
        /* reasign props */
        this.#STATE.working = true
        this.NAME = name

        /* validate params */
        if (!this.#validateInit(name, modules)) {
            this.initINFO()
            this.#STATE.error = true
        }

        /* modules & styles */
        if (!this.#STATE.error) {
            await this.#importModules(modules)
            this.#requireJSON()
            console.log(this.#JSON)

            this.#STATE.initialized = true
            this.#STATE.working = false
        }
    }
}
export default new ModuleResolver()