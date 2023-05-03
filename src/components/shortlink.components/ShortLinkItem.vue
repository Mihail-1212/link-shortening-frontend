<template>
	<div class="row">
		<div class="col">
			<div class="d-flex w-100 justify-content-between">
				<h5 class="mb-1">{{ shortLink.title }}</h5>
			</div>
			<p class="mb-1 text-start">{{ shortLink.url }}</p>
			<small class="d-flex text-start text-muted">{{ generateFullLink(shortLink.hash_str) }}</small>
		</div>
		<div class="control-wrapper col-auto d-flex align-items-center">
			<a href="#" class="btn border-0" @click="$emit('copy', shortLink)" data-bs-toggle="tooltip" title="Копировать короткий адрес ссылки">
				<font-awesome-icon class="fa-2x" :icon="['fas', 'copy']" />
			</a>

			<a :href="generateFullLink(shortLink.hash_str)" class="btn border-0" data-bs-toggle="tooltip" title="Перейти на страницу">
				<font-awesome-icon class="fa-2x" :icon="['fas', 'link']" />
			</a>

			<a href="#" class="btn border-0" @click="$emit('update', shortLink)" data-bs-toggle="tooltip" title="Редактировать запись">
				<font-awesome-icon class="fa-2x" :icon="['fas', 'pen-to-square']" />
			</a>

			<a href="#" class="btn border-0" @click="$emit('delete', shortLink)" data-bs-toggle="tooltip" title="Удалить короткую ссылку">
				<font-awesome-icon class="fa-2x" :icon="['fas', 'trash']" />
			</a>
		</div>
	</div>
</template>

<script>
import { generateFullUrlByHash } from "@/components/shortlink.components/utils";

export default {
  name: 'ShortLinkItem',
	props: {
		shortLink: {
			type: Object,
      required: true
		}
	},
	methods: {
		generateFullLink(hash) {
			return generateFullUrlByHash(hash);
		},
	},
}
</script>
