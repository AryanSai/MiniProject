let current = 0,
  storyData,
  audio,
  dictionary;

function updatePageContent() {
  const currentSlide = storyData.story.slides[current];
  document.getElementById("image").src = currentSlide.photo;

  const keywords = dictionary.words.map((wordObj) => wordObj.word);
  const textElement = document.getElementById("text");
  textElement.innerHTML = highlight(currentSlide.text, keywords);

  if (audio) {
    audio.pause(); // stop the current before creating a new Audio object
    audio.currentTime = 0;
  }
  audio = new Audio(currentSlide.audio);
  playAudio();
}

function highlight(content, keywords) {
  keywords.forEach((keyword) => {
    const replacement = `<a href="Glossary.html#${encodeURIComponent(
      keyword
    )}" class="highlight" title="">${keyword}</a>`;

    const regex = new RegExp(keyword, "ig");
    content = content.replace(regex, replacement);
  });

  return content;
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
  const storyFetch = fetch(
    "http://0.0.0.0:8000/Stories/Story1/Story1.json"
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.statusText}`);
    }
    return response.json();
  });

  const dictionaryFetch = fetch("http://0.0.0.0:8000/Dictonary.json").then(
    (response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Dictionary JSON: ${response.statusText}`
        );
      }
      return response.json();
    }
  );

  Promise.all([storyFetch, dictionaryFetch])
    .then(([storyDataResponse, dictionaryData]) => {
      storyData = storyDataResponse; // Corrected assignment
      dictionary = dictionaryData;
      updatePageContent();
    })
    .catch((error) => console.error("Error fetching JSON:", error.message));
};
