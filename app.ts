let engine: TSE.Engine

window.onload = () => {
    engine = new TSE.Engine()
    engine.start()
}
window.onresize = function () {
    engine.resize()
}