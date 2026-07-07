export const random = async ({
    config = null
}) => {
    if (config) {
        config.element = config.element || null
        config.delay = config.delay || null
    }

    if (!config || !config?.element || !config?.delay) {
        random.info()
        return null
    }

    if (config.element.textContent === "") {
        console.error(`ANIMATION GLITCH: ${config.element} no text detect`)
        glitch.info()
        return null
    }

    const drawChars = () => {
        const text = Array.from(config.element.textContent)
        config.element.innerHTML = ""
        const spanBox = document.createElement("div")
        spanBox.classList.add("glitch_animation")

        const textHtml = text.forEach((char, index) => {
            const charBox = document.createElement("span")
            charBox.dataset.id = index
            charBox.textContent = text[index]
            spanBox.appendChild(charBox)
        })

        config.element.appendChild(spanBox)
        const chars = Array.from(spanBox.querySelectorAll("span"))
        return chars
    }

    const randomChar = (array) => {
        return array[Math.floor(Math.random() * array.length)]
    }

    const sleep = async (time) => {
        await new Promise(resolve => setTimeout(resolve, Number(parseFloat(time))))
    }

    const glitchArray = []
    const selectChar = async (chars, original_textShadow, original_color) => {
        while (true) {
            const char = randomChar(chars)
            if (!glitchArray.includes(char)) {
                glitchArray.push(char)
            }
            glitch(char, original_textShadow, original_color)
            await sleep(config.delay)
            console.log(glitchArray)
        }
    }

    const glitch = async (char, original_textShadow, original_color) => {
        const alternative_shadow = "0 0 2px white,  0 0 6px cyan, 0 0 15px cyan, 0 0 30px cyan"

        char.style.textShadow = alternative_shadow
        char.style.color = "white"
        await sleep(1000)
        char.style.textShadow = original_textShadow
        char.style.color = original_color
        await sleep(10)
        char.style.textShadow = alternative_shadow
        char.style.color = "white"
        await sleep(1000)
        char.style.textShadow = original_textShadow
        char.style.color = original_color
        await sleep(10)
        char.style.textShadow = alternative_shadow
        char.style.color = "white"
        await sleep(1000)
        char.style.textShadow = original_textShadow
        char.style.color = original_color
        await sleep(11800)

        glitching.splice(glitching.indexOf(char), 1)
    }

    const chars = drawChars()
    const original_textShadow = window.getComputedStyle(chars[0]).getPropertyValue("text-shadow")
    const original_color = window.getComputedStyle(chars[0]).getPropertyValue("color")
    await sleep(1000)
    selectChar(chars, original_textShadow, original_color)
}

random.info = () => {
    console.info("glitch info")
}