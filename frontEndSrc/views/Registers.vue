<template>
	<div class="registers-container">
		<ElContainer
			direction="vertical"
			style="height:100%;"
		>
			<ElHeader>
				<ElMenu
					:default-active="selectedMenu"
					@select="(v)=> selectedMenu = v"
					class="main-menu"
					mode="horizontal"
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#ffd04b"
				>
					<ElMenuItem index="moduleConfigRegisters">
						<i class="header-icon el-icon-s-tools"></i> Module Configuration
					</ElMenuItem>
					<ElMenuItem index="wirelessSensorConfigRegs">
						<i class="header-icon el-icon-s-tools"></i> Wireless sensor configuration
					</ElMenuItem>
					<ElMenuItem index="wirelessSensorStatusRegs">
						<i class="header-icon el-icon-warning"></i> Wireless sensor status
					</ElMenuItem>
					<ElMenuItem index="countersRegs">
						<i class="header-icon el-icon-s-data"></i> Water conter readings
					</ElMenuItem>
					<ElMenuItem index="counterConfigsRegs">
						<i class="header-icon el-icon-s-tools"></i> Water conter configuration
					</ElMenuItem>
				</ElMenu>
			</ElHeader>

			<ElContainer style="height:100%;">
				<ElMain style="height:100%;">
					<ElAlert
						title="Error!"
						type="error"
						:description="error"
						show-icon
						:closable="false"
						v-show="error"
					/>
					<div class="registers">
						<RegisterCard
							v-for="(reg, index) in getSelectedRegistersArray()"
							:key="reg.name"
							v-model:reg="getSelectedRegistersArray()[index]"
							:class="{'updated': reg.updated}"
						/>
					</div>
					<div class="fab">
						<ElTooltip content="Save">
							<ElButton
								type="danger"
								class="save-button"
								icon="el-icon-edit-outline"
								:disabled="!hasChangedRegisters"
								@click="$store.dispatch('saveRegisters')"
								circle
							/>
						</ElTooltip>
					</div>
				</ElMain>
			</ElContainer>
		</ElContainer>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import {

	ElContainer,

	ElMenu,

	ElButton,
	ElTooltip,
	ElLoading,
	ElAlert,

} from 'element-plus';
import RegisterCard from '@/components/RegisterCard.vue';

const ElHeader = ElContainer.Header;
const ElMain = ElContainer.Main;

const ElMenuItem = ElMenu.MenuItem;

export default {
	components: {
		RegisterCard,
		ElContainer,

		ElMenu,
		ElMenuItem,

		ElHeader,
		ElMain,

		ElButton,
		ElTooltip,
		ElAlert,
	},

	data: () => ({
		selectedMenu: 'moduleConfigRegisters',
	}),

	computed: {
		...mapState({
			moduleConfigRegisters: (state) => state.moduleConfigRegisters,
			wirelessSensorConfigRegs: (state) => state.wirelessSensorConfigRegs,
			wirelessSensorStatusRegs: (state) => state.wirelessSensorStatusRegs,
			countersRegs: (state) => state.countersRegs,
			counterConfigsRegs: (state) => state.counterConfigsRegs,
			dataLoading: (state) => state.dataLoading,
			error: (state) => state.error,

		}),
		hasChangedRegisters() {
			return this.$store.getters.hasChangedRegisters;
		},
	},

	watch: {
		dataLoading(newVal, oldVal) {
			if (newVal === true) {
				this.loadingMaskInstance = ElLoading.service({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)',
				});
			} else {
				this.loadingMaskInstance.close();
			}
		},
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

	methods: {
		getSelectedRegistersArray() {
			return this[this.selectedMenu];
		},
	},
	mounted() {
		this.$store.dispatch('getRegisters');
	},
};
</script>
<style lang="scss">
.registers-container {
	height:100vh;
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

  .el-header{
		padding: 0;
		background-color: #545c64;
  }

  .el-main {
    background-color: #E9EEF3;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
	.fab {
		position: fixed;
		right: 30px;
		bottom: 30px;
		button {
			-webkit-box-shadow: 4px 4px 16px -2px rgba(34, 60, 80, 0.91);
			-moz-box-shadow: 4px 4px 16px -2px rgba(34, 60, 80, 0.91);
			box-shadow: 4px 4px 16px -2px rgba(34, 60, 80, 0.91);
		}
	}
}
</style>
