import ImageUtil from "./imageUtil"

export default class ResourceUtil {
    private static imageList: Array<string> = [
        '/assets/logo.jpg'
    ]

    public static loadAllImages(): Promise<Array<HTMLCanvasElement>> {
        const canvases: Array<HTMLCanvasElement> = new Array<HTMLCanvasElement>()
        return new Promise((resolve, reject) => {
            // TODO 支持级联加载资源
            this.imageList.forEach(imgPath => {
                ImageUtil.dataURLToCanvas(imgPath, canvas => canvases.push(canvas))
            })
            resolve(canvases)
        })
    }
}