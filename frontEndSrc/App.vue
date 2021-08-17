<template>
	<div>
		<div id="nav">
			<router-link to="/">
				Home
			</router-link> |
			<router-link to="/about">
				About
			</router-link> |
			<router-link to="/registers">
				Registers
			</router-link>
		</div>
		<router-view />
	</div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  //text-align: center;

}

#nav {
  padding: 30px;
text-align: center;
	a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
