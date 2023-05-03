<template>
	<div class="list-group">
		<div class="list-group-item" aria-current="true" v-for="shortLink in shortLinks" :key="shortLink.hash">
			<short-link-item 
				:shortLink="shortLink" 
				@copy="$emit('copy', shortLink)" 
				@update="$emit('update', shortLink)" 
				@delete="$emit('delete', shortLink)"
			>
			</short-link-item>
		</div>
	</div>
</template>

<script>
import ShortLinkItem from "@/components/shortlink.components/ShortLinkItem.vue";

export default {
	name: 'ShortLinkList',
	components: {
		ShortLinkItem
	},
	props: {
		shortLinks: {
			type: Array,
      required: true
		}
	}
}
</script>
