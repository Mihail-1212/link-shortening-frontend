<template>
  <div class="row">
    <h2>
      Сервис сокращения ссылок
    </h2>
  </div>

  <div class="row">
    <div class="col">
      <form @submit.prevent="generateShortLink" class="text-end">
        <div class="form-group text-start">
          <label for="urlEnterInput">URL адрес</label>
          <input type="url" class="form-control" id="urlEnterInput"  placeholder="Введите url адрес" v-model="newUrl" required>
          <small id="urlInputHelp" class="form-text text-muted">Ввыдите URL адрес ссылки</small>
        </div>
        <button type="submit" class="btn btn-primary">Сгенерировать ссылку</button>
      </form>
    </div>
  </div>

  <div class="row mt-5" v-if="newShortLink">

    <div class="col">

      <div class="card text-start text-dark bg-light">
        <div class="card-header position-relative">
          Ссылка создана

          <a href="#" class="btn border-0 position-absolute end-0 close translate-middle-y h-100" aria-label="close" @click="clearNewShortLink" >
            &times;
          </a>

        </div>
        <div class="card-body">
          <h5 class="card-title">Ссылка успешно создана и доступна по адресу: {{ generateFullLink(newShortLink.hash_str) }}</h5>

          <a href="#" class="btn btn-secondary" @click="generateAndCopyShortLink(newShortLink)">
            Скопируйте ссылку!
          </a>

        </div>
      </div>

    </div>
  </div>

  <div class="row m-3">
    <h4 class="text-start">
      Список ссылок
    </h4>
  </div>
  
  <div class="row">
    <div class="col">
        <div class="list-group">
          <div class="list-group-item" aria-current="true" v-for="shortLink in shortLinks" :key="shortLink.hash">
            <div class="row">
              <div class="col">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">{{ shortLink.title }}</h5>
                </div>
                <p class="mb-1 text-start">{{ shortLink.url }}</p>
                <small class="d-flex text-start text-muted">{{ generateFullLink(shortLink.hash_str) }}</small>
              </div>
              <div class="control-wrapper col-auto d-flex align-items-center">
                <a href="#" class="btn border-0" @click="generateAndCopyShortLink(shortLink)" data-bs-toggle="tooltip" title="Копировать короткий адрес ссылки">
                  <font-awesome-icon class="fa-2x" :icon="['fas', 'copy']" />
                </a>

                <a :href="generateFullLink(shortLink.hash_str)" class="btn border-0" data-bs-toggle="tooltip" title="Перейти на страницу">
                  <font-awesome-icon class="fa-2x" :icon="['fas', 'link']" />
                </a>

                <a href="#" class="btn border-0" @click="showUpdateRecordPopup(shortLink)" data-bs-toggle="tooltip" title="Редактировать запись">
                  <font-awesome-icon class="fa-2x" :icon="['fas', 'pen-to-square']" />
                </a>

                <a href="#" class="btn border-0" @click="showDeleteRecordPopup(shortLink)" data-bs-toggle="tooltip" title="Удалить короткую ссылку">
                  <font-awesome-icon class="fa-2x" :icon="['fas', 'trash']" />
                </a>
              </div>
            </div>
          </div>
        </div>
    </div>

  </div>

</template>

<script>

import {
  GET_ALL_SHORT_LINKS,
  DELETE_SHORT_LINK,
  CHANGE_SHORT_LINK_INFO,
  GENERATE_SHORT_LINK_FROM_URL
} from "@/store/actions/short_links"
import { DismissReason } from "sweetalert2"
import copy from 'copy-to-clipboard';



