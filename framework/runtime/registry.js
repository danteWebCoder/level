class Registry {
    REGISTRY = {
        modules: {}
    }

    addGlobal({
        type = null,
        item = null
    }) {
        if (type === "fonts") {
            console.log(item)
        }
    }

    addLocal({
        type = null,
        item = null,
        reg = null
    }) {

    }
}

export default new Registry()
