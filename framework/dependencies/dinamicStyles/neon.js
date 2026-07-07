export const light = ({
    config = null,
}) => {
    if (config) {
        config.element = config.element || null
        config.color1 = config.color1 || null
        config.color2 = config.color2 || null

        if (!config || !config?.element || !config?.color1 || !config?.color2) {
            info()
            return null
        }

        config.element.style.color = config.color1
        config.element.style.textShadow = `
        0 0 2px ${config.color1},
        0 0 6px ${config.color2}, 
        0 0 15px ${config.color2}, 
        0 0 30px ${config.color2}`;
        return true
    }
}

export const bold = ({
    config = null,
}) => {
    if (config) {
        config.element = config.element || null
        config.color1 = config.color1 || null
        config.color2 = config.color2 || null

        if (!config.element || !config.color1 || !config.color2) {
            info()
            return null
        }

        config.element.style.color = config.color1
        config.element.style.textShadow = `
        0 0 2px ${config.color1},
        0 0 4px ${config.color1}, 
        0 0 12px ${config.color2}, 
        0 0 30px ${config.color2},
        0 0 40px ${config.color2},
        0 0 50px ${config.color2},
        0 0 60px ${config.color2}`;
        return true
    }
}

export const info = () => {
    console.info(`STYLE NEONLIGHT { 
        config: { 
            element: dom's element, 
            color1: font's color, 
            color2: shadow color 
        } 
    }`)
}