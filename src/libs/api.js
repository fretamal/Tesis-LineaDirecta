
/**
 *  Simple Api for get/post/put/delete actions.
 *
 *  Change host='' with url and can you as
 *
 *  "Api.get('/getValues')
 *
 *  or
 *
 *  let params = {}
 *  params.name = 'Some name'
 *
 *  Api.post('/set-name',params)
 */
import GLOBAL from './global'

class Api {

    static headers(token) {
        return {'Accept': 'application/json', 'Content-Type': 'application/json', 'dataType': 'json', 'X-Requested-With': 'XMLHttpRequest','Authorization':'Bearer '+token}
    }

    static headers_form_data(token) {
        return {'Accept': 'application/json', 'Content-Type': 'multipart/form-data', 'dataType': 'json', 'X-Requested-With': 'XMLHttpRequest','Authorization':'Bearer '+token}
    }

    static get(route, token = "") {
        return this.xhr(route, null, 'GET', token)
    }

    static put(route, params, token = "") {
        return this.xhr(route, params, 'PUT', token)
    }

    static post(route, params, token = "", formdata = "") {
        return formdata=='YES' ? this.xhr_file(route, params, 'POST', token) : this.xhr(route, params, 'POST', token)
    }

    static delete(route, params, token = "") {
        return this.xhr(route, params, 'DELETE', token)
    }

    static xhr(route, params, verb, token) {
        const host = GLOBAL.HOST.NAME
        const url = `${host}${route}`
        let options = Object.assign({ method: verb }, params? { body: JSON.stringify(params) } : null)
        options.headers = Api.headers(token)
        return fetch(url, options).then(resp => {
            
            let json = resp.json()
            if (resp.data) {
                return json
            }
            return json.then(err => {
                return err
            })

            //return resp
            
        }).catch( error => {
            console.log(error);
        } )
    }

    static xhr_file(route, params, verb, token) {
        const host = GLOBAL.HOST.NAME
        const url = `${host}${route}`
        let options = Object.assign({ method: verb }, params? { body: params } : null)
        options.headers =  Api.headers_form_data(token)
        return fetch(url, options).then(resp => {
            console.log(resp.data);
            let json = resp.json()
            if (resp.data) {
                return json
            }
            return json.then(err => {
                return err
            })
        })
    }
}

export default Api;