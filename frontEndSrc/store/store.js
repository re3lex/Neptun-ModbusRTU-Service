import { createStore } from 'vuex';
import utils from './utils';

const mutations = {

	setRegistersAfterUpdate(state, data) {
		const regsMap = data.reduce((acc, r) => {
			acc[r.startReg] = r;
			return acc;
		}, { });

		const applyChanges = (dataArr, resultRegs) => {
			dataArr.forEach((r) => {
				const res = resultRegs[r.startReg];
				if (res) {
					if (res.error) {
						r.error = res.error;
					} else {
						delete r.error;
						r.updated = false;
						r.data = { ...res.data };
						r.initialData = { ...r.data };
					}
				}
			});
		};

		applyChanges(state.moduleConfigRegisters, regsMap);
		applyChanges(state.wirelessSensorConfigRegs, regsMap);
		applyChanges(state.wirelessSensorStatusRegs, regsMap);
		applyChanges(state.countersRegs, regsMap);
		applyChanges(state.counterConfigsRegs, regsMap);

		const errors = data.filter((r) => r.error).map((r) => `[${r.startReg}]: ${r.error}`).join('<BR>');
		this.commit('setError', errors.length > 0 ? errors : null);
	},

	setRegisters: (state, data) => {
		data.forEach((r) => {
			r.initialData = { ...r.data };
		});

		state.moduleConfigRegisters = data.filter((r) => r.startReg < 7);

		state.wirelessSensorConfigRegs = data.filter((r) => r.startReg >= 7 && r.startReg < 57)
			.filter((r) => r.data.wirelessSensorEventAffectedGroup > 0);

		state.wirelessSensorStatusRegs = data.filter((r) => r.startReg >= 57 && r.startReg < 107)
			.filter((r) => r.data.batLevel > 0 || r.data.link > 0);

		state.countersRegs = data.filter((r) => r.startReg >= 107 && r.startReg < 123);
		state.countersRegs.forEach((r) => {
			Object.assign(r.fields.value, {
				precision: 3,
			});
		});

		state.counterConfigsRegs = data.filter((r) => r.startReg >= 123);
	},

	updateRegisters: (state, { field, data }) => {
		state[field] = data;
	},

	setError: (state, error) => {
		state.error = error;
	},
	setDataLoading: (state, isLoading) => {
		state.dataLoading = isLoading;
	},

};

const actions = {
	getRegisters: ({ commit }) => {
		commit('setDataLoading', true);
		fetch(`${utils.getAPIHost()}/api/readAll`)
			.then((response) => response.json())
			.then(({ data }) => commit('setRegisters', data))
			.catch((e) => {
				// eslint-disable-next-line no-console
				console.error('Unable to get the data', e);
				commit('setError', e.message);
			})
			.then(() => commit('setDataLoading', false));
	},

	updateRegisters: ({ commit }, { field, data }) => {
		data.forEach((r) => {
			r.updated = !utils.deepEqual({ ...r.initialData }, { ...r.data });
		});

		commit('updateRegisters', { field, data });
	},

	saveRegisters: async ({ commit, getters }) => {
		const { changedRegisters } = getters;
		if (!changedRegisters.length === 0) {
			commit('setError', 'Cannot perform save: there are no changed registers.');
			return false;
		}
		commit('setDataLoading', true);
		return fetch(`${utils.getAPIHost()}/api/write`, {
			method: 'POST',

			mode: 'cors',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
			},
			referrerPolicy: 'no-referrer',
			body: JSON.stringify(changedRegisters),
		})
			.then((response) => response.json())
			.then(({ data }) => commit('setRegistersAfterUpdate', data))
			.catch((e) => {
				// eslint-disable-next-line no-console
				console.error('Unable to write the data', e);
				commit('setError', e.message);
			})
			.then(() => commit('setDataLoading', false));
	},
};

const getters = {
	changedRegisters: (state) => {
		const changed1 = state.moduleConfigRegisters.filter((r) => r.updated === true);
		const changed2 = state.wirelessSensorConfigRegs.filter((r) => r.updated === true);
		const changed3 = state.wirelessSensorStatusRegs.filter((r) => r.updated === true);
		const changed4 = state.countersRegs.filter((r) => r.updated === true);
		const changed5 = state.counterConfigsRegs.filter((r) => r.updated === true);
		return [
			...changed1,
			...changed2,
			...changed3,
			...changed4,
			...changed5,
		];
	},
	hasChangedRegisters: (state, gets) => gets.changedRegisters.length > 0,
};

const state = () => ({
	moduleConfigRegisters: [],
	wirelessSensorConfigRegs: [],
	wirelessSensorStatusRegs: [],
	countersRegs: [],
	counterConfigsRegs: [],
	error: null,
	dataLoading: false,

});

export default createStore({
	state,
	mutations,
	actions,
	getters,
});
