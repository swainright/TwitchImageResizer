const pica = new window.pica();
const zip = new window.JSZip();
const data = [];

function postEmotes() {
    let files = document.getElementById('emote-files').files;
    let images = document.getElementById('emotes-container');
    images.style.border = 'solid 0.125rem #9446ff';

    for (let i = 0; i < files.length; i++) {
        let imageSet = document.createElement("div");
        imageSet.setAttribute('class', 'image-set');
        let file = files[i];
        let source = "";
        let image112;
        let image56;
        let image28;

        const reader = new FileReader();
        reader.onloadend = function () {
            var fileName = file.name.substr(0, file.name.lastIndexOf('.'));
            source = reader.result.toString();

            image112 = resize(imageSet, 112, source);
            image112.setAttribute("title", fileName + "_112");
            data.push(image112);

            image56 = resize(imageSet, 56, source);
            image56.setAttribute("title", fileName + "_56");
            data.push(image56);


            image28 = resize(imageSet, 28, source);
            image28.setAttribute("title", fileName + "_28");
            data.push(image28);
        }

        reader.readAsDataURL(file);
        images.appendChild(imageSet);
        console.log(data);
    }
}

function postBadges() {
    let files = document.getElementById('badge-files').files;
    let images = document.getElementById('badges-container');
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
            let fileName = file.name.substr(0, file.name.lastIndexOf('.'));
            source = reader.result.toString();

            image72 = resize(imageSet, 72, source);
            image72.setAttribute("title", fileName + "_72");
            data.push(image72);

            image36 = resize(imageSet, 36, source);
            image36.setAttribute("title", fileName + "_36");
            data.push(image36);


            image18 = resize(imageSet, 18, source);
            image18.setAttribute("title", fileName + "_18");
            data.push(image18);
        }

        reader.readAsDataURL(file);
        images.appendChild(imageSet);
        console.log(data);
    }
}


function resize(container, size, path) {
    let canvas = document.createElement('canvas');
    let scaledImage = new Image();
    scaledImage.src = path;

    canvas.width = size;
    canvas.height = size;

    let dpi = window.devicePixelRatio;


    let styleHeight = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let styleWidth = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

    scaledImage.setAttribute("height", "" + (styleHeight * dpi));
    scaledImage.setAttribute("width", "" + (styleWidth * dpi));

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
    window.JSZipUtils.getBinaryContent(url, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function downloadAll() {

    if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
            zip.file(data[i].title + ".png", urlToPromise(data[i].toDataURL()), {binary: true});
        }

        zip.generateAsync({type: "blob"})
            .then(function (content) {
                saveAs(content, "twitch_files.zip");
            });
    }
}

const emotesUpload = document.getElementById('emote-files');
emotesUpload.addEventListener('input', postEmotes);

const badgesUpload = document.getElementById('badge-files');
badgesUpload.addEventListener('input', postBadges);

const downloader = document.getElementById('download-button');
downloader.addEventListener('click', downloadAll);




