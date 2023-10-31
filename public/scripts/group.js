extraInfo = document.querySelector('.extraInformation')

document.querySelectorAll('.options a').forEach((elm) => {
    elm.addEventListener('click', () => {
        document.querySelector(".active").classList.remove("active")
        elm.classList.add('active')

        document.querySelector(".activeSection").style.opacity = "0";

        setTimeout(() => {
            document.querySelector(".activeSection").classList.remove("activeSection")
            document.querySelector(`.${elm.dataset.selector}`).classList.add('activeSection')
            document.querySelector(".activeSection").style.opacity = "1";
        }, 1000)
        console.log()
    })
})