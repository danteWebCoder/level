const addEvents = (item, callback) => {
    item.addEventListener("click", callback)
}

export const init = () => {
    const enterButtom = document.querySelector("#actionEnter")
    const downButtom = document.querySelector("actionDown")
    const infoButtom = document.querySelector("#actionInfo")

    addEvents(enterButtom, () => console.log("enter"))
}