class ModuleResolver {
    NAME = null
    MODULES = {}
/*     dep = {}
 */    REGISTER = { LOCAL: null, GLOBAL: null }

    #JSON = {}
    #STATE = {
        loaded: false,
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

    /* resolves */
    async #resolveURL(path) {
        try {
            let module = await import(path)
            return module.default ?? module
        } catch (error) {
            console.error(this, `import error ${error} ${path}`)
            this.#STATE.error = true
            return null
        }
    }

    async #resolveJSON(path) {
        let response
        try {
            response = await fetch(path)
            response = (response && response.ok) && await response.json() || null
            if (response) return response
            else {
                console.error(this, `json not valid: ${path}`)
                this.#STATE.error = true
                return null
            }
        } catch (error) {
            console.error(this, `fecth failed: ${error} ${path}`)
            this.#STATE.error = true
            return null
        }
    }

    async #resolveObject(object) {
        await Promise.all(Object.entries(object).map(async ([key, value]) => {
            if (typeof value === "string") {
                if (value.endsWith(".json")) object[key] = await this.#resolveJSON(value)
                if (value.endsWith(".js")) {
                    object[key] = await this.#resolveURL(value)
                    await this.#resolveMODULE(object[key])
                }
            }
            if (typeof value === "object" && value !== null) {
                await this.#resolveObject(value)
            }
        }))
    }

    /* modules */
    async #resolveINFO(module) {
        const dep = module.dep || null
        if (!dep) return null

        const jsonInfo = ["helpers", "animations", "dinamics", "components"]
        let importJSON = null
        dep && await Promise.all(jsonInfo.map(async (item) => {
            if (dep[item] && !this.#JSON[item]) this.#JSON[item] = await this.#resolveJSON(`/framework/config/${item}.json`)
        }))
    }

    async #resolveMODULE(module) {
        await this.#resolveINFO(module)

        await Promise.all([
            module.dep?.helpers && await this.#addDependencies(module, "helpers"),
            module.dep?.animations && await this.#addDependencies(module, "animations"),
            module.dep?.dinamics && await this.#addDependencies(module, "dinamics"),   
            module.dep?.components && await this.#addDependencies(module, "components")                       
        ])
    }

    /* dependencies */
    async #addDependencies(module, mode) {

        const initialDeps = [...module.dep[mode]]
        module.dep[mode] = {}

        initialDeps.forEach(item => {
            const path = this.#JSON[mode][item] || null
            if (!path) {
                console.error(`no ${mode.toUpperCase()} ${item.toUpperCase()} found`, this)
                this.#STATE.error = null
            }
            module.dep[mode][item] = path
        })
        !this.#STATE.error && await this.#resolveObject(module.dep[mode])
    }

    async #addAnimations(module) {

    }
    /*    
    
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
     */

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
        if (this.#STATE.loaded || this.#STATE.loaded === "working") {
            console.log(this, "ModuleResolver instance already initialized", this.#STATE)
            return null
        }
        /* reasign props */
        this.#STATE.loaded = "working"
        this.NAME = name
        this.MODULES = modules

        /* validate params */
        if (!this.#validateInit(name, modules)) {
            this.initINFO()
            this.#STATE.error = true
        }

        /* modules & styles */
        if (!this.#STATE.error) {
            await this.#resolveObject(this.MODULES)



            this.#STATE.loaded = true
        }
    }
}
export default new ModuleResolver()