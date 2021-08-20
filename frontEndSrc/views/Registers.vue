<template>
	<div class="registers-container">
		<ElCollapse>
			<ElCollapseItem>
				<template #title>
					<h2>Module Configuration <i class="header-icon el-icon-s-tools"></i></h2>
				</template>
				<div class="registers">
					<RegisterCard
						v-for="(reg, index) in commonConfigRegs"
						:key="reg.name"
						v-model:reg="commonConfigRegs[index]"
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
					/>
				</div>
			</ElCollapseItem>
		</ElCollapse>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import RegisterCard from '@/components/RegisterCard.vue';

export default {
	components: {
		RegisterCard,
	},

	computed: {
		...mapState({
			// registers: (state) => state.registers,
			commonConfigRegs: (state) => state.registers.filter((r) => r.startReg < 7),
			wirelessSensorConfigRegs: (state) => state.registers.filter((r) => r.startReg >= 7 && r.startReg < 57)
				.filter((r) => r.data.wirelessSensorEventAffectedGroup > 0),
			wirelessSensorStatusRegs: (state) => state.registers.filter((r) => r.startReg >= 57 && r.startReg < 107)
				.filter((r) => r.data.batLevel > 0 || r.data.link > 0),
			countersRegs: (state) => state.registers.filter((r) => r.startReg >= 107 && r.startReg < 123),
			counterConfigsRegs: (state) => state.registers.filter((r) => r.startReg >= 123),
		}),
	},

	watch: {
		counterConfigsRegs: {
			handler(val, oldVal = []) {
				if (oldVal.length > 0) {
					console.table(val.map((a) => a.data));
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
		.el-card__body {
			max-height: 500px;
    overflow-y: auto;
		}
	}
}
}
</style>
