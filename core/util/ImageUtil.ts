
export default class ImageUtil {

    public static canvasToDataURL(
        canvas: HTMLCanvasElement, format: string = 'image/jpeg', quality: number = 1.0): string {
        return canvas.toDataURL(format, quality)
    }
    // DataURL转canvas
    public static dataURLToCanvas(dataurl: string, cb: Function) {
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
    public static imageToCanvas(src: string, cb: Function) {
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
    public static canvasToImage(canvas: HTMLCanvasElement) {
        var img = new Image()
        img.src = canvas.toDataURL('image/jpeg', 1.0)
        return img
    }

    // File/Blob对象转DataURL
    public static fileOrBlobToDataURL(blobObj: Blob, cb: Function) {
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

    public static dataURLToArrayBuffer(dataurl: string): ArrayBuffer {
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
    public static blobToImage(blob: Blob, cb: Function) {
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
    public static imageToArrayBuffer(src: string, cb: (blob: ArrayBuffer) => any): void {
        ImageUtil.imageToCanvas(src, function (canvas: HTMLCanvasElement) {
            cb(ImageUtil.dataURLToArrayBuffer(ImageUtil.canvasToDataURL(canvas)))
        })
    }
    // Blob转canvas
    public static BlobToCanvas(blob: Blob, cb: Function) {
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
