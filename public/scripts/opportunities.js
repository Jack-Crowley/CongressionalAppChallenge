const events = document.querySelector(".events")

function clearEvents() {
    document.querySelectorAll(".event").forEach((event) => {
        event.outerHTML=""
    })
}

`<div class="event" onclick="window.location.href = '/event/<%=event.eventID%>'">
    <div class="date">
        <h1 class="month"><%= new Date(event.date).toLocaleString('en-US', { month: 'short' }).toUpperCase() %></h1>
        <h1 class="day"><%= new Date(event.date).getDate() %></h1>
    </div>
    <div class="otherInfo">
        <h1 class="name"><%= event.name %></h1>
        <h2 class="company"><%= event.company %></h2>
        <h2 class="location"><%= event.address %></h2>
    </div>
</div>`

function createEvent(i, d, n, c, l) {
    let event = document.createElement("div")

    event.classList.add("event")

    event.addEventListener("click", () => {
        window.location.href = "/event/"+i
    })

    let date = document.createElement("div")
    date.classList.add("date")
    let month = document.createElement("h1")
    month.textContent = new Date(d).toLocaleString('en-US', { month: 'short' }).toUpperCase()
    month.classList.add("month")
    let day = document.createElement("h1")
    day.textContent = new Date(d).getDate()
    day.classList.add("day")
    date.appendChild(month)
    date.appendChild(day)
    event.appendChild(date)

    let otherInfo = document.createElement("div")
    otherInfo.classList.add("otherInfo")
    let name = document.createElement("h1")
    name.classList.add("name")
    name.textContent = n

    let company = document.createElement("h1")
    company.classList.add("company")
    company.textContent = c

    let location = document.createElement("h1")
    location.classList.add("location")
    location.textContent = l

    otherInfo.appendChild(name)
    otherInfo.appendChild(company)
    otherInfo.appendChild(location)

    event.appendChild(otherInfo)

    events.appendChild(event)
}

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
    
    clearEvents()
    
    fetch('/opportunities', options)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data.forEach((event) => {
                createEvent(event.ID, event.date, event.name, event.address, event.company)
            })
        })
})