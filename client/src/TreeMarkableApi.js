import axios from 'axios';
import { getToken } from './firebase/firebaseAuth';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

/**
 * TreeMarkable API class contains static methods to help interact with
 * the TreeMarkable database.
 */
class TreeMarkableApi {
	static async request(endpoint, paramsOrData = {}, verb = 'get') {
		try {
			paramsOrData._token = await getToken();

			console.debug('API Call:', endpoint, paramsOrData, verb);
			const res = await axios({
				method                               : verb,
				url                                  : `${BASE_URL}/${endpoint}`,
				[verb === 'get' ? 'params' : 'data']: paramsOrData
			});

			console.log('API res RETURN', res);
			return res.data;
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
				console.error('TreeMarkableAPI Error:', err);

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

	static async getTrees(searchParams) {
		console.log('TreeMarkableApi Class getTrees - Start');
		let res = await this.request(`trees`, searchParams);
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
		return res.updatedTree;
	}
	static async deleteTree(treeId) {
		console.log('TreeMarkableApi Class deleteTree - Start');
		let res = await this.request(`trees/${treeId}`, 'delete');
		return res.message;
	}
	/**
     * Comment Requests
     */

	static async getComments(type, id) {
		console.log('TreeMarkableApi Class getComments - Start');
		let res = await this.request(`comments/${type}/${id}`);
		return res.comments;
	}
	static async getComment(commentId) {
		console.log('TreeMarkableApi Class getComment - Start');
		let res = await this.request(`comments/${commentId}`);
		return res.comment;
	}
	static async createComment(data) {
		console.log('TreeMarkableApi Class createComment - Start', data);
		let res = await this.request(`comments`, data, 'post');
		return res.newComment;
	}
	static async updateComment(commentId, data) {
		console.log('TreeMarkableApi Class updateComment - Start');
		let res = await this.request(
			`comments/${commentId}`,
			data,
			'patch'
		);
		return res.updatedComment;
	}
	static async deleteComment(commentId) {
		console.log('TreeMarkableApi Class deleteComment - Start');
		let res = await this.request(
			`comments/${commentId}`,
			{},
			'delete'
		);
		return res.message;
	}

	/**
	 * User - Tree Relationship Requests
	 */
	static async userAddTree(username, treeId) {
		console.log('TreeMarkableApi Class userAddTree - Start');
		let res = await this.request(
			`users/${username}/trees/${treeId}`,
			{},
			'post'
		);
		return res.message;
	}
	static async userRemoveTree(username, treeId) {
		console.log('TreeMarkableApi Class userRemoveTree - Start');
		let res = await this.request(
			`users/${username}/trees/${treeId}`,
			{},
			'delete'
		);
		return res.message;
	}
}

export default TreeMarkableApi;
