<template>
	<div class="registers">
		<RegisterCard
			v-for="(reg, index) in registers"
			:key="reg.name"
			v-model:reg="registers[index]"
		/>
	</div>
</template>
<script>
import RegisterCard from '@/components/RegisterCard.vue';

export default {
	components: {
		RegisterCard,
	},
	data() {
		return {
			someNumber: 22,
			reg1: {
				value1: 12,
				region1: 'z2',
				boolean1: true,
			},
			registers: [
				{
					name: 'R0057',
					startReg: 57,
					regLength: 1,
					description: 'Статус беспроводного датчика 1',
					fields: {
						alert: {
							type: 'boolean',
							description: 'Наличие тревоги ',
						},
						lowBat: {
							type: 'boolean',
							description: 'Наличие разряда ',
						},
						missed: {
							type: 'boolean',
							description: 'Потеря датчика',
						},
						link: {
							type: 'list',
							options: {
								0: 'нет связи',
								1: 'слабый',
								2: 'средний',
								3: 'хороший',
								4: 'отличный',
							},
							description: 'Уровень сигнала от датчика',
						},
						batLevel: {
							type: 'int',
							description: 'Уровень заряда батареи',
						},
					},
					data: {
						alert: false,
						lowBat: false,
						missed: false,
						link: 2,
						batLevel: 100,
					},
				},
				{
					name: 'R0000',
					startReg: 0,
					regLength: 1,
					description: 'Конфигурация и статус  модуля',
					fields: {
						floorWash: {
							type: 'boolean',
							description: 'Флаг состояния режима мойка пола',
							writable: true,
						},
						firstGroupAlert: {
							type: 'boolean',
							description: 'Флаг наличия тревоги по первой группе',
						},
						secondGroupAlert: {
							type: 'boolean',
							description: 'Флаг наличия тревоги по  второй группе',
						},
						wirelessSensorLowBat: {
							type: 'boolean',
							description: 'Флаг разряда батарей в беспроводных датчиках    ',
						},
						wirelessSensorLoss: {
							type: 'boolean',
							description: 'Флаг потери беспроводных датчиков',
						},
						firstGroupTapClosing: {
							type: 'boolean',
							description: 'Флаг закрытия кранов первой группе по потере датчиков',
						},
						secondGroupTapClosing: {
							type: 'boolean',
							description: 'Флаг закрытия кранов второй группе по потере датчиков',
						},
						wirelessSensorPairingMode: {
							type: 'boolean',
							description: 'Флаг запуска процедуры  подключения  беспроводных устройств',
							writable: true,
						},
						firstGroupTapState: {
							type: 'boolean',
							description: 'Состояние кранов первой группы',
							writable: true,
						},
						secondGroupTapState: {
							type: 'boolean',
							description: 'Состояние кранов второй группы',
							writable: true,
						},
						twoGroupsMode: {
							type: 'boolean',
							description: 'Включение группирования',
							writable: true,
						},
						tapsClosingOnSensorLoss: {
							type: 'boolean',
							description: 'Закрывания кранов при потере беспроводного датчика протечки',
							writable: true,
						},
						keyboardLock: {
							type: 'boolean',
							description: 'Блокировки клавиатуры',
							writable: true,
						},
					},
					data: {
						floorWash: false,
						firstGroupAlert: false,
						secondGroupAlert: false,
						wirelessSensorLowBat: false,
						wirelessSensorLoss: false,
						firstGroupTapClosing: false,
						secondGroupTapClosing: false,
						wirelessSensorPairingMode: false,
						firstGroupTapState: true,
						secondGroupTapState: true,
						twoGroupsMode: true,
						tapsClosingOnSensorLoss: true,
						keyboardLock: false,
					},
				},
			],
		};
	},
};
</script>
<style lang="scss">
.registers {
	display: flex;
	.registerCard {
		padding-right: 3px;
		padding-left: 3px;
	}
}
</style>
