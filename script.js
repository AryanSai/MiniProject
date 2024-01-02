const text = [
  "On a bright spring morning, Collette and Jimmy went to the zoo.",
  '"Collette, what animals do you want to see today at the zoo?" asked Jimmy.  "I want to see the jaguars" , answered Collette.',
  '"Cool!" said Jimmy. "Let\'s go."',
];

let current = 0;

function updatePageContent() {
  document.getElementById("image").src = `Images/${current + 1}.jpg`;
  document.getElementById("text").textContent = text[current];
  document.getElementById("audioPlayer").src = `Audio/${current + 1}.mp3`;
}

function nextPage() {
  if (current < text.length - 1) {
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

window.onload = updatePageContent;
