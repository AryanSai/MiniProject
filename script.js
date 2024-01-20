let current = 0,
  storyData,
  audio,
  dictionary;

function updatePageContent() {
  const currentSlide = storyData.story.slides[current];
  document.getElementById("image").src = currentSlide.photo;
  document.getElementById("text").textContent = currentSlide.text;

  //highlighting
  // const keywords = currentSlide.keywords;
  // console.log('Keywords for Slide:', keywords);

  if (audio) {
    audio.pause(); // stop the current before creating a new Audio object
    audio.currentTime = 0;
  }
  audio = new Audio(currentSlide.audio);
  playAudio();
}

function playAudio() {
  audio.pause(); //stop the current before replaying
  audio.currentTime = 0;
  audio.play();
}

function nextPage() {
  if (current < storyData.story.slides.length - 1) {
    current++;
    updatePageContent();
  }
}

function prevPage() {
  if (current > 0) {
    current--;
    updatePageContent();
  }
}

window.onload = () => {
  fetch("http://0.0.0.0:8000/Stories/Story1/Story1.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      storyData = data;
      updatePageContent();
    })
    .catch((error) => console.error("Error fetching JSON:", error.message));

  fetch("http://0.0.0.0:8000/Dictonary.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch Story JSON: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      dictionary = data;
    })
    .catch((error) => console.error("Error fetching Dictionary JSON:", error.message));
};