export default {
  name: 'MainComponent',
  data() {
    return {
      shortLinks: [],
      newShortLink: null,
      newUrl: "",
    }
  },
  components: {
  },
  mounted() {
    this.updateAllRowsList();
  },
  methods: {
    updateAllRowsList() {
      this.$store.dispatch(GET_ALL_SHORT_LINKS).then((shortLinkList) => {
        this.shortLinks=shortLinkList || []
      }).catch(error => console.error(error));
    },

    clearNewShortLink() {
      this.newShortLink = null;
    },

    generateShortLink(){
      // this.newUrl
      function isValidAUrl(urlStr) {
        let url;
        try {
          url = new URL(urlStr);
        } catch (_) {
          return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
      }

      if (!isValidAUrl(this.newUrl)) {
        this.$swal({
          icon: 'error',
          title: `Вы ввели не URL адрес!`,
          showConfirmButton: false,
          timer: 1500
        });
      }

      let newTitle = "Заголовок короткой ссылки";
      const newData = {title: newTitle, url: this.newUrl};

      this.$store.dispatch(GENERATE_SHORT_LINK_FROM_URL, newData).then((newShortLink) => {
        this.updateAllRowsList();
        this.$swal({
          icon: 'success',
          title: 'Новая быстрая ссылка успешно создана!',
          showConfirmButton: false,
          timer: 1500
        });

        // Set new short link block
        this.newShortLink = newShortLink;
        // Set new url empty
        this.newUrl = "";
      }).catch(error => {
        console.error(error)
        let errorTitle = 'Произошла ошибка при создании новой быстрой ссылки!';

        if (error.response.status == 409) {
          // If hash(url) already exist in db
          errorTitle += "\nУказанный URL уже существует в базе данных!"
        } else if(error.response.status == 403) {
          // Validation error
          errorTitle = "\nОтправленная строка не является URL!"
        }
        this.$swal({
          icon: 'error',
          title: errorTitle,
          showConfirmButton: false,
          timer: 2500
        });
      });
    },

    generateFullLink(hash) {
      const route = this.$router.resolve({
        name: "RedirectToUrl",
        params: { hash: hash }
      });
      const absoluteURL = new URL(route.href, window.location.origin).href;
      return absoluteURL
    },

    generateAndCopyShortLink(shortLink) {
      const { hash_str } = shortLink;
      let absoluteURL = this.generateFullLink(hash_str);
      copy(absoluteURL);
      this.$swal({
        icon: 'info',
        title: `Вы успешно скопировали URL-адрес!`,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1500
      });
    },

    // Go to short link
    goToShortLink(shortLink) {
      const { hash_str } = shortLink;
      this.$router.push({
        name: "RedirectToUrl",
        params: { hash: hash_str }
      })
    },

    // Delete record
    showDeleteRecordPopup(shortLink) {
      this.$swal({
        title: 'Вы хотите удалить данную запись?',
        text: "Вы не сможете отменить данное действие!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Да, удалить!',
        cancelButtonText: 'Нет!',
      }).then(result => {
        if (result.isConfirmed) {
          // Delete record
          let onDeleteRecord = Object.assign({}, shortLink);

          this.$store.dispatch(DELETE_SHORT_LINK, onDeleteRecord).then(() => {
            this.updateAllRowsList();
            this.$swal({
              icon: 'success',
              title: 'Запись успешно удалена',
              showConfirmButton: false,
              timer: 1500
            });
          }).catch(error => {
            console.error(error)
            this.$swal({
              icon: 'error',
              title: 'При удалении записи произошла ошибка',
              showConfirmButton: false,
              timer: 1500
            });
          });

        } else if (result.dismiss === DismissReason.cancel) {
          this.$swal({
            icon: 'error',
            title: 'Отмена удаления записи!',
          })
        }
      })
    },

    // Update record
    showUpdateRecordPopup(shortLink) {
      this.$swal({
        title: 'Введите новый заголовок для данной записи',
        input: 'text',
        inputValue: shortLink.title,
        inputAttributes: {
          autocapitalize: 'off',
          placeholder: 'Введите заголовок не длинее 60 символов',
        },
        showCancelButton: true,
        confirmButtonText: 'Подтвердить',
        cancelButtonText: 'Отмена!',

        showLoaderOnConfirm: true,
        preConfirm: (newTitle) => {
          const updateRecord = Object.assign({}, shortLink)
          updateRecord.title = newTitle;

          this.$store.dispatch(CHANGE_SHORT_LINK_INFO, updateRecord).then(() => {
            this.updateAllRowsList();
            this.$swal({
              icon: 'success',
              title: 'Запись успешно обновлена!',
              showConfirmButton: false,
              timer: 1500
            });
          }).catch(error => {
            console.error(error)
            this.$swal({
              icon: 'error',
              title: 'При обновлении записи произошла ошибка',
              showConfirmButton: false,
              timer: 1500
            });
          });
        },
      });
    },

  }
}
</script>

<style scoped lang="scss" src="@/assets/scss/main/main-component.scss">
</style>

