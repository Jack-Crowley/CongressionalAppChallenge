document.querySelector(".join").addEventListener("click", () => {
    x= prompt("Enter the join code;");
    window.location.href = "/group/join/"+x
})