<template>
  <div class="container">
    <div class="row">
      <h2>Загрузка полного URL адреса</h2>

      <div class="col">
        <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status"></div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
// Vuex
import { mapActions, mapGetters } from "vuex";

export default {
  name: 'RedirectShortLink',
  async mounted() {
    let hash = this.$route.params.hash;

    try {
      await this.getShortLinkByHash(hash)
    } catch {
      // Redirect to 404
      this.redirectToNotFound();
    }
  },

  computed: mapGetters(['getReceivedShortLink']),
  methods: {
    ...mapActions(['getShortLinkByHash']),

    redirectToNotFound() {
      this.$router.push({ name: "PathNotFound"})
    },
  },

  watch: {
    getReceivedShortLink(newShortLink) {
      if (newShortLink === null) {
        // If received short link is null => redirect to not found
        this.redirectToNotFound;
      }

      // Redirect to url address
      window.location.replace(newShortLink.url);
    }
  }
}
</script>