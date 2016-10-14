
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetAddress = $("#street").val();
    var cityState = $("#city").val();
    var completeAddress = streetAddress + ', ' + cityState;
    $greeting.text('So, you want to live at ' + completeAddress +'?');
    var imageURL = '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + 
    	completeAddress + '"/>';
    $body.append(imageURL);

    var nytimesSearch = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityState + 
    	'&sort=newest&api-key=7749617247d34db7b99342ca8302b233';
    console.log(nytimesSearch);
    $.getJSON(nytimesSearch, function(data){
    	$nytHeaderElem.text('New York Times Articles About ' + cityState);

    	var articles = data.response.docs;
    	for(var i = 0; i < articles.length; i++) {
    		var article = articles[i];
    		$nytElem.append('<li class="article">' +
    			'<a href="' + article.web_url + '">' + article.headline.main+
    				'</a>' + 
    			'<p>' + article.snippet + '</p>' +
    			'</li>');
    	}
    }).error(function(e) {
    	$nytHeaderElem.text('New York Times Articles Could Not Be Loaded.');
    });

    var wikipediaSearchURL = 'http://en.wikipaaaedia.org/w/api.php?action=opensearch&search=' +
    	cityState + '&format=json&callback=wiliCallback';

    var wikiRequestTimeout = setTimeout(function(){
    	$wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
    	url: wikipediaSearchURL,
    	dataType: "jsonp",
    	// jsonp: "callback" -- change if the name of the api call back is different from callback
    	success: function(response) {
    		var articleList = response[1];

    		for(var i = 0; i < articleList.length; i++) {
    			articleStr = articleList[i];
    			var url = 'http://en.wikipedia.org/wiki/' + articleStr;
    			$wikiElem.append('<li><a href="' + url + '">' + 
    				articleStr + '</a></li>');
    		}
    		clearTimeout(wikiRequestTimeout);
    	}
    });

    return false;
};

$('#form-container').submit(loadData);
