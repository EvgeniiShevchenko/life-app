<template>
  <section class="lottery-wrapper">
    <h3 class="title">{{ $t('try-your-luck') }}</h3>
    <p class="info">{{ $t('welcome-lucky-wheel-info') }}</p>
    <div class="subtitle-wrapper">
      <span class="before-subtitle"></span>
      <p class="subtitle">{{ $t('your-prize') }}</p>
      <span class="after-subtitle"></span>
    </div>
    <div class="lottery-wheel-wrapper">
      <div class="lottery-wheel">
        <div class="lotery-track">
          <ul class="wheel-list">
            <li class="wheel-item" :id="`wheel-first-${item.id}`" :style="`background: url(img/icons/inventory/${item.id}.png) no-repeat center;`" :key="index" v-for="(item, index) in wheelLuckyList">
              <div class="wheel-icon-wrapper"></div>
            </li>
          </ul>
          <ul class="wheel-list">
            <li
              class="wheel-item"
              :id="`wheel-second-${item.id}`"
              :style="`background: url(img/icons/inventory/${item.id}.png) no-repeat center;`"
              :key="index"
              v-for="(item, index) in wheelLuckyList"
            >
              <div class="wheel-icon-wrapper"></div>
            </li>
          </ul>
        </div>
        <div class="marker">
          <img class="marker-icon" src="img/icons/welcome/welcome-carousel-arrow.png" alt="" />
        </div>
        <div class="selected-frame"></div>
      </div>
    </div>
    <p class="prize-name">{{ isEmpty(prizeId) ? $t('spin-the-wheel') : prizeId.target.name }}</p>
    <button class="get-prize-btn" v-if="!isEmpty(prizeId)" @click="getPrize">{{ $t('get') }}</button>
    <button :class="`get-prize-btn ${!checkSpinAvailable || isDisabledSpin ? 'is-spin-unavailable' : ''}`" @click="spinTheWheel" :disabled="!checkSpinAvailable || isDisabledSpin" v-else>
      {{ $t('spin') }}
    </button>
    <p class="price-terms" :style="`opacity: ${isEmpty(prizeId) ? 1 : 0}`">{{ freeSpins ? `${$t('is-free')}: ${freeSpins}` : `${$t('price')}: 25 S Coins` }}</p>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';

// mixins
import getRandValueWithoutRound from '@/mixins/getRandValueWithoutRound';
import isEmpty from '@/mixins/isEmpty';
// helpers
import inventoryList from '@/helpers/inventoryList';

export default {
  name: 'WelcomeLuckyWheel',
  mixins: [getRandValueWithoutRound, isEmpty],
  data() {
    return {
      wheelLuckyList: [],
      prizeId: {},
      spinPrice: 25,
      isDisabledSpin: false,
    };
  },

  computed: {
    checkSpinAvailable() {
      return this.spinPrice && this.coins > this.spinPrice;
    },

    ...mapState({
      freeSpins: (state) => state.playerInfo.freeSpins,
      coins: (state) => state.playerInfo.coins,
    }),
  },

  methods: {
    getPrize() {
      this.prizeId = {};
    },

    centerinWheel() {
      const animationTarget = document.querySelector('.lotery-track');
      const endPointPosition = document.getElementsByClassName('marker')[0].getBoundingClientRect();
      const alignmentTarget = document.elementFromPoint(endPointPosition.x + 17, endPointPosition.y + 100);

      animationTarget.style.transform = `translateX(${endPointPosition.x + 17 - alignmentTarget.getBoundingClientRect().x - 55}px)`;

      return alignmentTarget.id;
    },

    resetAnimation() {
      const animationTarget = document.querySelector('.lotery-track');

      animationTarget.classList.remove('is-animation');

      animationTarget.style.animation = 'none';
      animationTarget.offsetHeight; /* trigger reflow */
      animationTarget.style.animation = null;
      animationTarget.style.transform = 'none';
    },

    spinTheWheel() {
      const animationTarget = document.querySelector('.lotery-track');

      this.resetAnimation();

      animationTarget.classList.add('is-animation');
      this.isDisabledSpin = true;
      this.freeSpins ? this.setSpins(this.freeSpins - 1) : this.setCoins(this.coins - this.spinPrice);

      setTimeout(() => {
        animationTarget.style.WebkitAnimationPlayState = 'paused';

        setTimeout(() => {
          const winNumber = Number(this.centerinWheel().split('-')[2]);

          this.prizeId = this.wheelLuckyList.find((item) => item.id === winNumber);
          this.isDisabledSpin = false;
        }, 100);
      }, this.getRandValueWithoutRound(8.5, 12.5) * 1000);
    },

    ...mapActions({ setCoins: 'setCoins', setSpins: 'setSpins' }),
  },

  async mounted() {
    this.wheelLuckyList = this.wheelLuckyCollection.map((prize) => {
      const getOrigin = inventoryList.find((item) => item.id === prize);

      return { id: prize, target: getOrigin };
    });

    this.$nextTick(() => {
      this.centerinWheel();
    });
  },
  props: {
    wheelLuckyCollection: {
      type: Array,
    },
  },
};
</script>

