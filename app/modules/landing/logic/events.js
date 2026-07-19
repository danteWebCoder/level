export const dep = {
    helpers: ["events"],
}

export const init = () => {
    const enterButton = document.querySelector("#actionEnter")
    const downButton = document.querySelector("#actionDown")
    const infoButton = document.querySelector("#actionInfo")

    const enter = () => console.log("enter")

    dep.helpers.EVENTS.add({
        element: enterButton,
        event: "click",
        callback: enter
    })
}