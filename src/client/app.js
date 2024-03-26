const fileListElement = document.getElementById("fileList");
let selectedImage = "";
const submitButton = document.getElementById("submit");

const getGalleryFiles = () => {
  fetch("/gallery")
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error("Something went wrong");
    })
    .then((files) => {
      console.log();
      if (files.error) {
        alert("Failed to get files");
        return;
      }
      fileListElement.innerHTML = "";
      files.forEach((file) => {
        const listItem = document.createElement("li");
        const img = document.createElement("img");
        img.className = "image-file";
        img.src = file.imageUrl;
        img.alt = file.name; // Use file name as alt text for accessibility
        img.height = "200";
        img.width = "200";
        listItem.appendChild(img);
        fileListElement.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching files:", error);
      // Display an error message on the UI
      const fileListElement = document.getElementById("fileList");
      fileListElement.textContent =
        "Failed to fetch files. Please try again later.";
    });
};

const fileSelector = document.getElementById("fileSelector");
fileSelector.addEventListener("change", (e) => {
  const formData = new FormData();
  formData.append("avatar", e.target.files[0]);
  fetch("/profile", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (res.ok) getGalleryFiles();
      throw new Error("Something went wrong");
    })
    .catch((error) => {
      alert(error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  getGalleryFiles();
});

fileListElement.addEventListener("click", (e) => {
  selectedImage = e.target.alt;
  const imagesOnPage = document.querySelectorAll(".image-file");
  imagesOnPage.forEach((image) => {
    if (image.alt === e.target.alt) {
      image.classList.add("selectedImage");
      console.log(image);
    } else {
      image.classList.remove("selectedImage");
    }
  });
});

submitButton.addEventListener("click", () => {
  const width = document.getElementById("width").value;
  const height = document.getElementById("height").value;
  const resizedAnchor = document.querySelector("#resizedImage");
  const documentBody = document.querySelector(".app");
  const missingDataSpan = document.querySelector("#missingData");
  const missingImageSpan = document.querySelector("#missingImage");
  if (resizedAnchor) {
    resizedAnchor.remove();
  }
  if (missingDataSpan) {
    missingDataSpan.remove();
  }
  if (missingImageSpan) {
    missingImageSpan.remove();
  }
  if (selectedImage === "") {
    const missingData = document.createElement("span");
    missingData.textContent = "Please select an image";
    missingData.id = "missingImage";
    documentBody.appendChild(missingData);
    return;
  }
  if (!height || !width) {
    const missingData = document.createElement("span");
    missingData.textContent = "Please fill both height and width";
    missingData.id = "missingData";
    documentBody.appendChild(missingData);
    return;
  }
  const linkForResizedImage = document.createElement("a");
  linkForResizedImage.id = "resizedImage";
  linkForResizedImage.target = "_blank";
  linkForResizedImage.textContent = "Click here to access resized image";
  linkForResizedImage.href = `/image?height=${height}&width=${width}&imageName=${selectedImage}`;
  documentBody.appendChild(linkForResizedImage);
});
