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
		onSubmit() {
			console.log('submit!');
		},

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
									default: () => {
										const renderedFields = this.renderFields();
										return renderedFields;

										/* [
										this.renderFormItem('Activity name',
											h(
												resolveComponent('ElInputNumber'),
												{
													modelValue: this.form.value,
													'onUpdate:modelValue': (value) => {
														console.log(value);
														this.$emit('update:modelValue', value);
													},
												},
											)),
										this.renderFormItem('Some Number',
											h(
												resolveComponent('ElInputNumber'),
												{
													modelValue: this.data.value1,
													'onUpdate:modelValue': (value1) => {
														this.$emit('update:data', Object.assign(data, { value1 }));
													},
												},
											)),
										this.renderFormItem(
											'Activity zone',
											this.renderSelect({
												placeholder: 'please select your zone',
												modelValue: this.data.region1,
												onUpdate: (region1) => {
													this.$emit('update:data', Object.assign(data, { region1 }));
												},
												options: [{ label: 'Zone 1', value: 'z1' }, { label: 'Zone 2', value: 'z2' }],
											}),
										),
										this.renderFormItem(
											'Test boolean',
											this.renderSwitch({
												modelValue: this.data.boolean1,
												onUpdate: (boolean1) => {
													this.$emit('update:data', Object.assign(data, { boolean1 }));
												},
											}),
										),
									] */
									},
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