<style lang="scss" scoped>
.lottery-wrapper {
  padding-top: 17px;

  @include init-font;
  text-align: center;

  .title {
    font-size: 24px;
    line-height: 28px;
    text-shadow: 0px 0px 22px #ffffff;
  }

  .info {
    margin-top: 15px;

    font-size: 18px;
    line-height: 21px;
  }

  .subtitle-wrapper {
    display: flex;
    align-items: center;

    margin-top: 30px;

    .before-subtitle {
      margin-right: 15px;

      height: 3px;

      border-radius: 30px;
      background: linear-gradient(186.67deg, rgba(255, 255, 255, 0.5) 8.99%, rgba(255, 255, 255, 0) 90.84%);

      filter: blur(6px);
      flex: 1;
    }

    .subtitle {
      font-size: 24px;
      line-height: 28px;
      text-shadow: 0px 0px 22px #ffffff;
    }

    .after-subtitle {
      @extend .before-subtitle;

      margin-left: 15px;
      transform: rotate(180deg);
    }
  }

  .lottery-wheel-wrapper {
    position: relative;
    margin-top: 20px;

    &::before {
      position: absolute;
      content: '';

      left: -4px;
      top: 0;
      width: 2px;
      height: 100%;

      background: linear-gradient(50.37deg, #ffe259 -7.11%, #ffa751 113.7%);
      filter: blur(2px);
      border-radius: 6px;
    }

    &::after {
      position: absolute;
      content: '';

      right: -4px;
      top: 0;
      width: 2px;
      height: 100%;

      background: linear-gradient(50.37deg, #ffe259 -7.11%, #ffa751 113.7%);
      filter: blur(2px);
    }

    .lottery-wheel {
      position: inherit;
      display: flex;
      justify-content: center;
      align-items: center;

      top: 0;
      height: 130px;

      overflow-x: hidden;

      .lotery-track {
        position: absolute;
        display: flex;
        justify-content: flex-start;

        left: -100px;

        width: 200%;
        height: 100px;

        transition: all 2s ease;

        z-index: 1;

        .wheel-list {
          display: flex;

          .wheel-item {
            position: relative;
            padding: 0 5px;

            width: 110px;
            height: 100px;

            background-position: center;

            &::before {
              position: absolute;
              content: '';

              top: 5px;
              left: 5px;
              bottom: 5px;
              right: 5px;

              border-radius: 6px;
              background: linear-gradient(48.88deg, rgba(113, 155, 204, 0) -8.93%, rgba(131, 191, 237, 0.4) 109.61%);
              filter: blur(6px);
              transform: matrix(0, -1, -1, 0, 0, 0);
            }

            .wheel-icon-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;

              width: 100px;
              height: 100px;
            }
          }
        }
      }

      .is-animation {
        animation-name: marquee, marquee, marquee;
        animation-delay: 0s, 6s, 8.5s;
        animation-duration: 2s, 2.5s, 4s;
        animation-timing-function: linear, linear, linear;
        animation-iteration-count: 3, 1, 1;
      }

      .marker {
        position: fixed;
        margin-top: -120px;
        transform: rotate(270deg);
        z-index: 1;
      }

      .selected-frame {
        position: absolute;

        top: 50%;
        left: 50%;

        width: 100px;
        height: 100px;

        border-radius: 6px;
        background: linear-gradient(356.39deg, #2193b0 -2.48%, #6dd5ed 97.95%);
        transform: translate(-50%, -50%);

        filter: blur(6px);
      }
    }
  }

  .prize-name {
    font-size: 24px;
    line-height: 28px;
  }

  .get-prize-btn {
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

  .is-spin-unavailable {
    opacity: 0.75;
  }

  .price-terms {
    margin-top: 10px;

    font-size: 18px;
    line-height: 21px;
  }
}

@keyframes marquee {
  0% {
    left: 0;
  }
  100% {
    left: -2310px;
  }
}
</style>
