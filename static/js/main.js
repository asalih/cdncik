window.onload = function () {
    var child = document.createElement("div");
    child.innerHTML = "appended onload!";


    document.body.appendChild(child);
}
