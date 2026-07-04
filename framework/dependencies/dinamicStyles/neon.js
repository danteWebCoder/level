export const light = ({
    element = null,
    color1 = null, /* font color */
    color2 = null /* text shadow */
}) => {
    if (!element || !color1 || !color2) {
        console.error("NEONLIGHT config error")
        return null
    }

    element.style.color = color1
    element.style.textShadow = `0 0 2px ${color1}, 0 0 6px ${color2}, 0 0 15px ${color2}, 0 0 30px ${color2};`
}