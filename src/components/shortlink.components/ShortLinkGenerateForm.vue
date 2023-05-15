<template>
	<form @submit.prevent="$emit('create')" class="text-end">
		<div class="form-group text-start">
			<label for="urlEnterInput">URL адрес</label>
			<input 
				type="url" 
				class="form-control" 
				id="urlEnterInput" 
				placeholder="Введите url адрес" 
				:value="newUrl" 
				@input="newUrlInputHandler" 
				required
			>
			<small id="urlInputHelp" class="form-text text-muted">Введите URL адрес ссылки</small>
		</div>
		<button type="submit" class="btn btn-primary">Сгенерировать ссылку</button>
	</form>
</template>

<script>
export default {
	name: "ShortLinkGenerateForm",
	props: {
		newUrl: {
			type: String,
			required: true,
		}
	},
	methods: {
		newUrlInputHandler(event) {
			this.$emit('update:newUrl', event.target.value)
		}
	}
}
</script>