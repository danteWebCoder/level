export const init = () => {
    const mainBox = document.createElement("div")
    mainBox.classList.add("landingBox")

    const whiteBox = document.createElement("section")
    whiteBox.classList.add("whiteBox")

    const blackBox = document.createElement("section")
    blackBox.classList.add("blackBox")

    mainBox.appendChild(whiteBox)
    mainBox.appendChild(blackBox)
    document.body.appendChild(mainBox)
}