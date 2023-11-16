const mobileMenuButton = document.querySelector('.navToggle');
const subheadings = document.querySelector('.subheadings');

mobileMenuButton.addEventListener('click', function () {
    subheadings.style.display = subheadings.style.display === 'flex' ? 'none' : 'flex';
});