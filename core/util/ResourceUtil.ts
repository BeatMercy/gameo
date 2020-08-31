import ImageUtil from "./ImageUtil"

export default class ResourceUtil {
    private static imageList: Array<string> = [
        '/assets/logo.jpg',
        '/assets/1.png',
        '/assets/2.png',
        '/assets/3.png',
        '/assets/4.png',
        '/assets/5.png',
        '/assets/6.png',
        '/assets/7.png',
        '/assets/8.png'
    ]

    public static loadImage(path: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            try {
                ImageUtil.dataURLToImage(path).onload = (imageData) => {
                    resolve(<HTMLImageElement>imageData.currentTarget)
                }
            } catch (ex) {
                reject(ex)
            }
        })
    }

    public static loadAllImages(): Promise<Array<HTMLImageElement>> {
        return this.loadAllImagesSeparately()
    }

    public static loadAllImagesSeparately(preHandler?: (imageData: HTMLImageElement) => void): Promise<Array<HTMLImageElement>> {
        const images: Array<HTMLImageElement> = new Array<HTMLImageElement>()
        return new Promise((resolve, reject) => {
            try {
                const startTime = new Date().getTime()
                let perLoadTime = startTime
                this.imageList.forEach(imgPath => images.push(ImageUtil.dataURLToImage(imgPath)))
                let loadedCount = 0
                images.forEach((image, index) =>
                    image.onload = (data) => {
                        loadedCount++
                        if (preHandler) {
                            const curLoadTime = new Date().getTime()
                            console.info(`Single [${image.src}][${index}] Loaded Cost : ${(perLoadTime - perLoadTime) / 1000}s`)
                            perLoadTime = curLoadTime
                            preHandler(image)
                        }
                        if (loadedCount >= images.length) {
                            const endTime = new Date().getTime()
                            console.info(`All Images Resource Loaded Cost : ${(endTime - startTime) / 1000}s`)
                            resolve(images)
                        }
                    })
            } catch (ex) {
                reject(ex)
            }
        })
    }
}