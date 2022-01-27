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
});

(function (global) {
    let dc = {};

    var homeHtml = "snippets/home-snippet.html";

    //convinience function for inserting innerHTML for 'select'
    let insertHTML = (selector, html) => {
        let targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    }

    // Show loading icon inside element identified by 'selector'.
    let showLoading = (selector) => {
        let html = `<div class='text-center'>`;
        html += `<img src='./images/ajax-loader.gif'></div>`
        insertHTML(selector, html);
    }

    // On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function(event) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false
        );
    })

    global.$dc = dc;
    
})(window);