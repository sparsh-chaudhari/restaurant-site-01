



$(function () { // Same as document.addEventListener("DOMContentLoaded"...

 // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
 $(".navbar-toggle").blur(function (event) {
   var screenWidth = window.innerWidth; //With of the browser window itself.
   if (screenWidth < 768) {
     $("#collapsable-nav").collapse('hide'); //collapse is een functie in bootstrap.js, hetgeen JQuery is.
   }
});


  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});



(function(global){
  var lehza ={};

  var homehtml = "../snippets/home-snippet.html";
  var jsoncategories = "./categories.json";
  var jsonitems ="https://mock-x0i2.onrender.com/menu_items_";
  var categoryhtml = "../snippets/category-snippet.html";   
  var categoriestitlehtml = "../snippets/categories-title-snippet.html";
  var itemhtml ="../snippets/item-snippet.html";
  var itemtitlehtml = "../snippets/item-title-snippet.html";

  var insertHtml = function(selector, html){
    var target = document.querySelector(selector);
    target.innerHTML = html;
  };


  var showloading = function (selector) {
    var html = "<div class = 'text-center'>";
    html += "<img src='images/Spinner-200px.gif'></div>";
    insertHtml(selector, html);
  };

 
  var insertProperty = function(string, propname, propvalue){
    var proptoreplace = "{{" + propname + "}}";
    string = string.replace(new RegExp(proptoreplace, "g"), propvalue);
    return string;
  };


  var switchMenuToActive = function(){
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;


    // Add classes

    classes = document.querySelector("#navMenuButton").className;
    if(classes.indexOf("active") == -1){
       classes +="active";
      document.querySelector("#navMenuButton").className = classes;
    }
  };


 
  document.addEventListener("DOMContentLoaded", function(event){

    showloading("#main-content");
    $ajaxUtils.sendGetRequest(
      homehtml,
      function(responseText){
        document.querySelector("#main-content").innerHTML=responseText;}, 
        false);
  });


  lehza.loadMenuCategories = function(){

    showloading("#main-content");
    $ajaxUtils.sendGetRequest(jsoncategories, ShowCategoriesHtml);
  };


  var short= null;
  lehza.loadMenuItems = function(categoryshort) {
    short = categoryshort;

    showloading("#main-content");
    $ajaxUtils.sendGetRequest(jsonitems + categoryshort , ShowItemsHtml);


  };


  function ShowCategoriesHtml(categories) {
    $ajaxUtils.sendGetRequest(categoriestitlehtml, function(categoriestitlehtml){
       $ajaxUtils.sendGetRequest(categoryhtml, function(categoryhtml){
        switchMenuToActive();
        var categoriesShowhtml= builtcategoriesShowhtml(categories, categoriestitlehtml, categoryhtml);
        insertHtml("#main-content", categoriesShowhtml);
       }, false);

    }, false);

    
  }

  function builtcategoriesShowhtml(categories, categoriestitlehtml, categoryhtml){
    var finalHtml = categoriestitlehtml;
    finalHtml += "<section class='row'>";

    for(var i =0; i< categories.length; i++){
      
      var html =categoryhtml;
      var name = categories[i].name;
      var short_name= categories[i].short_name;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }


  function ShowItemsHtml(items) {
    $ajaxUtils.sendGetRequest(itemtitlehtml, function(itemtitlehtml){
       $ajaxUtils.sendGetRequest(itemhtml, function(itemhtml){
        switchMenuToActive();
        var itemShowhtml= builtitemShowhtml(items, itemtitlehtml, itemhtml);
        insertHtml("#main-content", itemShowhtml);
       }, false);

    }, false);

    
  }

  function builtitemShowhtml(items, itemtitlehtml, itemhtml){
      
      itemtitlehtml = insertProperty(itemtitlehtml, "name", items[0].c_name);
     

      var finalHtml = itemtitlehtml;
      finalHtml += "<section class='row'>";

      
      
     

      for(var i = 0; i < items.length; i++){

        var html = itemhtml;
        var catShortName = items[0].c_short_name;
        html = insertProperty(html, "short_name", items[i].short_name);
        html = insertProperty(html, "catShortName", catShortName);

        html = insertItemPrice(html, "price_small", items[i].price_small);
        html = insertItemPortionName(html,"small_portion_name", items[i].small_portion_name);
        html = insertItemPrice(html, "price_large", items[i].price_large);
        html = insertItemPortionName(html,"large_portion_name", items[i].large_portion_name);

        html = insertProperty(html, "name", items[i].name);
        html = insertProperty(html, "description", items[i].description);

        if(i%2 !=0){
          html+="<div class='clearfix visible-lg-block visible-md-block'></div>"
        }
        finalHtml += html;
      }

        finalHtml +="</section>";
        return finalHtml;


  }
  
function insertItemPrice(html, pricePropName, priceValue){
  if(!priceValue){
    return insertProperty(html, pricePropName, "");
  }
    priceValue = "₹" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }

  function insertItemPortionName(html, portionPropName, portionValue) {
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }

    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }
  
  global.$lehza = lehza;

}) (window);
