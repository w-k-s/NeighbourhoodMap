var WikipediaService = function(){
	var self = this;

	this.loadArticle = function(title,onSuccess, onError){
		const article = self.loadArticleFromStorage(title);
		if(article){
			onSuccess(article);
			return;
		}
		self.loadArticleFromNetwork(title,function(article){
			self.saveArticleToStorage(title, article);
			onSuccess(article);
		},function(error){
			onError(error);
		})
	};

	this.loadArticleFromNetwork = function(title,onSuccess,onError){
		const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
		$.ajax({
        	url: url,
        	type: "GET",
        	dataType: 'json', 
        	success: function(data){
        		const title = data["title"];
        		const imgSrc = data["thumbnail"]["source"];
        		const width = data["thumbnail"]["width"];
        		const height = data["thumbnail"]["height"];
        		const extract = data["extract_html"];
        		const content = 
        		`<h1>${title}</h1><br/><img src="${imgSrc}" width="${width}" height="${height}"/><br/><div>${extract}</div>`;
        		onSuccess(content);
        	},
        	fail: function(error){
        		onError(error);
        	}
}		);
	};

	this.loadArticleFromStorage = function(title){
		if(!localStorage.articles){
			return;
		}
		const articles = JSON.parse(localStorage.articles);
		return articles[title] || null;
	}

	this.saveArticleToStorage = function(title, article){
		if(!article){
			return;
		}
		let articles = {};
		if(localStorage.articles){
			articles = JSON.parse(localStorage.articles);
		}

		articles[title] = article;

		localStorage.articles = JSON.stringify(articles);
	}
};