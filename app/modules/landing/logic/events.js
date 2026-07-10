export const init = (landing) => {
    const enterButton = document.querySelector("#actionEnter")
    const downButton = document.querySelector("#actionDown")
    const infoButton = document.querySelector("#actionInfo")

    const enter = () => console.log("enter")

    landing.HELPERS.events.add({
        element: enterButton,
        event: "click",
        callback: enter
    })
}