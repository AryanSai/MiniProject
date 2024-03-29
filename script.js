let current = 0,
  storyData,
  storiesData,
  audio,
  dictionary,
  finalUrl,
  storyId,
  numberOfSlides;

function showTitleCard() {
  document.getElementById("cardTitle").textContent =
    storiesData.stories[storyId].title;
  document.getElementById("author").textContent =
    "A story by: " + storiesData.stories[storyId].author;
  document.getElementById("titleImage").src =
    storiesData.stories[storyId].titleImage;

  numberOfSlides = storyData.story.slides.length;
}

function showEndCard() {
  document.getElementById("endtitle").textContent =
    storiesData.stories[storyId].title;
  document.getElementById("slide").style.display = "none";
  document.getElementById("endcard").style.display = "block";
}

function downloadPDF() {
  var link = document.createElement("a");
  link.href = storiesData.stories[storyId].pdf;
  link.download = storiesData.stories[storyId].pdf;
  link.click();
}

function showSlide() {
  current = 0;
  updatePagination();
  var paginationContainer = null;
  document.getElementById("endcard").style.display = "none";
  document.getElementById("titlecard").style.display = "none";
  document.getElementById("slide").style.display = "block";

  paginationContainer = document.getElementById("paginationContainer");

  if (paginationContainer !== null) {
    paginationContainer.innerHTML = "";
  }
  for (var i = 0; i < numberOfSlides; i++) {
    var link = document.createElement("a");
    link.href = "#";
    link.textContent = i + 1;
    if (i === 0) {
      link.classList.add("active");
    }
    paginationContainer.appendChild(link);

    link.addEventListener("click", function (event) {
      var links = document.querySelectorAll(".pagination a");
      links.forEach(function (link) {
        link.classList.remove("active");
      });
      event.target.classList.add("active");
      var pageNumber = parseInt(event.target.textContent);
      getPageByNumber(pageNumber - 1);
    });
  }
  updatePageContent();
}

function updatePageContent() {
  const currentSlide = storyData.story.slides[current];
  document.getElementById("title").textContent =
    storiesData.stories[storyId].title;
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

    const replacement = `<span class="highlight" title="${meaning}" onclick="displayMeaning('${keyword}')">${keyword}</span>`;

    const regex = new RegExp(keyword, "ig");
    content = content.replace(regex, replacement);
  });

  return content;
}

function getMeaning(keyword) {
  const wordObj = dictionary.words.find((wordObj) => wordObj.word === keyword);

  if (wordObj) {
    return {
      meaning: wordObj.meaning,
      image: wordObj.image || "Image not available",
    };
  } else {
    return { meaning: "Meaning not found", image: "Image not available" };
  }
}

function playAudio() {
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}

function getPageByNumber(pageNumber) {
  closeSideNav();
  current = pageNumber;
  updatePagination();
  updatePageContent();
}

function nextPage() {
  closeSideNav();
  if (current < numberOfSlides - 1) {
    current++;
    updatePagination();
    updatePageContent();
  } else {
    current = 0;
    audio.pause();
    showEndCard();
  }
}

function prevPage() {
  closeSideNav();
  if (current > 0) {
    current--;
    updatePagination();
    updatePageContent();
  }
}

function updatePagination() {
  var paginationLinks = document.querySelectorAll(".pagination a");
  paginationLinks.forEach(function (link, index) {
    if (index === current) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function displayMeaning(keyword) {
  audio.pause();
  audio.currentTime = 0;
  const { meaning, image } = getMeaning(keyword);
  document.getElementById("word").innerHTML = keyword;
  document.getElementById("meaning").innerHTML =
    "<strong>Meaning:</strong> " + meaning;
  document.getElementById("meaningImage").src = image;
  meaningImage;
  openSideNav();
}

function openSideNav() {
  document.getElementById("sidenav").style.width = "100%";
}

function closeSideNav() {
  document.getElementById("sidenav").style.width = "0";
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
  const storyJSON = fetch("http://127.0.0.1:5500/Stories/Stories.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      storiesData = data;
      var baseUrl = "http://127.0.0.1:5500/";
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
      return fetch("http://127.0.0.1:5500/Dictionary/Dictonary.json");
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
      showTitleCard();
    })
    .catch((error) => console.error("Error fetching JSON:", error.message));
};
