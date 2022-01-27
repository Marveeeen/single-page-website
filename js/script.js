/* COllapseble Navbar */
$(function() {
    $("#navbarToggle").on("blur", function(e) {
        var screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $("#collapsable-nav").collapse("hide");
        }
    });

    $("#navbarToggle").on("click", function (e) {
        $(e.target).focus();
    })
})