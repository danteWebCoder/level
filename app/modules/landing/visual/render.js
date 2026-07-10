export const init = async (module) => {

    const fonts = [
        { name: "neuropol", src: "/app/src/fonts/neuropol.otf", module: "render" },
        { name: "nasa", src: "/app/src/fonts/nasalizationRG.otf", module: "render" },
        { name: "nasi", src: "/app/src/fonts/nasi.otf", module: "render" },
        { name: "digi", src: "/app/src/fonts/digital-7.ttf", module: "render" },
    ]

    module.addFonts(fonts)

    const mainBox = module.HELPERS.dom.add({
        element: "div",
        css: ["landingBox"],
        node: document.body
    })

    mainBox.innerHTML = `
       <section class="blackBox mainBox">
            <h1 class="title1 title">Level</h1>
            <h2 id="neonTitle" class="title2 title">Modular framework</h2>

            <div class="actionBox">
                <div id="actionEnter" class="button"><span class="text">Enter</span></div>
                <span class="separator"></span>
                <div id="actionDown" class="button"><span class="text">Download</span></div>
                <span class="separator"></span>
                <div id="actionInfo" class="button"><span class="text">Info</span></div>
            </div>

       </section>
        <section class="whiteBox mainBox">
            <h3 class="title3">
                <span class="text">Framework Added</span>
            </h3>
            <ul class="infoBox">
                <li class="counterCard">
                    <div id="backHelpers" class="back"></div>
                    <div class="front">
                        <div class="title">Helpers</div>
                        <div id="helpersCounter" class="number"></div>
                    </div>
                </li>
                <li class="counterCard">
                    <div id="backStyles" class="back"></div>
                    <div class="front">
                        <div class="title">styles</div>
                        <div id="stylesCounter" class="number"></div>
                    </div>
                </li> 
                <li class="counterCard">
                    <div id="backAnimations" class="back"></div>
                    <div class="front">
                        <div class="title">Animations</div>
                        <div id="animationsCounter" class="number"></div>
                    </div>
                </li>
                <li class="counterCard">
                    <div id="backComponents" class="back"></div>
                    <div class="front">
                        <div class="title">Components</div>
                        <div id="componentsCounter" class="number"></div>
                    </div>
                </li>
            </ul>
        </section>
    `
    module.DINAMICS.neon.light({
        config: {
            element: document.querySelector("#neonTitle"),
            color: "white",
            shadow: "rgb(80, 255, 255)"
        }
    })

    module.ANIMATIONS.glitch.random({
        config: {
            element: document.querySelector("#neonTitle"),
            initial_delay: 2000,
            delay: 400,
            color: "rgb(50, 50, 50)",
            shadow: "0 0 2px rgba(220, 255, 255, 0.5)"
        }
    })
}