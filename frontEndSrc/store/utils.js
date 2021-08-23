export default {
	isObject(object) {
		return object != null && typeof object === 'object';
	},

	deepEqual(object1, object2) {
		const keys1 = Object.keys(object1);
		const keys2 = Object.keys(object2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (let i = 0; i < keys1.length; i++) {
			const key = keys1[i];

			const val1 = object1[key];
			const val2 = object2[key];
			const areObjects = this.isObject(val1) && this.isObject(val2);
			if (
				(areObjects && !this.deepEqual(val1, val2))
				|| (!areObjects && val1 !== val2)
			) {
				return false;
			}
		}

		return true;
	},

};
