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
    let menuItemsUrl =
    "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
    let menuItemsTitleHtml = "snippets/menu-items-title.html";
    let menuItemHtml = "snippets/menu-item.html";

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
            allCategoriesUrl,
            buildAndShowHomeHTML, // ***** <---- TODO: STEP 1: Substitute [...] ******
            true);
    });

    let buildAndShowHomeHTML = (categories) => {
        // Load home snippet page
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function(homeHtml) {
                let chosenCategoryShortName = chooseRandomCategory(categories).short_name;

                chosenCategoryShortName = `'${chosenCategoryShortName}'`;
                let homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", chosenCategoryShortName);
                insertHTML("#main-content", homeHtmlToInsertIntoMainPage);
            },
            false
        );
    }

    let chooseRandomCategory = (categories) => {
        let randomArrayIndex = Math.floor(Math.random() * categories.length);
        return categories[randomArrayIndex];
    }

    // Load the menu categires view
    dc.loadMenuCategories = () => {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTMl);
    }

    // Load the menu items view
    // 'categoryShort' is a short_name for a category
    dc.loadMenuItems = (categoryShort) => {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            menuItemsUrl + categoryShort,
            builAndShowMenuItemsHTML
        );
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

    let builAndShowMenuItemsHTML = (categoryMenuItems) => {
        //Load title snippet of menu items
        $ajaxUtils.sendGetRequest(
            menuItemsTitleHtml,
            function(menuItemsTitleHtml) {
                //Retrieve single menu items snippet
                $ajaxUtils.sendGetRequest(
                    menuItemHtml,
                    function(menuItemHtml) {
                        switchMenuToActive();
                        let menuItemsViewHTML = builMenuItemsViewHtml(
                            categoryMenuItems,
                            menuItemsTitleHtml,
                            menuItemHtml
                        );
                        insertHTML("#main-content", menuItemsViewHTML)
                    },
                    false
                );
            },
            false
        );
    }

    // Using category and menu items data and snippets html
   // builds menu items views hTML to be inserted page
    let builMenuItemsViewHtml = (
        categoryMenuItems,
        menuItemsTitleHtml,
        menuItemHtml
    ) => {
            menuItemsTitleHtml = insertProperty(
                menuItemsTitleHtml,
                "name", 
                categoryMenuItems.category.name
            );

            menuItemsTitleHtml = insertProperty(
                menuItemsTitleHtml,
                "special_instructions",
                categoryMenuItems.category.special_instructions
            );

            let finalHTML = menuItemsTitleHtml;
            finalHTML += `<section class='row'>`

            // Loop over categories
            let menuItems = categoryMenuItems.menu_items;
            let catShortName = categoryMenuItems.category.short_name;
            for (let i = 0; i < menuItems.length; i++) {
                // Insert menu item values
                let html = menuItemHtml;
                html = insertProperty(html, "short_name", menuItems[i].short_name);
                html = insertProperty(html, "catShortName", catShortName);
                html = insertItemPrice(html, "price_small", menuItems[i].price_small);
                html = insertItemPortionName(
                    html,
                    "small_portion_name",
                    menuItems[i].small_portion_name
                );
                html = insertItemPrice(html, "price_large", menuItems[i].price_large);
                html = insertItemPortionName(
                    html,
                    "large_portion_name",
                    menuItems[i].large_portion_name
                );
                html = insertProperty(html, "name", menuItems[i].name);
                html = insertProperty(html, "description", menuItems[i].description);

                // Add clearfix after every second menu items

                if(i % 2 != 0) {
                    html +=
                        `<div class='clearfix visible-lg-block visible-md-block'></div>`
                }

                finalHTML += html;
            }

            finalHTML += `</section>`
            return finalHTML
    }

    // Appends price with '$' if price exist
    let insertItemPrice = (
        html,
        pricePropName,
        priceValue
    ) => {
        // If not specified, return original string
        if(!priceValue) {
            return insertProperty(html, pricePropName, "");
        }

        priceValue = `$${priceValue.toFixed(2)}`
        html = insertProperty(html, pricePropName, priceValue);
        return html
    }

    // Appends portion name in parens if it exists
    let insertItemPortionName = (
        html,
        portionPropName,
        portionValue
    ) => {
       // If not specified, return original string
       if(!portionValue) {
           return insertProperty(html, portionPropName, "");
       }

       portionValue = `(${portionValue})`
       html = insertProperty(html, portionPropName, portionValue);
       return html
    }
    
    
    global.$dc = dc;
    
})(window);