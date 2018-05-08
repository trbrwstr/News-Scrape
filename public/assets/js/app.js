$.get("/articles");
$("#scrape-button").on("click", function () {
    console.log("button clicked");
    $.post("/scraper", function (data) {
        location.reload();
    })
})

$("body").on("click", "#edit-button", function () {
    console.log($(this).attr("data-id"))
})

$("body").on("click", "#delete-all-button", function () {
    const deleteRoute = "/articles/removeall"
    $.post(deleteRoute, function (data) {
        location.reload();
    })
});

$("body").on("click", "#delete-button", function () {
    const deleteRoute = `/articles/${$(this).attr("data-id")}`
    $.post(deleteRoute, function (data) {
        location.reload();
    })
})