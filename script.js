let current = 0,
  storyData,
  storiesData,
  audio,
  dictionary,
  storyJSON,
  finalUrl,
  title,
  storyId;

function updatePageContent() {
  title = storiesData.stories[storyId].title;
  const currentSlide = storyData.story.slides[current];
  document.getElementById("title").textContent = title;
  document.getElementById("image").src = currentSlide.photo;

  const keywords = dictionary.words.map((wordObj) => wordObj.word);
  const textElement = document.getElementById("text");
  textElement.innerHTML = highlight(currentSlide.text, keywords);

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  audio = new Audio(currentSlide.audio);
  playAudio();
}

function highlight(content, keywords) {
  keywords.forEach((keyword) => {
    const meaning = getMeaning(keyword);

    const replacement = `<span class="highlight" title="${meaning}" onclick="logMeaning('${keyword}')">${keyword}</span>`;

    const regex = new RegExp(keyword, "ig");
    content = content.replace(regex, replacement);
  });

  return content;
}

function getMeaning(keyword) {
  const wordObj = dictionary.words.find((wordObj) => wordObj.word === keyword);
  return wordObj ? wordObj.meaning : "Meaning not found";
}

function playAudio() {
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}

function nextPage() {
  closeSideNav();
  if (current < storyData.story.slides.length - 1) {
    current++;
    updatePageContent();
  }
}

function prevPage() {
  closeSideNav();
  if (current > 0) {
    current--;
    updatePageContent();
  }
}

function logMeaning(keyword) {
  const meaning = getMeaning(keyword);
  document.getElementById("word").innerHTML = keyword;
  document.getElementById("meaning").innerHTML = "Meaning: " + meaning;
  openSideNav();
}

function openSideNav() {
  document.getElementById("sideNav").style.width = "250px";
}

function closeSideNav() {
  document.getElementById("sideNav").style.width = "0";
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
  storyId = getUrlParameter("id");
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
