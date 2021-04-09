export default class ImageUtil {

    public static canvasToDataURL(
        canvas: HTMLCanvasElement, format: string = 'image/jpeg', quality: number = 1.0): string {
        return canvas.toDataURL(format, quality)
    }
    // DataURL转canvas
    public static dataURLToCanvas(dataurl: string, cb: (canvas: HTMLCanvasElement) => void) {
        var canvas = <HTMLCanvasElement>document.createElement('CANVAS')
        var ctx = canvas.getContext('2d')
        var img = new Image()
        img.onload = function () {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            cb(canvas)
        }
        img.src = dataurl
    }

    // image转canvas：图片地址
    public static imageToCanvas(src: string, cb: (canvas: HTMLCanvasElement) => void) {
        var canvas = <HTMLCanvasElement>document.createElement('CANVAS')
        var ctx = canvas.getContext('2d')
        var img = new Image()
        img.src = src
        img.onload = function () {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            cb(canvas)
        }
    }

    // canvas转image
    public static canvasToImage(canvas: HTMLCanvasElement, mimeType?: string) {
        var img = new Image()
        img.src = canvas.toDataURL(mimeType || 'image/jpeg', 1.0)
        return img
    }

    // File/Blob对象转DataURL
    public static fileOrBlobToDataURL(blobObj: Blob, cb: (dataurl: string) => void) {
        var a = new FileReader()
        a.readAsDataURL(blobObj)
        a.onload = function (e: any) {
            cb(e.target.result)
        }
    }
    // DataURL转Blob对象
    public static dataURLToBlob(dataurl: string) {
        var arr = dataurl.split(',')
        var mime = arr[0].match(/:(.*?)/)?.[1]
        var bstr = atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
    }

    public static canvasToArrayBuffer(canvas: HTMLCanvasElement): ArrayBuffer | undefined {
        const ctx = canvas.getContext('2d')
        if (!ctx) return undefined
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        return imgData.data.buffer
    }

    /**
     * 
     * @param uints RGBA to Gray: Y <- 0.299 * R + 0.587 * G + 0.114 * B
     *  Gray to RGBA: R <- Y, G <- Y, B <- Y, A <- 255
     * 我们可以得出RGBA to GRAY（指的是拥有4个通道）对应映射关系应该为： 
     * RGBA to RGBA(GRAY): R1 = G1 = B1 <-  0.299 * R + 0.587 * G + 0.114 * B , A1 <- A
     */
    public static uintsRGBA2Grey(uints: Uint8Array, width: number, height: number) {
        const nextUints = new Uint8Array(uints.length)
        for (let iY = 0; iY < height; iY++) {
            for (let iX = 0; iX < (width * 4); iX += 4) {
                const curPixelIdx = (iY * width * 4) + iX
                const { uR, uG, uB, uA } = {
                    uR: uints[curPixelIdx],
                    uG: uints[curPixelIdx + 1],
                    uB: uints[curPixelIdx + 2],
                    uA: uints[curPixelIdx + 3]
                }
                nextUints[curPixelIdx + 3] = uA
                nextUints[curPixelIdx] = nextUints[curPixelIdx + 1] = nextUints[curPixelIdx + 2]
                    = 0.299 * uR + 0.587 * uG + 0.114 * uB
            }
        }
        return nextUints
    }

    public static dataURLToUint8Array(dataurl: string): Uint8Array {
        var arr = dataurl.split(',')
        var bstr = atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return u8arr
    }


    // Blob转image
    public static blobToImage(blob: Blob, cb: (target: any) => void) {
        ImageUtil.fileOrBlobToDataURL(blob, function (dataurl: string) {
            var img = new Image()
            img.src = dataurl
            cb(img)
        })
    }
    // image转Blob
    public static imageToBlob(src: string, cb: (blob: Blob) => any): void {
        ImageUtil.imageToCanvas(src, function (canvas: HTMLCanvasElement) {
            cb(ImageUtil.dataURLToBlob(ImageUtil.canvasToDataURL(canvas)))
        })
    }
    public static imageToUint8Array(src: string, cb: (array: Uint8Array) => any): void {
        ImageUtil.imageToCanvas(src, function (canvas: HTMLCanvasElement) {
            cb(ImageUtil.dataURLToUint8Array(ImageUtil.canvasToDataURL(canvas)))
        })
    }
    // Blob转canvas
    public static BlobToCanvas(blob: Blob, cb: (canvas: HTMLCanvasElement) => void) {
        ImageUtil.fileOrBlobToDataURL(blob, function (dataurl: string) {
            ImageUtil.dataURLToCanvas(dataurl, cb)
        })
    }
    // canvas转Blob
    public static canvasToBlob(canvas: HTMLCanvasElement, cb: (blob: Blob) => any) {
        cb(ImageUtil.dataURLToBlob(ImageUtil.canvasToDataURL(canvas)))
    }
    // image转dataURL
    public static imageToDataURL(src: string, cb: (dataurl: string) => any) {
        ImageUtil.imageToCanvas(src, function (canvas: HTMLCanvasElement) {
            cb(ImageUtil.canvasToDataURL(canvas))
        })
    }
    // dataURL转image，这个不需要转，直接给了src就能用
    public static dataURLToImage(dataurl: string) {
        var img = new Image()
        img.src = dataurl
        return img
    }

}