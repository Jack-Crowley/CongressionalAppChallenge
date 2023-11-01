const form = document.getElementById('registration-form');
const slides = document.querySelectorAll('.slide');
const progressBar = document.querySelector('.progress-bar');
// const tesseract = require('tesseract.js');
// import { createWorker } from 'tesseract.js';
// import 'tesseract.js';
let currentSlide = 0;

function updateProgressBar() {
    const percent = ((currentSlide + 1) / slides.length) * 100;
    progressBar.style.width = percent + '%';
}

function showSlide(slideNumber) {
    slides.forEach((slide, index) => {
        if (index === slideNumber) {
            slide.style.display = 'block';
        } else {
            slide.style.display = 'none';
        }
    });
    currentSlide = slideNumber;
    updateButtons();
    updateProgressBar();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
    } else {
        // You can handle form submission here
        alert('Registration complete!');
    }
});

// ... (previous JavaScript code) ...

const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

function moveSlide(direction) {
    const newSlide = currentSlide + direction;
    if (newSlide >= 0 && newSlide < slides.length) {
        showSlide(newSlide);
    }
}

function updateButtons() {
    console.log(currentSlide)
    if (currentSlide === 0) {
        prevButton.setAttribute('display', 'none');
    } else if (currentSlide === slides.length - 1) {
        nextButton.setAttribute('display', 'none');
    } else {
        prevButton.setAttribute('display', 'block');
        nextButton.setAttribute('display', 'block');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const scanButton = document.getElementById('scanButton');
    const resultElement = document.getElementById('result');

    scanButton.addEventListener('click', () => {
        const file = imageInput.files[0];
        if (file) {
            // const worker = tessearct.createWorker({
            //     logger: m => console.log(m),
            // });

            // (async () => {
            //     await worker.load();
            //     await worker.loadLanguage('eng');
            //     await worker.initialize('eng');
            //     const { data: { text } } = await worker.recognize(file);
            //     resultElement.textContent = text;
            //     await worker.terminate();
            // })();
            const t = new Tesseract();
            t.setImage(file);
            t.recognize();
            resultElement.textContent = t.getText();
        }
    });
});


prevButton.addEventListener('click', () => moveSlide(-1));
nextButton.addEventListener('click', () => moveSlide(1));

// Initial setup
updateButtons();
showSlide(currentSlide);
