export default {
  methods: {
    getRandFromMinusToPlusValue() {
      const randResult = Math.round((Math.random() * 2 - 1 + Number.EPSILON) * 100) / 100;

      return randResult;
    },
  },
};
