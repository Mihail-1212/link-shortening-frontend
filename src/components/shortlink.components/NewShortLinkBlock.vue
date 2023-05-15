<template>
	<div class="row" v-if="newShortLink">
    <div class="col">

      <div class="card text-start text-dark bg-light">
        <div class="card-header position-relative">
          Ссылка создана

          <a href="#" class="btn border-0 position-absolute end-0 close translate-middle-y h-100" aria-label="close" @click="$emit('close')" >
            &times;
          </a>

        </div>
        <div class="card-body">
          <h5 class="card-title">Ссылка успешно создана и доступна по адресу: {{ fullLink }}</h5>

          <a href="#" class="btn btn-secondary" @click="$emit('copy', newShortLink)">
            Скопируйте ссылку!
          </a>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { generateFullUrlByHash } from "@/components/shortlink.components/utils";

export default {
  name: 'NewShortLinkBlock',
  props: {
    newShortLink: {
      type: Object,
      required: false,
    }
  },
  computed: {
		fullLink() {
			return generateFullUrlByHash(this.newShortLink.hash_str);
		},
	},
}
</script>

<style lang="scss">
.btn.close {
  font-size: 28pt;
}
</style>