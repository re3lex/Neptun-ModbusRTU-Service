import { createStore } from 'vuex';

const mutations = {

	setRegisters: (state, data) => {
		state.registers = data;
	},
};

const actions = {
	getRegisters: ({ commit }) => {
		fetch('/api/readAll')
			.then((response) => response.json())
			.then(({ data }) => commit('setRegisters', data))
			.catch((e) => {
				console.error('Unable to get the data', e);
			});
	},
};

const state = () => ({
	registers: [],
});

export default createStore({
	state,
	mutations,
	actions,

});
