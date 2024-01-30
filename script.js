let current = 0,
  storyData,
  storiesData,
  audio,
  dictionary,
  storyJSON,
  finalUrl;

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

function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

window.onload = () => {
  var storyId = getUrlParameter("id");
  console.log("Story ID:", storyId);

  const storyJSON = fetch("http://0.0.0.0:8000/Stories.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      storiesData = data;
      var baseUrl = "http://0.0.0.0:8000/";
      finalUrl = baseUrl + storiesData.stories[storyId].path;
      return fetch(finalUrl);
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${response.statusText}`);
      }
      return response.json();
    })
    .then((storyDataResponse) => {
      storyData = storyDataResponse;
      return fetch("http://0.0.0.0:8000/Dictonary.json");
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Dictionary JSON: ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((dictionaryData) => {
      dictionary = dictionaryData;
      updatePageContent();
    })
    .catch((error) => console.error("Error fetching JSON:", error.message));
};
