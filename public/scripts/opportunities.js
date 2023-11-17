const keywordInput = document.querySelector(".keyword input")
const dateInput = document.querySelector(".date input")
const locationInput = document.querySelector(".location input")
const btn = document.querySelector(".searchBtn input")

btn.addEventListener("click", () => {
    let data = {
        keyword: keywordInput.value,
        zipcode: locationInput.value,
        date: dateInput.value
    }
    
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    
    fetch('/opportunities', options)
        .then(response => response.json())
        .then(data => {
            console.log(data)    
        })
})