var pica = new pica();
var zip = new JSZip();
var data = [];

function postFiles() {
    const files = document.getElementById('emote-files').files;
    const images = document.getElementById('images-container')
    images.style.border = 'solid 0.125rem #9446ff';

    for (let i = 0; i < files.length; i++) {
        let imageSet = document.createElement("div");
        imageSet.setAttribute('class', 'image-set');
        let file = files[i];
        let source = "";
        let image72;
        let image36;
        let image18;

        const reader = new FileReader();
        reader.onloadend = function () {
            var fileName = file.name.substr(0, file.name.lastIndexOf('.'));
            source = reader.result.toString();

            image72 = resize(imageSet, 112, source);
            image72.setAttribute("title", fileName + "_112");
            data.push(image72);

            image36 = resize(imageSet, 56, source);
            image36.setAttribute("title", fileName + "_56");
            data.push(image36);


            image18 = resize(imageSet, 28, source);
            image18.setAttribute("title", fileName + "_28");
            data.push(image18);
        }

        reader.readAsDataURL(file);
        images.appendChild(imageSet);
    }

    console.log(data);
}


function resize(container, size, path) {
    let canvas = document.createElement('canvas');
    let scaledImage = new Image();
    scaledImage.src = path;

    canvas.width = size;
    canvas.height = size;

    scaledImage.onload = function() {
        pica.resize(scaledImage, canvas, {
            quality: 3,
            alpha: true
        });
    }

    container.appendChild(canvas);

    return canvas;
}

function urlToPromise(url) {
    return new Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent(url, function(err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

function downloadAll() {
    for (let i = 0; i < data.length; i++) {
        zip.file(data[i].title + ".png", urlToPromise(data[i].toDataURL()), {binary:true});
    }

    zip.generateAsync({type: "blob"})
        .then(function(content) {
            saveAs(content, "archive.zip");
        })
}


const chooser = document.getElementById('emote-files');
chooser.addEventListener('input', postFiles);
const downloader = document.getElementById('download-button');
downloader.addEventListener('click', downloadAll);