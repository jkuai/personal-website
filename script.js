const text = "JESLYN KUAI";
const speed = 100;
let i = 0;
const target = document.getElementById("typing");

function typeWriter() {
  if (i < text.length) {
    target.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

window.onload = typeWriter;