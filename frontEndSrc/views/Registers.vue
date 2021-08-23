<template>
	<div class="registers-container">
		<ElCollapse>
			<ElCollapseItem>
				<template #title>
					<h2>Module Configuration <i class="header-icon el-icon-s-tools"></i></h2>
				</template>
				<div class="registers">
					<RegisterCard
						v-for="(reg, index) in moduleConfigRegisters"
						:key="reg.name"
						v-model:reg="moduleConfigRegisters[index]"
						:class="{'updated': reg.updated}"
					/>
				</div>
			</ElCollapseItem>
			<ElCollapseItem>
				<template #title>
					<h2>Wireless sensor configuration <i class="header-icon el-icon-s-tools"></i></h2>
				</template>
				<div class="registers">
					<RegisterCard
						v-for="(reg, index) in wirelessSensorConfigRegs"
						:key="reg.name"
						v-model:reg="wirelessSensorConfigRegs[index]"
						:class="{'updated': reg.updated}"
					/>
				</div>
			</ElCollapseItem>
			<ElCollapseItem>
				<template #title>
					<h2>Wireless sensor status <i class="header-icon el-icon-warning"></i></h2>
				</template>
				<div class="registers">
					<RegisterCard
						v-for="(reg, index) in wirelessSensorStatusRegs"
						:key="reg.name"
						v-model:reg="wirelessSensorStatusRegs[index]"
						:class="{'updated': reg.updated}"
					/>
				</div>
			</ElCollapseItem>
			<ElCollapseItem>
				<template #title>
					<h2>Water conter readings <i class="header-icon el-icon-s-data"></i></h2>
				</template>
				<div class="registers">
					<RegisterCard
						v-for="(reg, index) in countersRegs"
						:key="reg.name"
						v-model:reg="countersRegs[index]"
						:class="{'updated': reg.updated}"
					/>
				</div>
			</ElCollapseItem>
			<ElCollapseItem>
				<template #title>
					<h2>Water conter configuration <i class="header-icon el-icon-s-tools"></i></h2>
				</template>
				<div class="registers">
					<RegisterCard
						v-for="(reg, index) in counterConfigsRegs"
						:key="reg.name"
						v-model:reg="counterConfigsRegs[index]"
						:class="{'updated': reg.updated}"
					/>
				</div>
			</ElCollapseItem>
		</ElCollapse>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import {

	ElCollapse,
	ElCollapseItem,

} from 'element-plus';
import RegisterCard from '@/components/RegisterCard.vue';

export default {
	components: {
		RegisterCard,
		ElCollapse,
		ElCollapseItem,
	},

	computed: {
		...mapState({
			moduleConfigRegisters: (state) => state.moduleConfigRegisters,
			wirelessSensorConfigRegs: (state) => state.wirelessSensorConfigRegs,
			wirelessSensorStatusRegs: (state) => state.wirelessSensorStatusRegs,
			countersRegs: (state) => state.countersRegs,
			counterConfigsRegs: (state) => state.counterConfigsRegs,
		}),
	},

	watch: {
		moduleConfigRegisters: {
			handler(data, oldVal = []) {
				if (oldVal.length > 0) {
					this.$store.dispatch('updateRegisters', { field: 'moduleConfigRegisters', data });
				}
			},
			deep: true,
		},
		wirelessSensorConfigRegs: {
			handler(data, oldVal = []) {
				if (oldVal.length > 0) {
					this.$store.dispatch('updateRegisters', { field: 'wirelessSensorConfigRegs', data });
				}
			},
			deep: true,
		},
		wirelessSensorStatusRegs: {
			handler(data, oldVal = []) {
				if (oldVal.length > 0) {
					this.$store.dispatch('updateRegisters', { field: 'wirelessSensorStatusRegs', data });
				}
			},
			deep: true,
		},
		countersRegs: {
			handler(data, oldVal = []) {
				if (oldVal.length > 0) {
					this.$store.dispatch('updateRegisters', { field: 'countersRegs', data });
				}
			},
			deep: true,
		},
		counterConfigsRegs: {
			handler(data, oldVal = []) {
				if (oldVal.length > 0) {
					this.$store.dispatch('updateRegisters', { field: 'counterConfigsRegs', data });
				}
			},
			deep: true,
		},
	},

	mounted() {
		this.$store.dispatch('getRegisters');
	},
};
</script>
<style lang="scss">
.registers-container {
.registers {
	display: flex;
  flex-wrap: wrap;

	.registerCard {
		padding: 3px;
			&.updated {
				.el-card{
					box-shadow: rgb(253 0 0 / 30%) 0px 2px 12px 0px;
				}
			}

			.el-card__body {
				max-height: 500px;
				overflow-y: auto;
			}

	}
}
}
</style>
