<template>
	<div class="home">
		<img
			alt="Vue logo"
			src="../assets/logo.png"
		/>
		<HelloWorld msg="Welcome to Your Vue.js App11" />
	</div>
</template>

<script>

// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
	name: 'Home',
	components: {
		HelloWorld,
	},
};
</script>
<style lang="scss">
.home {
	text-align: center;
}
</style>
