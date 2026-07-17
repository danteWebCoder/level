class ModuleResolver {
    NAME = null
    MODULES = {}
    REGISTER = { LOCAL: null, GLOBAL: null }

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

    /* resolves*/
    async #resolveURL(path) {
        try {
            const module = await import(path)
            return module?.default ?? module
        } catch (error) {
            throw new Error(`import error: ${path} - ${error.message}`)
        }
    }

    async #resolveJSON(path) {
        const response = await fetch(path)
        if (!response.ok) throw new Error(`JSON failed: cant fetch ${path}`)
        try {
            return await response.json()
        } catch (error) {
            throw new Error(`JSON failed: ${error.message}`)
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

    /* modules dependencies*/
    #injectLink = (href) => {
        const newLink = document.createElement("link")
        newLink.dataset.module = this.NAME
        newLink.dataset.type = "CSS"
        newLink.rel = "stylesheet"
        newLink.href = href
        document.head.appendChild(newLink)
    }

    #addFont(fonts) {
        const addFontStyle = (font, name) => {
            const fontStyle = document.createElement("style")
            fontStyle.dataset.module = name
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
            const fontStyle = addFontStyle(item, name)

            fontStyle.textContent += `
            @font-face {
                font-family: "${item.name}";
                src: url("${item.src}") format("${format}");
            }
        `
        })
    }

    async #resolveMODULE(module) {
        if (module.dep) {
            /* styles */
            module.dep.styles && Object.entries(module.dep.styles).forEach(([key, value]) => this.#injectLink(value))
            /* fonts */
            module.dep.fonts && this.#addFont(module.dep.fonts)
            /* helpers, animations, dinamics, components */
            const dinamicDeps = ["helpers", "animations", "dinamics", "components"]
            await Promise.all(dinamicDeps.map(async (item) => {
                if (!this.#JSON[item]) {
                    this.#JSON[item] = await this.#resolveJSON(`/framework/config/${item}.json`)
                }
                module.dep[item] && await this.#addDependencies(module, item)
            }))
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
        if ((this.#STATE.loaded === true && !this.#STATE.error) || this.#STATE.loaded === "working") {
            console.log(this, "ModuleResolver instance already initialized", this.#STATE)
            return null
        }

        if (!this.#validateInit(name, modules)) {
            this.initINFO()
            this.#STATE.error = true
            return null
        }

        this.#STATE.loaded = "working"
        this.NAME = name
        this.MODULES = modules

        try {
            await this.#resolveObject(this.MODULES)
            this.#STATE.loaded = true
            return this
        } catch (error) {
            console.error(this.NAME, "error resolving module load", error.message)
            this.NAME = null
            this.MODULES = {}
            this.#JSON = {}

            this.#STATE.error = true
            this.#STATE.loaded = false
        }
    }

    destroy() {

    }
}
export default new ModuleResolver()