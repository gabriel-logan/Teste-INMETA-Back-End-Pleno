export const validationConstraints = {
  employee: {
    password: {
      minLength: 6,
      maxLength: 255,
    },
    firstName: {
      maxLength: 30,
      minLength: 2,
    },
    lastName: {
      maxLength: 40,
      minLength: 2,
    },
    fullName: {
      maxLength: 30 + 40 + 1,
      minLength: 2 + 2 + 1,
    },
    username: {
      maxLength: 40,
      minLength: 3,
    },
  },
  contractEvent: {
    reason: {
      maxLength: 255,
    },
  },
  general: {
    maxArraySize: 30,
    maxStringLength: 255,
  },
};
