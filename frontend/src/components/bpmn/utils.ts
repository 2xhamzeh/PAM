
export const handleBeforeUnload = (event:BeforeUnloadEvent) => {
    event.preventDefault();
}

export const loadImage = (src:any) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
};

export const canvasToBlob = (canvas:any, type:string, quality:number) => {
    return new Promise((resolve) => {
        canvas.toBlob((blob:any) => {
            resolve(blob);
        }, type, quality);
    });
};

