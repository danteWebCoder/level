export const init = (DOM) => {

    const mainBox = DOM.add({
        element: "div",
        css: ["landingBox"],
        node: document.body
    })

    mainBox.innerHTML = `
       <section class="blackBox mainBox">
            <h1 class="title1 title">Level</h1>
            <h2 class="title2 title">Modular framework</h2>

            <div class="actionBox">
                <div class="button"><span class="text">Enter</span></div>
                <span class="separator"></span>
                <div class="button"><span class="text">Download</span></div>
                <span class="separator"></span>
                <div class="button"><span class="text">Info</span></div>
            </div>

       </section>
        <section class="whiteBox mainBox">
            <h3 class="title3">Added</h3>
            <ul class="infoBox">
                <li class="counter">
                    <span class="title">Helpers</span>
                    <span id="helperCounter" class="number"></span>
                </li>
                <li class="counter">
                    <span class="title">styles</span>
                    <span id="stylesCounter" class="number"></span>
                </li> 
                <li class="counter">
                    <span class="title">Animations</span>
                    <span id="animationsCounter" class="number"></span>
                </li>
                <li class="counter">
                    <span class="title">Components</span>
                    <span id="componentsCounter" class="number"></span>
                </li> 
                </ul>
        </section>
    `
}