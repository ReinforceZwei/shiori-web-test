const API_URL = 'http://192.168.1.29:5001/api'

let accessToken = undefined

let storedToken = localStorage.getItem('ACCESS')
if (storedToken !== null){
    storedToken = JSON.parse(storedToken)
    if ((new Date(storedToken.not_after)) > Date.now()) {
        // Stored token still valid
        accessToken = storedToken.token
    }
}

function fetchJson(url, options = {}){
    return fetch(url, options).then(res => res.json())
}

function fetchApi(endpoint, options = {}, withAuthentication = true){
    options.headers = {}
    if (withAuthentication && accessToken != undefined){
        options.headers['authorization'] = 'bearer ' + accessToken
    }
    options.headers['content-type'] = 'application/json'
    return fetchJson(`${API_URL}${endpoint}`, options)
}



export default {
    isLoggedIn: () => (accessToken !== undefined && accessToken != ''),
    fetchTitle: (url) => {
        return fetchApi(`/title?url=${url}`)
    },
    fetchIcon: (url) => {
        return fetchApi(`/favicon?url=${url}`)
    },
    login(name, password) {
        return fetchApi('/user/login', {
            method: 'post',
            body: JSON.stringify({name, password})
        }, false)
        .then(data => {
            if (data.code == 200 && data.data){
                localStorage.setItem('ACCESS', JSON.stringify(data.data))
                accessToken = data.data.token
            }
            return data
        })
    },
    addCollection: (name) => {
        return fetchApi('/collection/create', {method: 'POST', body: JSON.stringify({name: name})})
    },
    getCollection: (id) => fetchApi(`/collection/${id}`),
    deleteCollection: id => fetchApi(`/collection/${id}`, {method: 'DELETE'}),
    listCollection: () => fetchApi('/collection/list'),
    getCollectionItems: (id) => fetchApi(`/collection/${id}/items`),
    addCollectionItem: (collectionId, bookmarkId) => {
        return fetchApi(`/collection/${collectionId}/add`, 
            {method: 'post', body: JSON.stringify({bookmark_id: bookmarkId})})
    },
    orderBookmarkAfter: (collectionId, bookmarkId, afterId) => {
        return fetchApi(`/collection/${collectionId}/order/${bookmarkId}/after/${afterId}`, {method: 'post'})
    },
    orderBookmarkBefore: (collectionId, bookmarkId, afterId) => {
        return fetchApi(`/collection/${collectionId}/order/${bookmarkId}/before/${afterId}`, {method: 'post'})
    },
    orderCollectionAfter: (collectionId, afterId) => {
        return fetchApi(`/collection/order/${collectionId}/after/${afterId}`, {method: 'post'})
    },
    orderCollectionBefore: (collectionId, afterId) => {
        return fetchApi(`/collection/order/${collectionId}/before/${afterId}`, {method: 'post'})
    },
    updateBookmark: (id, name, url, favicon, collectionId) => {
        let data = {}
        if (name !== undefined){
            data.name = name
        }
        if (url !== undefined){
            data.url = url
        }
        if (favicon !== undefined){
            data.favicon = favicon
        }
        if (collectionId !== undefined){
            data.collection_id = collectionId
        }
        console.log(data)
        if (Object.keys(data).length > 0){
            return fetchApi(`/bookmark/${id}`, {method: 'PATCH', body: JSON.stringify(data)})
        }else{
            return Promise.resolve()
        }
    },
    addBookmark: (name, url, favicon, collectionId) => {
        let data = {
            url: url,
            name: name,
        }
        if (favicon !== null){
            data.favicon = favicon
        }
        if (collectionId != 'none' && collectionId != null){
            data.collection_id = collectionId
        }
        return fetchApi('/bookmark/create', {method: 'POST', body: JSON.stringify(data)})
    },
    getBookmark: (id) => fetchApi(`/bookmark/${id}`),
    deleteBookmark: id => fetchApi(`/bookmark/${id}`, {method: 'DELETE'}),
}