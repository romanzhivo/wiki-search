const wikiServer = require('./wiki');
const querystring = require('querystring');

const queryDefaultParams = {
    action: 'query',
    format: 'json',
    formatversion: 2,
    origin: '*'
};

// Private functions

function createWikiRequest(params, success, error) {
    let promise = new Promise(function (resolve, reject) {
        wikiServer(params,
            (response)=>{
                resolve(success(response));
            },
            (response)=>{
                reject(error(response));
            }
        )
    });

    return promise;
}

function successDefault(data) {
    return {
        success: 1,
        data: data
    }
}

function errorDefault() {
    return {
        success: 0,
        data: {}
    }
}

// Private functions : END

module.exports = {
    /**
     * Get random Wiki articles
     *
     * */
    articleListRandom(params) {
        let localParams = {
            list: 'random',
            rnnamespace: 0,
            ...params
        }

        return this.articleList(localParams, 'random');
    },

    /**
     * Get Wiki articles by search string
     *
     * */
    articleListSearch(params) {
        let localParams = {
            list: 'search',
            srnamespace: 0,
            ...params
        }

        return this.articleList(localParams, 'search');
    },

    /**
     * Get Wiki articles by search string or random (basic function for articles getting)
     *
     * */
    articleList(params, queryType) {
        var self = this;

        let localParams = {
            ...params
        };

        let isExtractRequired = params.extract === 'true';

        let stringParams = querystring.stringify({
            ...queryDefaultParams,
            ...localParams
        });

        let promise = new Promise(function (resolve, reject) {
            createWikiRequest(stringParams, successLocal, errorLocal);
            
            function successLocal(response) {
                const parsedData = JSON.parse(response.data);
                const articles = parsedData && parsedData.query ? parsedData.query[queryType] : [];
                let handledArticlesWithUrl = [];
                let handledArticlesWithUrlAndExtract = [];
                let handledArticlesWithUrlPromises = [];
                let handledArticlesWithExtractPromises = [];
                let handledArticles = [];
                let promiseArticleGet;
                let promiseArticleExtract;

                articles.forEach((el, i) => {
                    let urlStringParams = {
                        prop: 'info',
                        pageids: queryType === 'random' ? el.id : el.pageid,
                        inprop: 'url'
                    };
                    let extractStringParams = {
                        pageids: queryType === 'random' ? el.id : el.pageid
                    };

                    let promisesUrl = self.articleGet(urlStringParams);
                    let promisesExtract = self.articleGetextract(extractStringParams);

                    handledArticlesWithUrlPromises.push(promisesUrl);
                    handledArticlesWithExtractPromises.push(promisesExtract);
                });

                promiseArticleGet = Promise.all(handledArticlesWithUrlPromises);

                if(isExtractRequired) {
                    promiseArticleExtract = Promise.all(handledArticlesWithExtractPromises);
                }

                Promise.all([promiseArticleGet, promiseArticleExtract]).then(
                    (success) => {
                        let articlesUrl = success[0];
                        let articlesExtract = success[1];
                        // console.log('articlesUrl', articlesUrl)
                        // console.log('articlesExtract', articlesExtract)

                        if(Array.isArray(articlesUrl)) {
                            articlesUrl.forEach((el, i)=>{
                                let article = el.data.article;
                                if(article) {
                                    handledArticlesWithUrl.push({
                                        ...handleArticles([article])[0]
                                    });
                                }
                            });
                        }

                        if(Array.isArray(articlesExtract)) {
                            handledArticlesWithUrl.forEach((el, i) => {
                                let article = el;
                                if(article) {
                                    let data = articlesExtract[i].data;
                                    handledArticlesWithUrlAndExtract.push({
                                        ...el,
                                        extract: data && data.article ? data.article.extract : ''
                                    });
                                }
                            });
                        }

                        if(isExtractRequired) {
                            handledArticles = handledArticlesWithUrlAndExtract;
                        } else {
                            handledArticles = handledArticlesWithUrl;
                        }

                        resolve(successDefault({articles: handledArticles}))
                    },
                    (error) => {
                        errorLocal();
                    }
                )
            }

            function errorLocal() {
                reject(errorDefault());

                return errorDefault();
            }
            
            function handleArticles(articles) {
                let handled = [];


                articles.forEach((el, i) => {
                    // console.log('el',el)
                    handled.push({
                        id: el.pageid || el.id,
                        title: el.title,
                        extract: el.extract,
                        url: el.canonicalurl
                    });
                })

                // console.log('handled',handled)
                return handled;
            }
        });

        return promise;
    },

    /**
     * Get single Wiki article by id
     *
     * */
    articleGet(params) {
        let stringParams = querystring.stringify({
            ...queryDefaultParams,
            ...params
        });

        let promise = createWikiRequest(stringParams, success, errorDefault);

        function success(response) {
            let parsedData;
            try {
                parsedData = JSON.parse(response.data);
            } catch(e) {
                parsedData = undefined;
            }
            const article = parsedData && parsedData.query && Array.isArray(parsedData.query.pages) ? parsedData.query.pages[0] : undefined;

            return successDefault({article: article});
        }

        return promise;
    },

    /**
     * Get Wiki article's extract by id
     *
     * */
    articleGetextract(params) {
        let localParams = {
            prop: 'extracts',
            exsentences: 5,
            exlimit: 1,
            exsectionformat: 'plain',
            explaintext: true,
            ...params
        };

        // console.log('localParams',localParams)

        return this.articleGet(localParams)
    },

    /**
     * Get Wiki image files by a file name or it's fragment
     *
     * */
    imageList(params) {
        let localParams = {
            list: 'allimages',
            ailimit: 10,
            aiprop: "canonicaltitle|url|metadata|parsedcomment"
        };

        let stringParams = querystring.stringify({
            ...queryDefaultParams,
            ...localParams,
            ...params
        });

        let promise = createWikiRequest(stringParams, success, errorDefault);

        function success(response) {
            let parsedData;
            try {
                parsedData = JSON.parse(response.data);
            } catch(e) {
                parsedData = undefined;
            }
            const images = parsedData && parsedData.query && Array.isArray(parsedData.query.allimages) ? parsedData.query.allimages : [];

            return successDefault({images: images});
        }

        return promise;
    },
}