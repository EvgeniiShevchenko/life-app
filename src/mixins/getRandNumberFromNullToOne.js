export default {
  methods: {
    getRandNumberFromNullToOne(maxIndex, minLength = 0) {
      const randResult = Math.ceil((Math.random() * (maxIndex - minLength) + minLength) * 100) / 100;

      return randResult;
    },
  },
};
