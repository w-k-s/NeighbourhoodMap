/**
 * WikipediaService: Loads information about a place from wikipedia.
 * Caches place info to local Storage
 * @constructor
 */
var WikipediaService = function() {
    var self = this;

    /**
    * @function Loads article for given URL title.
    * Data will be retrieved from the cache if available;
    * otherwise it will be fetched from the network.
	* @param {string} title - The URL title of the wikipedia article.
	* @param {loadArticle~onSuccessCallback} onSuccess - The callback that handles success
    * @param {loadArticle~onErrorCallback} onError - The callback that handles error
    */
    this.loadArticle = function(title, onSuccess, onError) {
        const article = self.loadArticleFromStorage(title);
        if (article) {
            onSuccess(article);
            return;
        }
        self.loadArticleFromNetwork(title, function(article) {
            self.saveArticleToStorage(title, article);
            onSuccess(article);
        }, function(error) {
            onError(error);
        })
    };

    /**
    * @async
    * @function Loads article for given URL title through an API request
	* @param {string} title - The URL title of the wikipedia article.
	* @param {loadArticle~onSuccessCallback} onSuccess - The callback that handles success
    * @param {loadArticle~onErrorCallback} onError - The callback that handles error
    */
    this.loadArticleFromNetwork = function(title, onSuccess, onError) {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
        $.ajax({
            url: url,
            type: "GET",
            dataType: 'json',
            success: function(data) {
                const title = data["title"];
                const imgSrc = data["thumbnail"]["source"];
                const width = data["thumbnail"]["width"];
                const height = data["thumbnail"]["height"];
                const extract = data["extract_html"];
                const content =
                    `<h1>${title}</h1><br/><img src="${imgSrc}" width="${width}" height="${height}"/><br/><div>${extract}</div>`;
                onSuccess(content);
            },
            fail: function(error) {
                onError(error);
            }
        });
    };

    /**
    * Loads article for given URL title from localStorage
	* @param {string} title - The URL title of the wikipedia article.
	* @returns {string} article or null
    */
    this.loadArticleFromStorage = function(title) {
        if (!localStorage.articles) {
            return;
        }
        const articles = JSON.parse(localStorage.articles);
        return articles[title] || null;
    }

    /**
    * Saves article with given URL title to localStorage
	* @param {string} title - The URL title of the wikipedia article.
	* @param {string} article - The HTML content of the article.
    */
    this.saveArticleToStorage = function(title, article) {
        if (!article) {
            return;
        }
        let articles = {};
        if (localStorage.articles) {
            articles = JSON.parse(localStorage.articles);
        }

        articles[title] = article;

        localStorage.articles = JSON.stringify(articles);
    }

    /**
	 * The success callback of loading the wikipedia article
	 * @callback loadArticle~onSuccessCallback
	 * @param {string} The HTML extract of the article
	 */

	/**
	 * The error callback of loading the wikipedia article
	 * @callback loadArticle~onErrorCallback
	 * @param {object} The error object
	 */
};