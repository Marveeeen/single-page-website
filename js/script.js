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

    let homeHtml = "snippets/home-snippet.html";
    let allCategoriesUrl =
    "http://davids-restaurant.herokuapp.com/categories.json";
    let categoriesTitleHtml = "snippets/categories-title-snippet.html";
    let categoryHtml = "snippets/category-snippet.html";

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

    // Return subtiture of '{{propName}}'
    // with propValue in given 'String'
    let insertProperty = (string,  propName, propValue) => {
        let propToRepalce = `{{${propName}}}`

        string = string.replace(new RegExp(propToRepalce, "g"), propValue);
        return string;
    }

    let switchMenuToActive = () => {
        //remove 'active' from home button
        let classes = document.querySelector("#navHomeButton").className;
        classes = classes.replace(new RegExp("active", "g"), "");
        document.querySelector("#navHomeButton").className = classes;

        //add 'active' to menu button if not already there
        classes = document.querySelector("#navMenuButton").className;
        if(classes.indexOf("active") === -1) {
            classes += " active";
            document.querySelector("#navMenuButton").className = classes
        }

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
    });

    // Load the menu categires view
    dc.loadMenuCategories = () => {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTMl);
    }

    // Builds HTML for the categroeis page based on the data
    // from the server
    let buildAndShowCategoriesHTMl = (categories) => {
        // Load title snippet of categories page

        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
                //Retrieve single category snippet
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    function(categoryHtml) {
                        switchMenuToActive();
                        let categoriesViewHTML = buildCategoriesViewHTML(
                            categories,
                            categoriesTitleHtml,
                            categoryHtml
                        );
                        insertHTML("#main-content", categoriesViewHTML);
                    },
                    false
                );
            },
            false
        );
    }

    // using categories data and snippets html
    // build categories view html to be inserted into page
    let buildCategoriesViewHTML = (
        categories,
        categoriesTitleHtml,
        categoryHtml
    ) => {
        let finalHTML = categoriesTitleHtml;
        finalHTML += `<section class='row'>`;

        // Loop over categories
        for (let i = 0; i < categories.length; i++) {
            //inser category values
            let html = categoryHtml;
            let name = "" + categories[i].name;
            let short_name = categories[i].short_name;

            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHTML += html;
        }

        finalHTML += `</section>`;
        return finalHTML

    }
    
    global.$dc = dc;
    
})(window);