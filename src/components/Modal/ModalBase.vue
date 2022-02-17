<template>
	<teleport to="#modals">
		<div class="BModal">
			<div class="BModal__main">
				<div class="BModal__head">
					<span class="BModal__title">{{ title }}</span>
					<button class="BModal__close" @click="$emit('closeModal')">
						<img
							class="BModal__ico"
							src="../../assets/icons/close.svg"
							alt="close icon"
						/>
					</button>
				</div>
				<slot />
			</div>
		</div>
	</teleport>
</template>

<script setup lang="ts">
defineProps({
	title: {
		type: String,
		default: "Modal Title",
	},
})

defineEmits(["closeModal"])
</script>

<style lang="scss">
.BModal {
	position: fixed;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100vh;
	background: rgba($color: #000000, $alpha: 0.5);
	z-index: 10;

	&__main {
		width: 90%;
		max-height: 90vh;
		padding: 1rem;
		background: #fff;

		@media (min-width: 768px) {
			width: 70%;
		}

		@media (min-width: 1024px) {
			width: 50%;
		}
	}

	&__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #000;
	}

	&__title {
		font-size: 1.5rem;
	}

	&__close {
		background: none;
		border: none;
		cursor: pointer;
	}

	&__ico {
		display: block;
		width: 1.5rem;
		height: auto;
	}
}
</style>
