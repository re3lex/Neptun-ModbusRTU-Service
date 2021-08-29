<template>
	<div>
		<!--
		<div id="nav">
					<router-link to="/">
				Home
			</router-link> |
			<router-link to="/about">
				About
			</router-link> |
			<router-link to="/registers">
				Registers
			</router-link> |
		</div>
	</div>
	-->
		<router-view />
	</div>
</template>

<style lang="scss">
#app {
  font-family: Helvetica, Arial, sans-serif;

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
