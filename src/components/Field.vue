<template>
	<label class="Field">
		{{ name }}
		<span class="Field__alert">Alert</span>
		<div class="Field__container">
			<img class="Field__ico" src="../assets/icons/mail.svg" v-if="icon=='mail'" />
			<img class="Field__ico" src="../assets/icons/user.svg" v-else-if="icon=='user'" />
			<img class="Field__ico" src="../assets/icons/phone.svg" v-else-if="icon=='phone'" />
			<input
				class="Field__input"
				type="text"
				:placeholder="name"
				:value="modelValue"
				@input="handleInput"
			/>
		</div>
	</label>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
	name: "Field",
	props: {
		name: {
			type: String,
			default: "Field Name",
		},
		icon: {
			type: String,
			default: "mail",
		},
		modelValue: {
			type: String,
		},
	},
	setup(props,ctx) {
		function handleInput(e:any){
			ctx.emit('update:modelValue',e.target.value)
		}

		return {
			handleInput
		}
	},
})
</script>

<style lang="scss">
.Field {
	display: block;
	// margin: 1rem 0;
	border-bottom: 1px solid #000;
	font-weight: 600;

	&__container {
		display: flex;
	}

	&__alert {
		float: right;
		font-size: 0.9rem;
		font-weight: 500;
		color: red;
	}

	&__ico {
		display: block;
		width: 2rem;
		height: auto;
		margin-right: 0.5rem;
	}

	&__input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 1rem;
	}
}
</style>
