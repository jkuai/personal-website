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


const buttons = document.querySelectorAll('.button_img');

buttons.forEach(button => {
  const popup = button.nextElementSibling; // assumes popup follows button
  const closeBtn = popup.querySelector('.close-btn');

  button.onclick = () => {
    popup.classList.add('active');
  };

  closeBtn.onclick = () => {
    popup.classList.remove('active');
  };
});

