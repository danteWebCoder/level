export const random = async ({
    config = null
}) => {
    const requireDinamic = ["neon"]
    const dinamics = config.element.dataset.dinamics?.split(" ") || []

    if (!config ||
        !config?.element ||
        !config?.delay ||
        !config?.color ||
        !config?.shadow) {
        random.info()
        return null
    }

    const compatible = dinamics.some(item => requireDinamic.includes(item))
    if (!compatible) {
        console.error("ANIMATION GLITCH: not compatible")
        return null
    }

    if (config.element.textContent === "") {
        console.error(`ANIMATION GLITCH: ${config.element} no text detect`)
        glitch.info()
        return null
    }

    const chars = drawChars(config)
    const original_textShadow = window.getComputedStyle(chars[0]).getPropertyValue("text-shadow")
    const original_color = window.getComputedStyle(chars[0]).getPropertyValue("color")
    await sleep(config.initial_delay || 0)
    randomChar(config, chars, original_textShadow, original_color)
}

random.info = () => {
    console.info(`ANIMATION GLITCH { 
        config: { 
            element: dom's element,
            initial_delay: delay time for fist glitch,
            delay: delay time for new selection in ms,
            color: font's color',
            shadow: text shadow color
        } 
        
        compatible dinamics styles: neon
    }`)
}

const randomize = (max) => {
    const num = Math.floor(Math.random() * max)
    return num
}

const sleep = async (time) => {
    await new Promise(resolve => setTimeout(resolve, Number(parseFloat(time))))
}

const drawChars = (config) => {
    const text = Array.from(config.element.textContent)
    config.element.innerHTML = ""
    const spanBox = document.createElement("div")
    spanBox.classList.add("glitch_animation")

    const textHtml = text.forEach((char, index) => {
        const charBox = document.createElement("span")
        charBox.dataset.id = index
        charBox.dataset.inUse = ""
        charBox.textContent = text[index]
        spanBox.appendChild(charBox)
    })

    config.element.appendChild(spanBox)
    const charsSpan = Array.from(spanBox.querySelectorAll("span"))
    return charsSpan
}

const randomChar = async (config, chars, original_textShadow, original_color) => {
    while (true) {
        const char = chars[randomize(chars.length)]
        if (!char.dataset.inUse) {
            glitch(config, char, original_textShadow, original_color)
            await sleep(config.delay)
        }
        await sleep(10)
    }
}

const glitch = async (config, char, original_textShadow, original_color) => {
    char.dataset.inUse = "in-use"

    char.style.textShadow = config.shadow
    char.style.color = config.color
    await sleep(300)
    char.style.textShadow = original_textShadow
    char.style.color = original_color
    await sleep(10)
    char.style.textShadow = config.shadow
    char.style.color = config.color
    await sleep(300)
    char.style.textShadow = original_textShadow
    char.style.color = original_color
    await sleep(10)
    char.style.textShadow = config.shadow
    char.style.color = config.color
    await sleep(300)
    char.style.textShadow = original_textShadow
    char.style.color = original_color
    await sleep(10)
    char.style.textShadow = config.shadow
    char.style.color = config.color
    await sleep(300)
    char.style.textShadow = original_textShadow
    char.style.color = original_color

    char.dataset.inUse = ""
}
