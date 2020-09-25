<template>
  <div class="welcome-wrapper">
    <div class="welcome-body">
      <div class="daily-rewards">
        <div class="available-accounts">
          <p class="simple-account">{{ $t('regular-account') }}</p>
          <p class="vip-account">{{ $t('vip-pass') }}</p>
        </div>
        <ul class="rewards-list">
          <li :class="`rewards-item ${item.date && !item.completed ? 'is-has-reward' : ''}`" :key="index" v-for="(item, index) in dailyRewardsList">
            <p class="day">{{ index + 1 }} {{ $t('day') }}</p>
            <div class="simple-preview">
              <img class="simple-icon" :src="`img/icons/inventory/${item.simple.rewardId}.png`" v-if="!item.simple.rewardMoney" alt="Icon reward" />
              <p class="simple-money" v-else>{{ item.simple.rewardMoney }}</p>
            </div>
            <div class="separator"></div>
            <div class="vip-preview">
              <img class="vip-icon" :src="`img/icons/inventory/${item.vip.rewardId}.png`" v-if="!item.vip.rewardMoney" alt="Icon reward" />
              <p class="vip-money" v-else>{{ item.vip.rewardMoney }}</p>
            </div>
            <button :class="`reward-btn ${item.completed ? 'is-without-border' : ''}`" :disabled="item.completed || (!item.completed && !item.date)" @click="handlerGetDailyReward(item)">
              {{ item.completed ? $t('get-with-vip') : $t('get') }}
            </button>
          </li>
        </ul>
      </div>
      <div class="divider-wrapper">
        <WelcomeLuckyWheel v-if="wheelLuckyList.length" :wheelLuckyCollection="wheelLuckyList" />
        <section class="offer-wrapper">
          <h3 class="title">{{ $t('offer-of-the-week') }}:</h3>
          <p class="info">{{ $t('welcome-offer-info') }}</p>
          <div class="carousel-wrapper">
            <WelcomeCarousel v-if="specialOffersList.length" :offerCollection="specialOffersList" />
          </div>
        </section>
      </div>
    </div>
    <div class="welcome-footer">
      <div class="vip-btn-wrapper">
        <p class="vip-btn-title">{{ $t('get-more') }}</p>
        <router-link class="vip-btn" tag="button" to="/account/change">{{ $t('i-want-a-VIP-pass') }}</router-link>
      </div>
      <p class="coins-btn-title">{{ $t('offer-of-the-week') }}: {{ coins }} S COINS</p>
      <router-link class="buy-coins-btn" tag="button" to="/buy/coins">{{ $t('buy') }} S COINS</router-link>
      <img class="vip-icon" src="/img/icons/welcome/welcome-corona.png" alt="Corona" />
      <p class="vip-title">
        {{ $t('vip-pass') }}<span class="vip-status">{{ vipStatus ? 'ON' : 'OFF' }}</span>
      </p>
    </div>
    <div class="title-wrapper">
      <h3 class="title">{{ $t('welcome') }}</h3>
    </div>
    <div class="close-wrapper">
      <router-link class="close-btn" tag="button" to="/">
        <img class="close-btn-icon" src="img/icons/welcome/welcome-close.png" alt="Close" />
        <p class="close-btn-label">{{ $t('close') }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';

// servises
import { getWelcomeDailyReward, getWelcomeSpecialOffers, getWelcomeWheelList } from '@/services/api';
// components
import WelcomeLuckyWheel from '@/components/modules/Welcome/WelcomeLuckyWheel.vue';
import WelcomeCarousel from '@/components/modules/Welcome/WelcomeCarousel.vue';

export default {
  name: 'Welcome',
  data() {
    return {
      dailyRewardsList: [],
      specialOffersList: [],
      wheelLuckyList: [],
    };
  },
  computed: {
    ...mapState({
      coins: (state) => state.playerInfo.coins,
      vipStatus: (state) => state.playerInfo.vipStatus,
    }),
  },
  methods: {
    handlerGetDailyReward({ id, date }) {
      this.dailyRewardsList = this.dailyRewardsList.map((item) => (item.id === id ? { ...item, completed: true } : item));
    },
  },

  async mounted() {
    const requestRewardList = await getWelcomeDailyReward();
    this.specialOffersList = await getWelcomeSpecialOffers();
    this.wheelLuckyList = await getWelcomeWheelList();

    if (this.vipStatus) {
      const hasWithoutRewards = requestRewardList.some((item) => {
        return !item.date.length && moment.unix(item.receivedDate).format('MM/DD/YYYY') <= moment().format('MM/DD/YYYY');
      });

      if (hasWithoutRewards) {
        this.dailyRewardsList = requestRewardList.map((item) =>
          !item.date.length && moment.unix(item.receivedDate).format('MM/DD/YYYY') <= moment().format('MM/DD/YYYY') ? { ...item, date: item.receivedDate } : item
        );

        return;
      }
    }

    if (!this.vipStatus) {
      const isFindEmptyDate = requestRewardList.find((item) => !item.date.length);
      const hasDailyRewards = requestRewardList.some((item) => {
        return item.date.length && moment.unix(item.date).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY');
      });

      if (!hasDailyRewards) {
        this.dailyRewardsList = requestRewardList.map((item) => (item.id === isFindEmptyDate.id ? { ...item, date: moment().format('X') } : item));

        return;
      }
    }

    this.dailyRewardsList = requestRewardList;
  },
  components: {
    WelcomeLuckyWheel,
    WelcomeCarousel,
  },
};
</script>

<style lang="scss" scoped>
.welcome-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;

  padding: 19px 45px 38px 175px;

  height: 100vh;
  width: 100vw;

  background: url('/img/icons/welcome/welcome-bg.png'), url('/img/icons/welcome/welcome-bg-layer.png');
  background-size: cover;

  @include init-font;

  .welcome-body {
    display: flex;

    .daily-rewards {
      max-width: 570px;
      width: 100%;

      .available-accounts {
        display: flex;
        padding-left: 57px;

        .simple-account {
          position: relative;

          padding: 13px 16px;

          max-width: 115px;

          text-align: center;
          font-size: 18px;
          line-height: 21px;
          z-index: 1;

          &::before {
            position: absolute;
            content: '';

            top: 0;
            left: 0;
            bottom: 0;
            right: 0;

            border-radius: 6px;
            background: linear-gradient(48.88deg, rgba(131, 191, 237, 0.4) -8.93%, rgba(113, 155, 204, 0) 109.61%);
            transform: rotate(180deg);
            z-index: -1;
          }
        }

        .vip-account {
          @extend .simple-account;
          margin-left: 47px;

          &::before {
            background: linear-gradient(50.37deg, #ffe259 -7.11%, #ffa751 113.7%);
            filter: blur(6px);
          }
        }
      }

      .rewards-list {
        margin-top: 38px;
        padding-right: 18px;
        padding-left: 12px;

        height: 833px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-track {
          border-radius: 30px;
          border: 1px solid transparent;
          background: rgbA(32, 28, 74, 0.3);

          transform: rotate(90deg);
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background: linear-gradient(356.39deg, #2193b0 -2.48%, #6dd5ed 97.95%);
          transform: rotate(-90deg);
        }

        .rewards-item {
          position: relative;
          display: flex;
          align-items: center;

          padding: 19px 0;

          .day {
            position: absolute;
            margin-left: 5px;

            height: 100%;

            opacity: 0.5;
            text-shadow: 0px 0px 22px #ffffff;

            font-size: 24px;
            line-height: 28px;
            writing-mode: vertical-lr;
            -webkit-transform: rotate(-180deg);
          }

          .simple-preview {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

            margin-left: 51px;

            width: 100px;
            height: 100px;

            opacity: 0.5;

            &::before {
              position: absolute;
              content: '';

              top: 0;
              left: 0;
              bottom: 0;
              right: 0;

              border-radius: 6px;
              background: linear-gradient(48.88deg, rgba(113, 155, 204, 0) -8.93%, rgba(131, 191, 237, 0.25) 109.61%);
            }
          }

          .separator {
            position: relative;

            margin: 0 30px;

            height: 100px;
            width: 3px;

            border-radius: 30px;
            background: linear-gradient(186.67deg, #ffffff 8.99%, rgba(255, 255, 255, 0) 90.84%);

            filter: blur(6px);
          }

          .vip-preview {
            position: relative;
            @extend .simple-preview;
            margin-left: 0;
            opacity: 1;

            &::before {
              background: linear-gradient(50.37deg, #ffe259 -7.11%, #ffa751 113.7%);
              filter: blur(6px);
            }

            .vip-icon {
              position: inherit;
            }

            .vip-money {
              position: inherit;
            }
          }

          .reward-btn {
            margin-left: 29px;
            padding: 14px 30px;

            height: max-content;
            max-width: 145px;
            width: 100%;

            border-radius: 6px;
            border: 2px solid #ffffff;

            @include init-font;
            font-size: 22px;
            font-weight: normal;
            line-height: 26px;

            opacity: 0.5;
            cursor: default;
          }

          .is-without-border {
            padding: 14px 0;
            width: 145px;
            border: none;
          }
        }

        .is-has-reward {
          &::before {
            position: absolute;
            content: '';

            top: 0;
            left: 0;
            bottom: 0;
            right: 0;

            background: linear-gradient(356.39deg, #2193b0 -2.48%, #6dd5ed 97.95%);
            filter: blur(12px);
            border-radius: 6px;
            transform: rotate(180deg);
          }

          .reward-btn {
            position: relative;
            opacity: 1;
            cursor: pointer;
          }

          .day {
            opacity: 1;
          }

          .simple-preview {
            opacity: 1;
          }
        }
      }
    }

    .divider-wrapper {
      display: flex;
      flex-direction: column;

      padding-left: 47px;
      width: calc(100% - 570px);

      .offer-wrapper {
        display: flex;
        flex-direction: column;

        margin-top: 30px;

        flex: 1;

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

        .carousel-wrapper {
          margin-top: 15px;

          flex: 1;
        }
      }
    }
  }

  .welcome-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: 25px;

    .vip-btn-wrapper {
      display: flex;
      align-items: center;
      text-align: left;

      flex: 1;

      .vip-btn-title {
        font-size: 25px;
        line-height: 29px;
        letter-spacing: 0.25em;
        text-shadow: 0px 0px 22px #ffffff;
      }

      .vip-btn {
        position: relative;
        margin-left: 15px;
        padding: 15px 29px;

        @include init-font;
        font-size: 22px;
        font-weight: normal;
        line-height: 26px;

        z-index: 1;

        &::before {
          position: absolute;
          content: '';

          top: 0;
          left: 0;
          bottom: 0;
          right: 0;

          border-radius: 6px;
          background: linear-gradient(50.37deg, #ffe259 -7.11%, #ffa751 113.7%);
          filter: blur(6px);

          z-index: -1;
        }
      }
    }

    .coins-btn-title {
      font-size: 25px;
      line-height: 29px;
      text-shadow: 0px 0px 22px #ffffff;
    }

    .buy-coins-btn {
      position: relative;
      margin-left: 15px;
      padding: 15px 29px;

      @include init-font;
      font-size: 22px;
      font-weight: normal;
      line-height: 26px;

      z-index: 1;

      &::before {
        position: absolute;
        content: '';

        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        border-radius: 6px;
        background: linear-gradient(50.37deg, #ffe259 -7.11%, #ffa751 113.7%);
        filter: blur(6px);

        z-index: -1;
      }
    }

    .vip-icon {
      margin-left: 60px;
      filter: drop-shadow(0px 0px 12px #ffffff);
    }

    .vip-title {
      margin-left: 15px;
      @extend .coins-btn-title;

      .vip-status {
        margin-left: 15px;
        text-shadow: none;

        background: -webkit-linear-gradient(30deg, #ffe259 0%, #ffa751 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .title-wrapper {
    position: absolute;

    left: 0;
    top: 135px;
    padding: 0 25px;

    &::after {
      position: absolute;
      content: '';

      bottom: 93px;
      left: 0;

      width: 100%;
      height: 233px;

      border-radius: 6px;
      background: linear-gradient(356.39deg, #2193b0 -2.48%, #6dd5ed 97.95%);
      filter: blur(12px);

      transform: rotate(180deg);
    }

    .title {
      position: relative;

      writing-mode: vertical-lr;
      transform: rotate(180deg);

      font-size: 80px;
      line-height: 94px;
      letter-spacing: 0.28em;
      text-shadow: 0px 0px 22px #ffffff;
      z-index: 1;
    }
  }

  .close-wrapper {
    position: absolute;

    top: 35px;
    left: 45px;

    .close-btn {
      position: relative;

      @include init-font;
      font-size: 20px;
      font-weight: normal;
      line-height: 23px;

      .close-btn-label {
        display: inline-block;
        position: absolute;

        top: 50%;
        margin-left: 15px;

        transform: translateY(-50%);
      }
    }
  }
}
</style>
