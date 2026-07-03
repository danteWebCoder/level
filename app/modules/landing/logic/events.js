const addEvents = (item, callback) => {
    item.addEventListener("click", callback)
}

export const init = () => {
    const enterButton = document.querySelector("#actionEnter")
    const downButton = document.querySelector("#actionDown")
    const infoButton = document.querySelector("#actionInfo")

    addEvents(enterButton, () => console.log("enter"))
    addEvents(downButton, () => console.log("down"))
    addEvents(infoButton, () => console.log("info"))
}