var pica = new pica();
var zip = new JSZip();
var data = [];

let tablinks = document.getElementsByClassName("tablinks");
for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].addEventListener("click", function() {
        typeSelector(tablinks[i].innerHTML);
    });
}

let tabcontent = document.getElementsByClassName("tabcontent");

for (let i = 0; i < tabcontent.length; i++)
    tabcontent[i].style.display = "none";

document.getElementById("default-open").click();

function postFiles() {
    const files = document.getElementById('emote-files').files;
    const images = document.getElementById('images-container')
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
    }
}


function resize(container, size, path) {
    let canvas = document.createElement('canvas');
    let scaledImage = new Image();
    scaledImage.src = path;

    canvas.width = size;
    canvas.height = size;

    scaledImage.onload = function() {
        pica.resize(scaledImage, canvas, {
            quality: 2,
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

function typeSelector(imgType) {
    let tabcontent = document.getElementsByClassName("tabcontent");

    for (let i = 0; i < tabcontent.length; i++)
        tabcontent[i].style.display = "none";

    let tablinks = document.getElementsByClassName("tablinks");

    for (let i = 0; i < tablinks.length; i++)
        tablinks[i].className = tablinks[i].className.replace(" active", "");

    document.getElementById(imgType.toLowerCase()).style.display = "block";
    this.className += " active";
}

const chooser = document.getElementById('emote-files');
chooser.addEventListener('input', postFiles);
const downloader = document.getElementById('download-button');
downloader.addEventListener('click', downloadAll);



