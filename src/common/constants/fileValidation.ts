export const fileValidation = {
  general: {
    size: {
      maxSize: 1024 * 1024 * 5, // 5MB
      message: (maxSize: number): string =>
        `File size should not exceed ${maxSize / 1024 / 1024} MB`,
    },
  },
};
