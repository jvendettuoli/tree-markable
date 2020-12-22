import axios from 'axios';
import { getToken } from './firebase/firebaseAuth';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

/**
 * TreeMarkable API class contains static methods to help interact with the TreeMarkable
 * database.
 */
class TreeMarkableApi {
	static async request(endpoint, paramsOrData = {}, verb = 'get') {
		paramsOrData._token = await getToken();

		console.log('paramsOrData', paramsOrData);

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
			if (err.response) {
				console.error('API Error:', err.response);
				let message = err.response.data.message;
				throw Array.isArray(message) ? message : [ message ];
			}
			else {
				console.error(err);
				return err;
			}
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
		return res.newUser;
	}
	static async updateUser(username, data) {
		console.log('TreeMarkableApi Class updateUser - Start');
		let res = await this.request(`users/${username}`, data, 'patch');
		return res.user;
	}
	static async deleteUser(username) {
		console.log('TreeMarkableApi Class deleteUser - Start');
		let res = await this.request(`users/${username}`, 'delete');
		return res.message;
	}

	/**
     * Group Requests
     */

	static async getGroup(groupId) {
		console.log('TreeMarkableApi Class getGroup - Start');
		let res = await this.request(`groups/${groupId}`);
		return res.group;
	}
	static async createGroup(data) {
		console.log('TreeMarkableApi Class createGroup - Start');
		let res = await this.request(`groups`, data, 'post');
		return res.newGroup;
	}
	static async updateGroup(groupId, data) {
		console.log('TreeMarkableApi Class updateGroup - Start');
		let res = await this.request(`groups/${groupId}`, data, 'patch');
		return res.group;
	}
	static async deleteGroup(groupId) {
		console.log('TreeMarkableApi Class deleteGroup - Start');
		let res = await this.request(`users/${groupId}`, 'delete');
		return res.message;
	}

	/**
     * Tree Requests
     */

	static async getAllTrees() {
		console.log('TreeMarkableApi Class getTree - Start');
		let res = await this.request(`trees`);
		return res.trees;
	}
	static async getTree(treeId) {
		console.log('TreeMarkableApi Class getTree - Start');
		let res = await this.request(`trees/${treeId}`);
		return res.tree;
	}
	static async createTree(data) {
		console.log('TreeMarkableApi Class createTree - Start');
		let res = await this.request(`trees`, data, 'post');
		return res.newTree;
	}
	static async updateTree(treeId, data) {
		console.log('TreeMarkableApi Class updateTree - Start');
		let res = await this.request(`trees/${treeId}`, data, 'patch');
		return res.tree;
	}
	static async deleteTree(treeId) {
		console.log('TreeMarkableApi Class deleteTree - Start');
		let res = await this.request(`users/${treeId}`, 'delete');
		return res.message;
	}
}

export default TreeMarkableApi;
