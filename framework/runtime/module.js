import { config } from "/framework/config/level.js"
import registry from "/framework/runtime/registry.js"

class ModuleResolver {
    NAME = null
    MODULES = {}
    REGISTRY = {
        local: {

        }
    }
    STATE = {
        loaded: false,
        error: []
    }

    #JSON = {}

    #INIT_validate(name, modules) {
        if (!name || !modules) this.STATE.error.push("INIT config error")
        if (typeof name !== "string") this.STATE.error.push("INIT config name error")
        if (typeof modules !== "object") this.STATE.error.push("INIT config modules error")
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
                    const module = object[key] = await this.#URL_resolve(value)
                    if (typeModule && module.dep) await this.#module_resolve(module)
                }
            }
            if (typeof value === "object" && value !== null) {
                const dinamicDeps = ["helpers", "animations", "dynamics", "components", "fonts", "css"]
                await this.#OBJECT_resolve(value, dinamicDeps.includes(key) ? false : true)
            }
        }))
    }

    /* modules */
    async #add_JSON(module, mode) {
        const initialDeps = [...module.dep[mode]]
        module.dep[mode] = {}

        initialDeps.forEach(item => {
            const path = this.#JSON[mode][item] || null
            !path && this.STATE.error.push("ERROR - lost JSON list")
            module.dep[mode][item.toUpperCase()] = path
        })
        !this.STATE.error.length && await this.#OBJECT_resolve(module.dep[mode])
    }

    #validate_DEPS(module) {
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

    async #resolve_DEPS(module) {
        const dinamicDeps = ["helpers", "animations", "dynamics", "components"]
        await Promise.all(dinamicDeps.map(async (item) => {
            if (!this.#JSON[item]) {
                this.#JSON[item] = await this.#JSON_resolve(`/framework/config/${item}.json`)
            }
            module.dep[item] && await this.#add_JSON(module, item)

        }))
        return module
    }

    #wrapper_DEPS(module) {
        /* wrapper fonts */
        if (module.dep?.helpers?.FONTS) {
            const originCode = { ...module.dep.helpers.FONTS }

            module.dep.helpers.FONTS = {
                add: async ({ fonts, module }) => { 
                    const result = await originCode.add({ 'fonts': fonts, 'module': module })
                    console.log(result)
                    result.ok && registry.addGlobal({
                        type: "fonts",
                        item: fonts,
                        reg: this.REGISTRY
                    })
                    !result.ok && this.STATE.error.push("ERROR - font lost", result.results.find(item => item.ok === false))
                }
            }
        }
    }

    async #module_resolve(module) {
        this.#validate_DEPS(module)
        module.dep["origin"] = { ...module.dep }
        !this.STATE.error.length && (module = await this.#resolve_DEPS(module))
        this.#wrapper_DEPS(module)
    }

    /* apply styles and fonts */
    #inject_CSS(module, mode) {
        module.dep[mode].forEach(item => {
            if (!item.name || !item.src) {
                this.STATE.error.push(`${item} /nERROR: ${mode} format`)
            }
        })
        module.dep.helpers[mode.toUpperCase()].add({ [mode]: module.dep[mode], module: this.NAME })
    }

    #getModules = (object, obj) => {
        Object.entries(object).forEach(([key, value]) => {
            value[Symbol.toStringTag] === "Module" && (obj[key] = value)
            !value[Symbol.toStringTag] && this.#getModules(value, obj)
        })
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

        /* resolve modules */
        await Promise.all([
            this.#OBJECT_resolve(this.MODULES, true),
        ])

        /* if errors return */
        if (this.STATE.error.length > 0) {
            this.STATE.loaded = null
            this.STATE.error.forEach(item => console.error(this, item))
            return null
        }

        /* if no errors register */
        const resolvedModules = {}
        this.#getModules(this.MODULES, resolvedModules)

        await Promise.all(Object.entries(resolvedModules).map(async ([name, module]) => {
            module.dep?.fonts && this.#inject_CSS(module, "fonts")
            module.dep?.css && this.#inject_CSS(module, "css")
        }))

        /* ended */
        this.STATE.loaded = true
        return true
    }
}
export default ModuleResolver