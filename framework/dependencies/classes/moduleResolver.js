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

    async #resolveObject(object) {
        await Promise.all(Object.entries(object).map(async ([key, value]) => {
            if (typeof value === "string") {
                if (value.endsWith(".json")) object[key] = await this.#resolveJSON(value)
                if (value.endsWith(".js")) {
                    const imported = await this.#resolveURL(value)
                    object[key] = imported
                    object[key].dep && this.#validateModuleDEP(imported)
                    !this.STATE.error.length && await this.#resolveMODULE(object[key])
                }
            }
            if (typeof value === "object" && value !== null) {
                await this.#resolveObject(value)
            }
        }))
    }

    /* modules */
    #validateModuleDEP(module) {
        if (module.dep) {
            const addError = (item) => this.STATE.error.push({ module: module, error: `${item} format error` })

            const arrayType = ["helpers", "animations", "dynamics", "components", "fonts"]
            arrayType.forEach(item => {
                const type = module.dep[item] || null; /* without ; dont detect type */
                (type && !Array.isArray(type)) && addError(item)
            })

            const objectType = ["styles"]
            objectType.forEach(item => {
                (module.dep[item] && typeof module.dep[item] !== "object") && addError(item)
            })
        }
    }

    #injectLink = (href) => {
        const newLink = document.createElement("link")
        newLink.dataset.module = this.NAME
        newLink.dataset.type = "CSS"
        newLink.rel = "stylesheet"
        newLink.href = href
        document.head.appendChild(newLink)
    }

    #addFont(fonts) {
        const addFontStyle = (font) => {
            const fontStyle = document.createElement("style")
            fontStyle.dataset.module = this.NAME
            fontStyle.dataset.font = font.name
            document.head.appendChild(fontStyle)
            return fontStyle
        }

        const formatMap = {
            woff2: "woff2",
            woff: "woff",
            ttf: "truetype",
            otf: "opentype",
            eot: "embedded-opentype",
            svg: "svg"
        }

        fonts.forEach(item => {
            const ext = item.src.split(".").pop()
            const format = formatMap[ext] || ext
            const fontStyle = addFontStyle(item)

            fontStyle.textContent += `
            @font-face {
                font-family: "${item.name}";
                src: url("${item.src}") format("${format}");
            }
        `
        })
    }

    async #resolveMODULE(module) {
        if (module?.dep) {
            /* styles */
            module.dep.styles && Object.entries(module.dep.styles).forEach(([key, value]) => this.#injectLink(value))
            /* fonts */
            module.dep.fonts && this.#addFont(module.dep.fonts)
            /* helpers, animations, dynamics, components */
            const dinamicDeps = ["helpers", "animations", "dynamics", "components"]
            await Promise.all(dinamicDeps.map(async (item) => {
                if (!this.#JSON[item]) {
                    this.#JSON[item] = await this.#resolveJSON(`/framework/config/${item}.json`)
                }
                module.dep[item] && await this.#addDependencies(module, item)
            }))
            return module
        }
    }

    async #addDependencies(module, mode) {
        const initialDeps = [...module.dep[mode]]
        module.dep[mode] = {}

        initialDeps.forEach(item => {
            const path = this.#JSON[mode][item] || null
            if (!path) throw new Error(`${item} not valid dependency`)
            module.dep[mode][item.toUpperCase()] = path
        })
        await this.#resolveObject(module.dep[mode])
    }

    initINFO() {
        console.info(this, `\nMODULERESOLVER {
            init ({
                name:          string - module name used for dom injects
                modules:       object - scripts used in module 
                register:
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

        await this.#resolveObject(this.MODULES)
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