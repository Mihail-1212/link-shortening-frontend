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

import {
  GET_SHORT_LINK_BY_HASH
} from "@/store/actions/short_links"

export default {
  name: 'RedirectShortLink',
  mounted() {
    const redirectToNotFound = () => {
      this.$router.push({
        name: "PathNotFound"
      })
    }

    let hash = this.$route.params.hash;

    this.$store.dispatch(GET_SHORT_LINK_BY_HASH, hash).then((data) => {
      console.log(data);
      // Redurect to url address
      window.location.replace(data.url);
    }).catch(error => {
      console.error(error) 
      // Redirect to 404 if error
      redirectToNotFound();
    });
  },
}
</script>