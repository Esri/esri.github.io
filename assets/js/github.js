// unauthenticated requests are rate-limited to 6/min
var githubSearchURL = 'https://api.github.com/search/repositories';
var sort = 'sort=stars&order=desc';
var githubOrg = '+org:Esri';

function assembleSearchUrl(keywords) {
    var query = '?q=';

    if (keywords) {
        keywords = keywords.trim();
        query += 'topic:' + keywords.replace(/ +/g, '+topic:');
    }

    query += '+NOT+deprecated';
    query += githubOrg;
    return githubSearchURL + query + '&' + sort;
}

function showQueryResults(tags, response) {
    showElement($(".spinner-container"), false);
    showElement($("#numReposFound"), true);
    if (!response.message) {
        $('#numReposFound').html(response.total_count);
    } else if (response.message && response.message.indexOf('API rate limit exceeded') > -1) {
        showElement($("#numReposFound"), false);
        console.error("GitHub API rate limit exceeded...");
    } else {
        $('#numReposFound').html("0");
    }
}

function showQueryError(tags, error) {
    showElement($(".spinner-container"), false);
    showElement($("#numReposFound"), false);
    console.error(error.message);
}

function showElement(ele, show) {
    if (show) {
        ele.removeClass("hide");
    } else {
        ele.addClass("hide")
    }
}

function clearResults() {
    $("#numReposFound").empty();
}

function redirectIfQuery() {
    var pageName = window.location.toString(),
        delimiterPosition,
        redirectURL = 'https://github.com/Esri?q=',
        topicList = document.getElementById('esri-topic-list').childNodes,
        redirected = false;

    delimiterPosition = pageName.indexOf('#');

    // if a hashed query is passed and cant be matched with our list of valid topics, redirect a canned github search
    if (delimiterPosition >= 0 && pageName.length - 1 > delimiterPosition) {
        for (var i=1; i < topicList.length; i++) {
            if (pageName.substr(delimiterPosition + 1) === topicList[i].innerHTML) {
                return redirected;
            }
        }
        pageName = redirectURL + pageName.substr(delimiterPosition + 1);
        redirected = true;
        window.location = pageName;            
    }
    return redirected;
}

function getSelectedTags() {
    var selectedOptions,
        selectedTags = [];
    selectedOptions = $("select option:selected"),
    selectedOptions.each(function() {
        selectedTags.push($(this).data("filter"));
    });
    return selectedTags;
}

$(function() {
    // Backwards compatibility - Redirect if query doesn't match a topic e.g. esri.github.io/#bootstrap-map-js
    if (redirectIfQuery()) {
        return;
    }
    
    $(document).ready(function() {

        // Show control after select is loaded
        $(".chzn-select").removeClass("hidden");

        // Initialize chosen
        $(".chosen-select").chosen({width: "100%", max_selected_options: 3});
        
        // Provide spell check search
        $(".chosen-container .search-field .chosen-search-input").attr("spellcheck", false);
        
        // Fetch number of repos that match query
        $("select").change(function() {
            // UI
            clearResults();
            showElement($("#numReposFound"), false);
            showElement($(".spinner-container"), true);
            // Get tags
            var selectedTags = getSelectedTags();
            // Fetch repos
            if (selectedTags.length > 0) {
                var tags = selectedTags.join(" ");
                var searchURL = assembleSearchUrl(tags);
                fetch(searchURL).then(function (response) {
                   response.json().then(function(json) {
                       showQueryResults(tags, json)
                   }, function (error) {
                       showQueryError(tags, error);
                   });
                },
                function (error) {
                    showQueryError(tags, error);
                });
            } else {
                showElement($(".spinner-container"), false);
                showElement($("#numReposFound"), false);
            }
        });

        // Go to GitHub
        $("#btnViewRepos").on("click", function(e){
            e.preventDefault();
            var urlEsriBase = "https://github.com/Esri";
            // Get tags
            var selectedTags = getSelectedTags();
            if (selectedTags.length > 0) {
                var tags = selectedTags.join("+topic:");
                window.location.href = urlEsriBase + '?q=topic:' + tags;
            } else {
                window.location.href = urlEsriBase;
            }
        })
    })
});
