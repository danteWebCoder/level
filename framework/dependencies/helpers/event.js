export const add = ({
    element = null,
    event = null,
    callback = null
}) => {
    if (!element || !event || !callback) {
        console.error("EVENT ADD config error")
        return
    }

    element.addEventListener(event, callback)
}

export const remove = ({
    element = null,
    event = null,
    callback = null
}) => {
    if (!element || !event || !callback) {
        console.error("EVENT REMOVE config error")
        return
    }

    element.removeEventListener(event, callback)
}