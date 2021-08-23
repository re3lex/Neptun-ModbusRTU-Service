import { createStore } from 'vuex';
import utils from './utils';

const mutations = {

	setRegisters: (state, data) => {
		data.forEach((r) => {
			r.initialData = { ...r.data };
			if (r.startReg >= 107 && r.startReg <= 121) {
				Object.assign(r.fields.value, {
					precision: 3,
				});
			}
		});

		state.moduleConfigRegisters = data.filter((r) => r.startReg < 7);
		state.wirelessSensorConfigRegs = data.filter((r) => r.startReg >= 7 && r.startReg < 57)
			.filter((r) => r.data.wirelessSensorEventAffectedGroup > 0);
		state.wirelessSensorStatusRegs = data.filter((r) => r.startReg >= 57 && r.startReg < 107)
			.filter((r) => r.data.batLevel > 0 || r.data.link > 0);
		state.countersRegs = data.filter((r) => r.startReg >= 107 && r.startReg < 123);
		state.counterConfigsRegs = data.filter((r) => r.startReg >= 123);
	},

	updateRegisters: (state, { field, data }) => {
		state[field] = data;
	},
};

const actions = {
	getRegisters: ({ commit }) => {
		const host = window.ENV === 'development' ? 'http://localhost:3000' : '';
		fetch(`${host}/api/readAll`)
			.then((response) => response.json())
			.then(({ data }) => commit('setRegisters', data))
			.catch((e) => {
				// eslint-disable-next-line no-console
				console.error('Unable to get the data', e);
			});
	},

	updateRegisters: ({ commit }, { field, data }) => {
		data.forEach((r) => {
			r.updated = !utils.deepEqual({ ...r.initialData }, { ...r.data });
		});

		commit('updateRegisters', { field, data });
	},
};

const state = () => ({
	moduleConfigRegisters: [],
	wirelessSensorConfigRegs: [],
	wirelessSensorStatusRegs: [],
	countersRegs: [],
	counterConfigsRegs: [],
});

export default createStore({
	state,
	mutations,
	actions,

});
