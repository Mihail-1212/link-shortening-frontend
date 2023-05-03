<template>
  <div class="row">
    <h2>
      Сервис сокращения ссылок
    </h2>
  </div>

  <div class="row">
    <div class="col">
      <short-link-generate-form
        v-model:newUrl="newUrl"
        @create="createShortLinkHandler"
      >
      </short-link-generate-form>
    </div>
  </div>

  <new-short-link-block 
    class="mt-5" 
    :newShortLink="newShortLink" 
    @close="newShortLink=null"
    @copy="copyShortLinkHandler"
  >
</new-short-link-block>

  <div class="row m-3">
    <h4 class="text-start">
      Список ссылок ({{ shortLinks.length }})
    </h4>
  </div>
  
  <div class="row">
    <div class="col">
      <short-link-list 
        :shortLinks="shortLinks"
        @copy="copyShortLinkHandler" 
				@update="updateShortLinkHandler" 
				@delete="deleteShortLinkHandler"
      >
      </short-link-list>
    </div>

  </div>

</template>

<script>
import copy from 'copy-to-clipboard';
import { generateFullUrlByHash, isValidUrl } from "@/components/shortlink.components/utils";

import {
  GET_ALL_SHORT_LINKS,
  DELETE_SHORT_LINK,
  CHANGE_SHORT_LINK_INFO,
  GENERATE_SHORT_LINK_FROM_URL
} from "@/store/actions/short_links"
import { DismissReason } from "sweetalert2"
import ShortLinkList from "@/components/shortlink.components/ShortLinkList";
import ShortLinkGenerateForm from "@/components/shortlink.components/ShortLinkGenerateForm";
import NewShortLinkBlock from "@/components/shortlink.components/NewShortLinkBlock";


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
    ShortLinkList,
    ShortLinkGenerateForm,
    NewShortLinkBlock
  },

  mounted() {
    this.updateAllRowsList();
  },

  methods: {
    updateAllRowsList() {
      this.$store.dispatch(GET_ALL_SHORT_LINKS).then((shortLinkList) => {
        this.shortLinks=shortLinkList.sort((a, b) => {
          return a.hash_str.toLowerCase().localeCompare(b.hash_str.toLowerCase())
        }) || []
      }).catch(error => console.error(error));
    },

    // Short links event handlers

    createShortLinkHandler() {
      if (!isValidUrl(this.newUrl)) {
        this.$swal({
          icon: 'error',
          title: `Вы ввели не URL адрес!`,
          showConfirmButton: false,
          timer: 1500
        });
        return;
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

    copyShortLinkHandler(shortLink) {
			const { hash_str } = shortLink;
      let absoluteURL = generateFullUrlByHash(hash_str);
      copy(absoluteURL);
      this.$swal({
        icon: 'info',
        title: `Вы успешно скопировали URL-адрес!`,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1500
      });
		},

    deleteShortLinkHandler(shortLink) {
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

    updateShortLinkHandler(shortLink) {
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

