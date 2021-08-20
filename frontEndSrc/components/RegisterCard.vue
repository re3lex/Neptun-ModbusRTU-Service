<script>
import { h, resolveComponent } from 'vue';

export default {
	props: {
		reg: {
			type: Object,
			default: () => {},
		},

	},
	emits: ['update:reg'],

	data() {
		return {
			form: {
				value: 123,
				region: '',
			},
		};
	},
	methods: {
		renderFormItem({ label, content = [] }) {
			return h(
				resolveComponent('ElFormItem'),
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
				resolveComponent('ElSelect'),
				{
					modelValue,
					'onUpdate:modelValue': onUpdate,
					...attrs,
				},
				{
					default: () => options.map(({ value, label }) => h(resolveComponent('ElOption'), { label, value })),
				},
			);
		},

		renderSwitch({ modelValue, onUpdate, attrs = {} }) {
			return h(
				resolveComponent('ElSwitch'),
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
					type, description, options: rawOptions = {}, writable,
				} = fields[fName];

				const onUpdate = (val) => {
					reg.data[fName] = val;
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
						resolveComponent('ElInputNumber'),
						{
							modelValue,
							'onUpdate:modelValue': onUpdate,
							disabled: writable !== true,
						},
					);
				} else if (type === 'list') {
					const options = Object.keys(rawOptions).map((oName) => ({ value: oName, label: rawOptions[oName] }));
					content = this.renderSelect({
						modelValue: `${modelValue}`,
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
					resolveComponent('ElCard'),
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
								resolveComponent('ElForm'),
								{
									ref: 'form',
									'label-width': '200px',
									modelValue: this.form,
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
