const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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" ;
let isImageGenerating = false;

const updateImageCard = (imgDataarray) => {
    imgDataarray.forEach((imgObject,index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn  = imgCard.querySelector(".download-btn")

        
        //set the image source to the AI-generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        //when the img is loaded, remove the loading class and set download attribute
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href",aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Data().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        // Send a request to the OpenAI API to generate images based on user inputs
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!response.ok) throw new Error("Failed to generate images! Please try again.");

        const { data } = await response.json(); // Get data from response
        console.log(data);
        updateImageCard([...data])
    } catch (error) {
        alert(error.message);
    }finally {
        isImageGenerating = false;
    }
};




const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;

    //get user input ang image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

   //creating html markup for image cards with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
    `<div class="img-card loading">
        <img src="images/loader.svg" alt="image">
        <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon">
        </a>
    </div>`
   ).join("");

  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);