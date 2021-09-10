<script>
import { h } from 'vue';

import {
	ElCard,
	ElForm,
	ElSelect,
	ElInputNumber,
	ElSwitch,
} from 'element-plus';

const ElFormItem = ElForm.FormItem;
const ElOption = ElSelect.Option;

export default {
	props: {
		reg: {
			type: Object,
			default: () => {},
		},

	},
	emits: ['update:reg'],

	components: {
		ElCard,
		ElForm,
		ElFormItem,
		ElSelect,
		ElOption,
		ElInputNumber,
		ElSwitch,
	},

	methods: {
		renderFormItem({ label, content = [] }) {
			return h(
				ElFormItem,
				{ label },
				{
					default: () => (Array.isArray(content) ? content : [content]),
				},
			);
		},

		renderSelect({
			modelValue, onUpdate, options = [], attrs = {},
		}) {
			return h(
				ElSelect,
				{
					modelValue,
					'onUpdate:modelValue': onUpdate,
					...attrs,
				},
				{
					default: () => options.map(({ value, label }) => h(ElOption, { label, value })),
				},
			);
		},

		renderSwitch({ modelValue, onUpdate, attrs = {} }) {
			return h(
				ElSwitch,
				{
					modelValue,
					'onUpdate:modelValue': onUpdate,
					...attrs,
				},
			);
		},

		renderFields() {
			const { reg } = this;
			const { data, fields } = reg;

			const res = [];

			Object.keys(fields).forEach((fName) => {
				const {
					type, description, options: rawOptions = {}, writable, min = 0, max = Infinity, precision,
				} = fields[fName];

				const onUpdate = (val) => {
					reg.data[fName] = !precision ? val : val * 10 ** precision;
					this.$emit('update:reg', reg);
				};
				const modelValue = data[fName];
				let content;
				if (type === 'boolean') {
					content = this.renderSwitch({
						modelValue,
						onUpdate,
						attrs: { disabled: writable !== true },
					});
				} else if (type === 'int') {
					content = h(
						ElInputNumber,
						{
							modelValue: !precision ? modelValue : modelValue / 10 ** precision,
							'onUpdate:modelValue': onUpdate,
							disabled: writable !== true,
							controlsPosition: 'right',
							min,
							max,
							precision,
						},
					);
				} else if (type === 'list') {
					const options = Object.keys(rawOptions).map((oName) => {
						let value = oName;
						if (/^\d+$/.test(value)) {
							value = parseInt(value);
						}
						return { value, label: rawOptions[oName] };
					});
					content = this.renderSelect({
						modelValue,
						onUpdate,
						options,
						attrs: { disabled: writable !== true },
					});
				}

				res.push(
					this.renderFormItem({
						label: description,
						content,
					}),
				);
			});

			return res;
		},
	},

	render() {
		const { reg } = this;
		const { description, name } = reg;
		const res = h(
			'div',
			{
				class: 'registerCard',
			},
			[
				h(
					ElCard,
					{ class: 'box-card' },
					{
						// render card header
						header: (props) => h(
							'div', { class: 'card-header' },
							[
								h(
									'span', `${description} (${name})`,
								),
							],
						),

						// render card content
						default: (props) => {
							const content = h(
								ElForm,
								{
									ref: 'form',
									'label-width': '200px',

									// modelValue: this.form,
								},
								{
									default: () => this.renderFields(),
								},
							);
							return content;
						},
					},
				),
			],
		);
		return res;
	},
};
</script>
