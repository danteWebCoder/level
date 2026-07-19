export const light = ({
    config = null,
}) => {
    if (config) {
        if (!config ||
            !config?.element ||
            !config?.color ||
            !config?.shadow) {
            info()
            return null
        }

        const dinamics = config.element.dataset.dinamics || ""
        config.element.dataset.dinamics = `${dinamics} neon`.trim()
        config.element.style.color = config.color
        config.element.style.textShadow = `
            0 0 2px ${config.color},
            0 0 6px ${config.shadow}, 
            0 0 15px ${config.shadow}, 
            0 0 30px ${config.shadow}`;
        return true
    }
}

export const bold = ({
    config = null,
}) => {
    if (config) {
        config.element = config.element || null
        config.color = config.color || null
        config.shadow = config.shadow || null

        if (!config.element || !config.color || !config.shadow) {
            info()
            return null
        }

        const dinamics = config.element.dataset.dinamics || ""
        config.element.dataset.dinamics = `${dinamics} neon`.trim()
        config.element.style.color = config.color
        config.element.style.textShadow = `
        0 0 2px ${config.color},
        0 0 4px ${config.color}, 
        0 0 12px ${config.shadow}, 
        0 0 30px ${config.shadow},
        0 0 40px ${config.shadow},
        0 0 50px ${config.shadow},
        0 0 60px ${config.shadow}`;
        return true
    }
}

export const info = () => {
    console.info(`DINAMIC STYLE NEON { 
        config ({ 
            element: dom's element, 
            color: font's color, 
            shadow: text shadow color 
        }) 
        
        compatible animations: glitch
    }`)
}