/**
 * Created by Swagat Ghimire on 2016-11-04.
 */

//Data [0-url, 1-title, 2-date, 3-source, 4-snippet]

function compileGua (JSONData){
    var articles = [];

        for (var i = 0; i < JSONData.response.results.length; i++){
            var result = JSONData.response.results[i];
            var artSite = result.webUrl;
            var artTitle = result.webTitle;
            var artDate = result.webPublicationDate.substr(0, 10);
            var artSource = "The Guardian";
            var artSnippet = "No Info";
            var currArt = [artSite, artTitle, artDate, artSource, artSnippet];
            articles.push(currArt);
            //alert(articles[i].site);

    }
    return articles;
}

function getGua(startDate, endDate, query) {

    var url = "http://content.guardianapis.com/search?page-size=200&api-key=8183fb40-19b5-4b8c-80c0-fefee717ac09&q="
    url += query;
    url += "&from-date=";
    url += startDate.year + "-" + startDate.month + "-" + startDate.day;
    url += "&to-date=";
    url += endDate.year + "-" + endDate.month + "-" + endDate.day;

    $.ajax({
        url: url,
        method: 'GET'
    }).done(function(result) {
        var articles = compileGua(result);
        //combineData(prevArt, articles);
        getSentiment(articles,0);
        //
        //console.log(result);
    }).fail(function(err) {
        throw err;
    });

}

function dateAdd(date, range) {
    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var currDate = parseFloat(date, 10);
    var currY = Math.floor(currDate / 10000);
    var currM = Math.floor(currDate / 100) % 100;
    var currD = currDate % 100;
    if ((currD + range) > monthDays[currM - 1]){
        if (currM == 12){
            currD = range - 31 + currD;
            currM = 1;
            currY ++;
        } else {
            currD = range - monthDays[currM-1] + currD;
            currM ++;
        }
    } else if ((currD + range) < 1){
        if (currM == 1){
            currD = 31 + currD + range;
            currM = 12;
            currY --;
        } else {
            currD = monthDays[currM - 2] + currD + range;
            currM --;
        }
    } else {
        currD += range;
    }

    if (currD < 10){
        currD = "0" + currD.toString();
    } else {
        currD = currD.toString();
    }
    return {year: currY.toString(), month: currM.toString(), day: currD};
}

function getSentiment(data, num) {
    var i = num;
    var url = "";
    url += "https://api.dandelion.eu/datatxt/sent/v1/?lang=en&url=";
    url += data[i][0];
    url += "&token=be8bf41e9adc4efa85e9813d9ea64a4b";
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (result) {
        var sentiment = "";
        var quality = result.sentiment.type;
        sentiment += quality + " sentiment: ";
        var quantity = result.sentiment.score;
        var score = Math.round((quantity / 2 + 0.5) * 100);
        sentiment += score.toString() + "%";
        data[i][4] = sentiment;
        //alert(i.toString() + ": " + sentiment);
        if ((i+1) == data.length || (i+1) == 12){
            outputData(data);
        } else {
            getSentiment(data, (num + 1));
        }
    }).fail(function (err) {
        throw err;
    });
}

function outputData(data) {
    //var card = $('<div>', {style:''
    var container = document.getElementById("newsData");

    for (var j = container.childElementCount-1; j >= 0; j-- ){
        container.removeChild(container.childNodes[j]);
        //alert("child removed: " + j.toString());
    }
    for (var i = 0; i < data.length && i < 12; i++) {
        //alert(data.length.toString());
        var div1 = document.createElement('div');
        div1.className = "body";
        var title = document.createElement('h3');
        title.innerHTML = "<a href=\'" + data[i][0] + "\' onclick=\"window.open(this.href); return false;\"style=\'text-decoration: none \'>" + data[i][1] + "</a>";
        div1.appendChild(title);
        var other = document.createElement('p');
        other.innerHTML = "By " + data[i][3] + "<br>" + data[i][2] + "<br>" + data[i][4];
        div1.appendChild(other);
        //alert(container.innerHTML.toString());
        container.appendChild(div1);
        //alert(container.childElementCount.toString());
    }

    return null;
}

function news(date, query) {
    // date should be an int in format YYYYMMDD
    //document.getElementById("test").firstChild.nodealue += "NEW";
    var dateRange = 3;
    var startDate = dateAdd(date, (0 - dateRange));
    var endDate = dateAdd(date, dateRange);
    //alert(startDate.day.toString());
    //var NYTData = null;
   // var NYTData = getNYT(startDate, endDate, query);
    //var GuaData = null;
    var GuaData = getGua (startDate, endDate, query);
}