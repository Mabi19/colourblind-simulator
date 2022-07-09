import { Effect, effectMatrices } from "./Effect";
import { addImageToGallery, galleryData } from "./GalleryData";
import { Renderer } from "./Renderer";

export class ColourblindVisualiser {
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private stream?: MediaStream;

    private mediaWidth: number;
    private mediaHeight: number;

    private canvasWidth: number;
    private canvasHeight: number;

    private renderer: Renderer;
    private nextInvocationHandle: number;

    private currentEffect: Effect;

    get mediaAspectRatio() {
        return this.mediaWidth / this.mediaHeight;
    }

    constructor(canvas: HTMLCanvasElement) {
        this.video = document.createElement("video");
        this.canvas = canvas;
        // dummy sizes
        this.mediaWidth = 720;
        this.mediaHeight = 480;
        this.canvasWidth = 720;
        this.canvasHeight = 480;

        this.currentEffect = Effect.None;
        this.renderer = new Renderer(this.canvas);
        // these are the actual sizes
        this.updateCanvasSize();
        addEventListener("resize", () => {
            this.updateCanvasSize();
        });

        this.nextInvocationHandle = 0;

        // recreate the renderer upon context lost
        // this automatically removes all resources
        canvas.addEventListener("webglcontextlost", (event) => {
            cancelAnimationFrame(this.nextInvocationHandle);
            event.preventDefault();
        });

        canvas.addEventListener("webglcontextrestored", () => {
            try {
                this.renderer = new Renderer(this.canvas);
            } catch (err) {
                // the context was lost AGAIN...
                alert(err);
                return;
            }
            this.updateCanvasSize();
            this.nextInvocationHandle = requestAnimationFrame(() => { this.mainLoop() });
        });
    }

    updateCanvasSize() {
        const mediaRatio = this.mediaAspectRatio;
        const windowRatio = window.innerWidth / window.innerHeight;
        if (windowRatio > mediaRatio) {
            // wider, height is full
            this.canvasHeight = window.innerHeight;
            this.canvasWidth = this.canvasHeight * mediaRatio;
        } else if (windowRatio < mediaRatio) {
            // taller, width is full
            this.canvasWidth = window.innerWidth;
            this.canvasHeight = this.canvasWidth / mediaRatio;
        } else {
            // equal, set exactly
            this.canvasWidth = window.innerWidth;
            this.canvasHeight = window.innerHeight;
        }
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.renderer.setCanvasSize(this.canvasWidth, this.canvasHeight);
    }

    setMediaStream(stream: MediaStream) {
        this.stream = stream;
        const streamInfo = this.stream.getVideoTracks()[0].getSettings();
        this.mediaWidth = streamInfo.width ?? 720;
        this.mediaHeight = streamInfo.height ?? 480;
        this.video.width = this.mediaWidth;
        this.video.height = this.mediaHeight;
        this.updateCanvasSize();
    }

    setEffect(effect: Effect) {
        this.currentEffect = effect;
        this.renderer.setEffect(effect);
    }

    async takePhoto() {
        // Take a photo (using ImageCapture if available, otherwise just by putting it on an invisible canvas) and put it in the Gallery.
        let imageWidth = -1;
        let imageHeight = -1;
        let imageBitmap: ImageBitmap | undefined; // used only with imagecapture

        if ("ImageCapture" in window) {
            const imageCapture = new (window as any).ImageCapture(this.stream?.getVideoTracks()[0]);
            // this fails in edge for some reason??
            try {
                const photo = await imageCapture.takePhoto();
                imageBitmap = await createImageBitmap(photo, {colorSpaceConversion: "none"});
            } catch (e) {
                imageBitmap = await imageCapture.grabFrame();
            }
            if (!imageBitmap) {
                // something went wrong
                // TODO: make this dialog nicer
                alert("Coś poszło nie tak");
                return;
            }
            imageWidth = imageBitmap.width;
            imageHeight = imageBitmap.height;
        } else {
            // make the canvas the appropriate size
            imageWidth = this.mediaWidth;
            imageHeight = this.mediaHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = imageWidth;
        canvas.height = imageHeight;

        const ctx = canvas.getContext("2d", {
            alpha: false,
            desynchronized: true,
            willReadFrequently: true,
        });
        if (!ctx) {
            // something went wrong
            // TODO: make this dialog nicer
            alert("Coś poszło nie tak");
            return;
        }

        if ("ImageCapture" in window) {
            // this is guaranteed to exist if we're here
            // @ts-ignore
            ctx.drawImage(imageBitmap, 0, 0);
            // we don't need imageBitmap anymore
            imageBitmap?.close();
        } else {
            // just put the video on there
            ctx.drawImage(this.video, 0, 0);
        }

        // perform the image transform
        const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);
        const worker = new Worker(new URL("./PhotoTransform.js", import.meta.url));
        const promise = new Promise<MessageEvent>((resolve) => {
            worker.addEventListener("message", (payload) => { resolve(payload) })
        });
        const matrix = effectMatrices[this.currentEffect].slice();
        worker.postMessage({imageData: imageData, transformMatrix: matrix}, [imageData.data.buffer, matrix.buffer]);
        const message = await promise;
        const newImageData: ImageData = message.data.imageData;
        // draw it back on the canvas and get a blob
        ctx.putImageData(newImageData, 0, 0);
        canvas.toBlob((blob) => {
            if (!blob) {
                // TODO: make this dialog nicer
                alert("Coś poszło nie tak");
                return;
            }

            addImageToGallery(blob, this.currentEffect);
        });
    }

    async start() {
        if (!this.stream) throw Error("Błąd kamery");
        this.video.srcObject = this.stream;
        await this.video.play();
        this.mainLoop();
    }

    // calls itself via requestAnimationFrame()
    mainLoop() {
        if (this.video.paused || this.video.ended) return;

        const streamInfo = this.stream?.getVideoTracks()[0]?.getSettings();
        if (this.mediaWidth != streamInfo?.width || this.mediaHeight != streamInfo?.height) {
            this.mediaWidth = streamInfo?.width ?? 720;
            this.mediaHeight = streamInfo?.height ?? 480;
            this.video.width = this.mediaWidth;
            this.video.height = this.mediaHeight;
            this.updateCanvasSize();
        }

        // make the renderer draw stuff
        this.renderer.updateFrame(this.video);
        this.renderer.draw();
        this.nextInvocationHandle = requestAnimationFrame(() => { this.mainLoop() });
    }
}
