const fileListElement = document.getElementById('fileList');
let selectedImage = '';
const submitButton = document.getElementById('submit')

const getGalleryFiles = () => {

    fetch('/gallery')
        .then((res) => res.json())
        .then(files => {
            fileListElement.innerHTML = '';
            files.forEach(file => {
                const listItem = document.createElement('li');
                const img = document.createElement('img');
                img.src = file.imageUrl;
                img.alt = file.name; // Use file name as alt text for accessibility
                img.height = '200';
                img.width = '200';
                listItem.appendChild(img);
                fileListElement.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching files:', error);
            // Display an error message on the UI
            const fileListElement = document.getElementById('fileList');
            fileListElement.textContent = 'Failed to fetch files. Please try again later.';
        });
}

const fileSelector = document.getElementById('fileSelector');
fileSelector.addEventListener('change', (e) => {
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    console.log(e);
    fetch('/profile', {
        method: 'POST',
        body: formData
    })
        .then(() => getGalleryFiles())
})

document.addEventListener('DOMContentLoaded', () => {
    getGalleryFiles();
});

fileListElement.addEventListener('click', (e) => {
    selectedImage = e.target.alt;
});

submitButton.addEventListener('click', () => {
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    console.log(width, height);
    const documentBody = document.querySelector('body');
    const linkForResizedImage = document.createElement('a');
    linkForResizedImage.target = '_blank';
    linkForResizedImage.textContent = 'Click here to open resized image';
    linkForResizedImage.href = `/image?height=${height}&width=${width}&imageName=${selectedImage}`;
    documentBody.appendChild(linkForResizedImage);
});