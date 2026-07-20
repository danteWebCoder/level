class ModuleResolver {
    NAME = null
    MODULES = {}
    REGISTER = { LOCAL: null, GLOBAL: null }
    STATE = {
        loaded: false,
        error: []
    }

    #JSON = {}

    #validateInit(name, modules) {
        if (!name || !modules) this.STATE.error.push("config error")
        if (typeof name !== "string") this.STATE.error.push("config name error")
        if (typeof modules !== "object") this.STATE.error.push("config modules error")
    }

    /* resolves*/
    async #test(path) {
        try {
            const test = await fetch(path, { method: 'HEAD' })
            return test.ok
        } catch (e) {
            return null
        }
    }

    async #resolveURL(path) {
        const test = await this.#test(path)
        if (!test) {
            this.STATE.error.push(`ERROR: import module - ${path}`)
            return null
        }
        const module = await import(path)
        return module?.default || module
    }

    async #resolveJSON(path) {
        const test = await this.#test(path)
        if (!test) {
            this.STATE.error.push(`ERROR: fetch json - ${path}`)
            return null
        }
        const response = await fetch(path)
        return await response.json()
    }

    async #resolveObject(object, typeModule = null) {
        await Promise.all(Object.entries(object).map(async ([key, value]) => {
            if (typeof value === "string") {
                if (value.endsWith(".json")) object[key] = await this.#resolveJSON(value)
                if (value.endsWith(".js")) {
                    object[key] = await this.#resolveURL(value)
                    typeModule && await this.#resolveMODULE(object[key])
                }
            }
            if (typeof value === "object" && value !== null) {
                const dinamicDeps = ["helpers", "animations", "dynamics", "components", "fonts", "css"]
                await this.#resolveObject(value, dinamicDeps.includes(key) ? false : true)
            }
        }))
    }

    /* modules */
    #validateModuleDEP(module) {
        const addError = (item) => this.STATE.error.push({ module: module, error: `${item} format error` })

        const arrayType = ["helpers", "animations", "dynamics", "components"]
        arrayType.forEach(item => {
            const type = module.dep[item] || null; /* sin ';' no detecta la declaracion */
            (type && !Array.isArray(type)) && addError(item)
        })
        const objectType = ["css", "fonts"] /* mas props en el futuro? */
        objectType.forEach(item => {
            (module.dep[item] && typeof module.dep[item] !== "object") && addError(item)
        })
    }

    async #resolveDEPS(module) {
        if (module?.dep) {
            /* styles & fonts */
            const lostHelpers = ["css", "fonts"]
            lostHelpers.forEach(item => {
                if (module.dep[item]) {
                    !module.dep.helpers && (module.dep["helpers"] = [])
                    !module.dep.helpers.includes(item) && module.dep.helpers.push(item)
                }
            })
            /* helpers, animations, dynamics, components */
            const dinamicDeps = ["helpers", "animations", "dynamics", "components"]
            await Promise.all(dinamicDeps.map(async (item) => {
                if (!this.#JSON[item]) {
                    this.#JSON[item] = await this.#resolveJSON(`/framework/config/${item}.json`)
                }
                module.dep[item] && await this.#resolveDEPENDENCIES(module, item)
            }))
            return module
        }
    }

    async #resolveMODULE(module) {
        let moduleResolved
        module.dep && this.#validateModuleDEP(module)
        !this.STATE.error.length && (moduleResolved = await this.#resolveDEPS(module))
        moduleResolved?.dep?.fonts && this.#injectCSS(moduleResolved, "fonts")
        moduleResolved?.dep?.css && this.#injectCSS(moduleResolved, "css")
    }

    /* module dependencies */
    async #resolveDEPENDENCIES(module, mode) {
        const initialDeps = [...module.dep[mode]]
        module.dep[mode] = {}

        initialDeps.forEach(item => {
            const path = this.#JSON[mode][item] || null
            !path && this.STATE.error.push("ERROR - lost JSON list")
            module.dep[mode][item.toUpperCase()] = path
        })
        !this.STATE.error.length && await this.#resolveObject(module.dep[mode])
    }

    /* apply styles and fonts */
    #injectCSS(module, mode) {
        module.dep[mode].forEach(item => {
            if (!item.name || !item.src) {
                this.STATE.error.push(`${item} /nERROR: ${mode} format`)
            }
        })
        module.dep.helpers[mode.toUpperCase()].add({ [mode]: module.dep[mode], module: this.NAME })
    }

    /* info */
    initINFO() {
        console.info(this, `\nMODULERESOLVER {
            init ({

            })
        }`)
    }

    async init({
        name = null,
        modules = null,
        styles = null,
    }) {
        if ((this.STATE.loaded === true && !this.STATE.error.length) || this.STATE.loaded === "working") {
            console.log(this, "ModuleResolver instance already initialized", this.STATE)
            return null
        }

        this.#validateInit(name, modules)
        if (this.STATE.error.length > 0) {
            this.initINFO()
            return null
        }

        this.STATE.loaded = "working"
        this.NAME = name
        this.MODULES = modules
        await this.#resolveObject(this.MODULES, true)


        if (this.STATE.error.length > 0) {
            this.STATE.loaded = null
            this.STATE.error.forEach(item => console.error(this, item))
            return null
        }
        this.STATE.loaded = true
        return this
    }
}
export default ModuleResolver