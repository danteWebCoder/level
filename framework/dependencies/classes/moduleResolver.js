class ModuleResolver {
    NAME = null
    MODULES = {}
    REGISTER = { LOCAL: null, GLOBAL: null }
    STATE = {
        loaded: false,
        error: []
    }

    #JSON = {}

    #INIT_validate(name, modules) {
        if (!name || !modules) this.STATE.error.push("config error")
        if (typeof name !== "string") this.STATE.error.push("config name error")
        if (typeof modules !== "object") this.STATE.error.push("config modules error")
    }

    /* resolves*/
    async #TEST_import(path) {
        try {
            const test = await fetch(path, { method: 'HEAD' })
            return test.ok
        } catch (e) {
            return null
        }
    }

    async #URL_resolve(path) {
        const test = await this.#TEST_import(path)
        if (!test) {
            this.STATE.error.push(`ERROR: import module - ${path}`)
            return null
        }
        const module = await import(path)
        return module?.default || module
    }

    async #JSON_resolve(path) {
        const test = await this.#TEST_import(path)
        if (!test) {
            this.STATE.error.push(`ERROR: fetch json - ${path}`)
            return null
        }
        const response = await fetch(path)
        return await response.json()
    }

    async #OBJECT_resolve(object, typeModule = null) {
        await Promise.all(Object.entries(object).map(async ([key, value]) => {
            if (typeof value === "string") {
                if (value.endsWith(".json")) object[key] = await this.#JSON_resolve(value)
                if (value.endsWith(".js")) {
                    object[key] = await this.#URL_resolve(value)
                    typeModule && await this.#module_resolve(object[key])
                }
            }
            if (typeof value === "object" && value !== null) {
                const dinamicDeps = ["helpers", "animations", "dynamics", "components", "fonts", "css"]
                await this.#OBJECT_resolve(value, dinamicDeps.includes(key) ? false : true)
            }
        }))
    }

    /* modules */
    async #moduleJSON_add(module, mode) {
        const initialDeps = [...module.dep[mode]]
        module.dep[mode] = {}

        initialDeps.forEach(item => {
            const path = this.#JSON[mode][item] || null
            !path && this.STATE.error.push("ERROR - lost JSON list")
            module.dep[mode][item.toUpperCase()] = path
        })
        !this.STATE.error.length && await this.#OBJECT_resolve(module.dep[mode])
    }

    #moduleDEP_validate(module) {
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

    async #moduleDEPS_resolve(module) {
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
                    this.#JSON[item] = await this.#JSON_resolve(`/framework/config/${item}.json`)
                }
                module.dep[item] && await this.#moduleJSON_add(module, item)
            }))
            return module
        }
    }

    async #module_resolve(module) {
        let moduleResolved
        module.dep && this.#moduleDEP_validate(module)
        !this.STATE.error.length && (moduleResolved = await this.#moduleDEPS_resolve(module))
        moduleResolved?.dep?.fonts && this.#injectCSS(moduleResolved, "fonts")
        moduleResolved?.dep?.css && this.#injectCSS(moduleResolved, "css")
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

        this.#INIT_validate(name, modules)
        if (this.STATE.error.length > 0) {
            this.initINFO()
            return null
        }

        this.STATE.loaded = "working"
        this.NAME = name
        this.MODULES = modules
        await this.#OBJECT_resolve(this.MODULES, true)


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