const cart = [];

Vue.component('search', {
  props: {
    searchLine: {
      type: String,
      required: false,
      default: '',
    }
  },
  template: `
      <form class="search-form" @submit.prevent>
        <input type="text" class="search-input" :value="searchLine"
          @input="updateSearchLine"/>
      </form>
  `,
  methods: {
    updateSearchLine(val) {
      const value = val.target.value;
      this.$emit('update:searchLine', value);
    }
  }
});

Vue.component('cart', {
  data: () => ({
    cart,
    isVisibleCart: false,
  }),
  methods: {
    toggleVisibility() {
      this.isVisibleCart = !this.isVisibleCart;
    }
  },
  template: `
    <div class="cart-container" v-if="isVisibleCart">
      <ul>
        <li v-for="good in cart">
           {{good.product_name}}
        </li>
      </ul>
    </div>
  `
});

Vue.component('goods-item', {
  props: ['good'],
  methods: {
    buy() {
      cart.push(this.good);
    }
  },
  template: `
    <div class="goods-item">
        <h3>{{ good.product_name }}</h3>
        <p>{{ good.price }}</p>
        <button @click="buy">Купить</button>
    </div>
  `,
});

Vue.component('goods-list', {
  props: ['goods'],
  computed: {
    isGoodsEmpty() {
      return this.goods.length === 0;
    }
  },
  template: `
    <div class="goods-list" v-if="!isGoodsEmpty">
      <goods-item v-for="good in goods" :good="good" :key="good.id_product"></goods-item>
    </div>
    <div class="not-found-items" v-else>
      <h2>Нет данных</h2>
    </div>
  `,
});

const app = new Vue({
  el: '#app',
  data: {
    goods: [],
    searchLine: '',
    error: '',
  },
  methods: {
    setError(e) {
      this.error = e.message || e;
      setTimeout(() => {
        this.error = '';
      }, 3500);
    },
    makeGETRequest(url) {
      return new Promise((resolve, reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
          xhr = new window.XMLHttpRequest();
        } else {
          xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
        }

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const body = JSON.parse(xhr.responseText);
              resolve(body)
            } else {
              reject(xhr.responseText);
            }
          }
        };
        xhr.onerror = function (err) {
          reject(err);
        };

        xhr.open('GET', url);
        xhr.send(JSON.stringify(data));
      });
  },

    makePOSTRequest(url, data) {
      return new Promise((resolve, reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
          xhr = new window.XMLHttpRequest();
        } else {
          xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
        }

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const body = JSON.parse(xhr.responseText);
              resolve(body)
            } else {
              reject(xhr.responseText);
            }
          }
        };
        xhr.onerror = function (err) {
          reject(err);
        };

        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(data);
      });
    },
    toggleCartVisibility() {
      this.$refs.cart.toggleVisibility();
    },
  },
  computed: {
    isSearchActive() {
      return this.searchLine.length > 0;
    },
    filteredGoods() {
      const searchValue = this.searchLine.replace(/[\*]/gi, '');
      const regexp = new RegExp(searchValue, 'i');
      return this.goods.filter((good) => regexp.test(good.product_name));
    },
  },
  async mounted() {
    try {
      this.goods = await this.makeGETRequest(`/catalog`);
    } catch (e) {
      this.setError('Товары не найдены');
    }
  }
});
