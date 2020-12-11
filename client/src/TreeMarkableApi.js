import axios from 'axios';
import { getToken } from './firebase/firebaseAuth';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

/**
 * TreeMarkable API class contains static methods to help interact with the TreeMarkable
 * database.
 */
class TreeMarkableApi {
	static async request(endpoint, paramsOrData = {}, verb = 'get') {
		paramsOrData._token = getToken();

		console.debug('API Call:', endpoint, paramsOrData, verb);

		try {
			return (await axios({
				method                               : verb,
				url                                  : `${BASE_URL}/${endpoint}`,
				[verb === 'get' ? 'params' : 'data']: paramsOrData
			})).data;
			// axios sends query string data via the "params" key,
			// and request body data via the "data" key,
			// so the key we need depends on the HTTP verb
		} catch (err) {
			console.error('API Error:', err.response);
			let message = err.response.data.message;
			throw Array.isArray(message) ? message : [ message ];
		}
	}

	/**
     * Authentication Requests
     */

	static async login(data) {
		console.log('TreeMarkableApi Class Login - Start');
		let res = await this.request(`login`, data, 'post');
		return res.token;
	}

	/**
     * User Requests
     */

	static async getUser(username) {
		console.log('TreeMarkableApi Class getUser - Start');
		let res = await this.request(`users/${username}`);
		return res.user;
	}
	static async registerUser(data) {
		console.log('TreeMarkableApi Class registerUser - Start');
		let res = await this.request(`users`, data, 'post');
		return res.token;
	}
	static async updateUser(username, data) {
		console.log('TreeMarkableApi Class updateUser - Start');
		let res = await this.request(`users/${username}`, data, 'patch');
		return res.user;
	}
}

export default TreeMarkableApi;
