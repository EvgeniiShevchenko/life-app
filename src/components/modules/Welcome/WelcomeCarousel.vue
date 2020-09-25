<template>
  <VueSlickCarousel class="carousel" :arrows="true" :swipeToSlide="true" cssEase="linear" :autoplay="true" :infinite="true" :slidesToShow="3" v-if="sepecialOffersList.length">
    <div class="item" :key="index" v-for="(item, index) in sepecialOffersList">
      <div :class="`item-priview ${item.class === 'rarely' ? 'is-special' : ''}`">
        <img class="priview-icon" :src="`img/icons/inventory/${item.productId}.png`" alt="Product" />
      </div>
      <p class="item-name">{{ item.target.name }}</p>
      <p class="item-price">{{ item.coinsPrice ? `${item.coinsPrice} S COINS` : `${item.cashPrice} $` }}</p>
      <button
        :class="`buy-btn ${item.purchased ? 'is-sold' : ''} ${(coins > item.coinsPrice && !item.cashPrice) || (money > item.cashPrice && !item.coinsPrice) ? '' : 'is-buy-unavailable'}`"
        :disabled="item.purchased"
        @click="handlerBuy(item)"
      >
        {{ item.purchased ? 'Is sold' : $t('buy') }}
      </button>
      <p class="time-left">{{ $t('left') }}: {{ $options.filters.defineDifferenceBetweenStartEndDateDDHH(item.timeLeft).replace(':', ` ${$t('welcome-days')} `) }} {{ $t('hours') }}</p>
      <img :class="`marker-sold ${item.purchased ? 'is-show' : ''}`" src="img/icons/welcome/welcome-offer-sold.png" alt="Offer sold" />
    </div>
    <template slot="prevArrow">
      <div class="custom-left-arrow">
        <img class="left-arrow-icon" src="img/icons/welcome/welcome-carousel-arrow.png" alt="Carousel arrow" />
      </div>
    </template>
    <template slot="nextArrow">
      <div class="custom-right-arrow">
        <img class="right-arrow-icon" src="img/icons/welcome/welcome-carousel-arrow.png" alt="Carousel arrow" />
      </div>
    </template>
  </VueSlickCarousel>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';

// helpers
import inventoryList from '@/helpers/inventoryList';

export default {
  name: 'WelcomeCarousel',
  data() {
    return {
      sepecialOffersList: [],
    };
  },
  computed: {
    ...mapState({
      coins: (state) => state.playerInfo.coins,
      money: (state) => state.playerInfo.money,
    }),
  },
  methods: {
    handlerBuy(offerParams) {
      if (this.coins < offerParams.coinsPrice && !offerParams.cashPrice) {
        this.$snotify.error(this.$t('welcome-not-enough-game-currency'), {
          position: 'centerCenter',
        });

        return;
      }

      if (this.money < offerParams.cashPrice && !offerParams.coinsPrice) {
        this.$snotify.error(this.$t('you-not-have-enough-cash'), {
          position: 'centerCenter',
        });

        return;
      }

      try {
        this.sepecialOffersList = this.sepecialOffersList.map((item) => {
          if (item.id === offerParams.id) {
            if (offerParams.coinsPrice && !offerParams.cashPrice) {
              this.setCoins(this.coins - offerParams.coinsPrice);
            } else {
              this.setMoney(this.money - offerParams.cashPrice);
            }

            return { ...item, purchased: true };
          }

          return item;
        });
      } catch (error) {
        this.$snotify.error(this.$t('this-item-is-currently-unavailable'), {
          position: 'centerCenter',
        });
      }
    },

    ...mapActions({ setCoins: 'setCoins', setMoney: 'setMoney' }),
  },
  mounted() {
    this.sepecialOffersList = this.offerCollection.map((offer) => {
      const getOrigin = inventoryList.find((item) => item.id === offer.productId);

      return { ...offer, target: getOrigin };
    });
  },
  props: {
    offerCollection: {
      type: Array,
    },
  },
  components: {
    VueSlickCarousel,
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  display: flex;
  align-items: center;
  padding: 0 40px;

  @include init-font;

  /deep/ .slick-list {
    .slick-track {
      padding: 12px 0;

      .slick-slide {
        padding: 0 15px;
      }
    }
  }

  /deep/ .custom-left-arrow {
    position: absolute;
    left: 0;

    cursor: pointer;

    .left-arrow-icon {
      filter: blur(2px);
    }
  }

  /deep/ .custom-right-arrow {
    position: absolute;
    right: 0;

    cursor: pointer;

    .right-arrow-icon {
      transform: rotate(180deg);
      filter: blur(2px);
    }
  }

  .item {
    position: relative;
    display: inline-block;
    padding: 30px 0;

    &::before {
      position: absolute;
      content: '';

      right: 0;
      top: 0;
      left: 0;
      bottom: 0;

      border-radius: 12px;
      background: linear-gradient(290.1deg, rgba(113, 155, 204, 0) -5.26%, rgba(131, 191, 237, 0.4) 108.09%);

      filter: blur(12px);
    }

    .item-priview {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      margin: 0 auto;

      width: 100px;
      height: 100px;
      z-index: 1;

      &::before {
        position: absolute;
        content: '';

        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        border-radius: 6px;
        background: linear-gradient(48.88deg, rgba(113, 155, 204, 0) -8.93%, rgba(131, 191, 237, 0.4) 109.61%);
        filter: blur(6px);
        transform: matrix(0, -1, -1, 0, 0, 0);

        z-index: -1;
      }
    }

    .is-special {
      &::before {
        background: linear-gradient(50.37deg, #ffe259 -7.11%, #ffa751 113.7%);
      }
    }

    .item-name {
      margin-top: 15px;
      height: 60px;

      font-size: 24px;
      line-height: 28px;
    }

    .item-price {
      margin-top: 30px;
      height: max-content;
      @extend .item-name;

      text-shadow: 0px 0px 22px #ffffff;
    }

    .buy-btn {
      position: relative;
      margin-top: 15px;
      padding: 14px 30px;

      @include init-font;
      font-weight: normal;
      font-size: 22px;
      line-height: 26px;

      z-index: 1;

      &::before {
        position: absolute;
        content: '';

        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background: linear-gradient(50.37deg, #ffe259 -7.11%, #ffa751 113.7%);
        border-radius: 6px;
        filter: blur(6px);

        z-index: -1;
      }
    }

    .is-sold::before {
      background: linear-gradient(#cecece, #a7a7a7);
    }

    .is-buy-unavailable {
      opacity: 0.75;
    }

    .time-left {
      margin-top: 30px;

      font-size: 18px;
      line-height: 21px;
    }

    .marker-sold {
      position: absolute;

      right: -12px;
      top: -12px;

      transition: opacity 1s ease-out;
      opacity: 0;
    }

    .is-show {
      opacity: 0.35;
    }
  }
}
</style>
