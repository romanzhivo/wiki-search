import requestService from './index';
import appConfig from '../app-config';

const API_URL = appConfig.API_URL;

class Methods {
    constructor() {
        const self = this;
        let methods = getMethodObjects();

        methods.forEach((el)=>{
            self[el.name] = function (params) {
                let url = `${API_URL}${el.url}`
                let stringParams = url + createParamsString(params);

                return createRequest(stringParams);
            }
        })
    }
}

// Private

function getMethodObjects() {
    let methods = [
        {
            name: 'getArticleListRandom',
            url: '/article/list/random'
        },
        {
            name: 'articleSearch',
            url: '/article/list/search'
        },
        {
            name: 'getImageList',
            url: '/image/list'
        }
    ];

    return methods;
}

function createRequest(URL) {
    let promise = new Promise(function (resolve, reject) {
        requestService.getData(URL).then(
            (success) => {
                resolve(success);
            },
            (error) => {
                reject(error);
            }
        );
    });

    return promise;
}

function createParamsString(obj) {
    let str = "";
    for (var key in obj) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(obj[key]);
    }

    return '?' + str;
}

// Private : END

export default new Methods();