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
    :newShortLink="getNewShortLink" 
    @close="closeGeneratedShortLink"
    @copy="copyShortLinkHandler"
  >
</new-short-link-block>

  <div class="row m-3">
    <h4 class="text-start">
      Список ссылок ({{ sortedShortLinkList.length }})
    </h4>
  </div>
  
  <div class="row">
    <div class="col">
      <short-link-list 
        :shortLinks="sortedShortLinkList"
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
// Vuex
import { mapActions, mapGetters } from "vuex";
// Components
import ShortLinkList from "@/components/shortlink.components/ShortLinkList";
import ShortLinkGenerateForm from "@/components/shortlink.components/ShortLinkGenerateForm";
import NewShortLinkBlock from "@/components/shortlink.components/NewShortLinkBlock";
// Shortlinks utils
import { generateFullUrlByHash, isValidUrl } from "@/components/shortlink.components/utils";


export default {
  name: 'MainComponent',

  data() {
    return {
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

  computed: {
    ...mapGetters(['sortedShortLinkList', 'getNewShortLink'])
  },

  methods: {
    // Load vuex short links actions
    ...mapActions(["getAllShortLinks", "deleteShortLink", "changeShortLinkInfo", "generateShortLinkFromUrl", "clearGeneratedShortLInk"]),

    updateAllRowsList() {
      // Return promise
      this.getAllShortLinks();
    },

    // Short links event handlers

    closeGeneratedShortLink() {
      this.clearGeneratedShortLInk();
    },

    async createShortLinkHandler() {
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

      try {
        await this.generateShortLinkFromUrl(newData);
        // Show success message
        this.$swal({
          icon: 'success',
          title: 'Новая быстрая ссылка успешно создана!',
          showConfirmButton: false,
          timer: 1500
        });
        // Set new url empty
        this.newUrl = "";
      } catch (error) {
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
      }
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

    async deleteShortLinkHandler(shortLink) {
      let result = await this.$swal({
        title: 'Вы хотите удалить данную запись?',
        text: "Вы не сможете отменить данное действие!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Да, удалить!',
        cancelButtonText: 'Нет!',
      });

      if (!result.isConfirmed) {
        this.$swal({
          icon: 'error',
          title: 'Отмена удаления записи!',
        });
        return;
      }

      let onDeleteRecord = Object.assign({}, shortLink);

      try {
        await this.deleteShortLink(onDeleteRecord);
        this.$swal({
          icon: 'success',
          title: 'Запись успешно удалена',
          showConfirmButton: false,
          timer: 1500
        });
      } catch {
        this.$swal({
          icon: 'error',
          title: 'При удалении записи произошла ошибка',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },

    async updateShortLinkHandler(shortLink) {
      const preConfirmHandler = async (newTitle) => {
        const updateRecord = Object.assign({}, shortLink);
        updateRecord.title = newTitle;

        try {
          await this.changeShortLinkInfo(updateRecord);
          this.$swal({
            icon: 'success',
            title: 'Запись успешно обновлена!',
            showConfirmButton: false,
            timer: 1500
          });
        } catch (error) {
          this.$swal({
            icon: 'error',
            title: 'При обновлении записи произошла ошибка',
            showConfirmButton: false,
            timer: 1500
          });
        }
      };

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
        preConfirm: preConfirmHandler,
      });
    },
  }
}
</script>

<style scoped lang="scss" src="@/assets/scss/main/main-component.scss">
</style>

