addEventListener("message", (message) => {
    const imageData = message.data.imageData;
    const matrix = message.data.transformMatrix;

    for (let i = 0; i < imageData.data.length; i += 4) {
        // TODO: correct for sRGB

        // get color channels as values from 0 to 1
        let r = imageData.data[i] / 255;
        let g = imageData.data[i + 1] / 255;
        let b = imageData.data[i + 2] / 255;
        // multiply by matrix
        r = r * matrix[0] + g * matrix[1] + b * matrix[2];
        g = r * matrix[3] + g * matrix[4] + b * matrix[5];
        b = r * matrix[6] + g * matrix[7] + b * matrix[8];

        imageData.data[i] = Math.round(r * 255);
        imageData.data[i + 1] = Math.round(g * 255);
        imageData.data[i + 2] = Math.round(b * 255);
    }

    // send it back
    postMessage({imageData}, [imageData.data.buffer]);
});
