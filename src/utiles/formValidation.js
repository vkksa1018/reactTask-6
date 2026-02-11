// src/utiles/formValidation.js

export const checkoutRules = {
  name: {
    required: "請輸入姓名",
    minLength: {
      value: 2,
      message: "姓名最少 2 個字",
    },
  },
  email: {
    required: "請輸入Email",
    pattern: {
      value: /^\S+@\S+$/i,
      message: "Email格式不正確",
    },
  },
  tel: {
    required: "請輸入電話",
    pattern: {
      value: /^\d+$/,
      message: "電話僅能輸入數字",
    },
    minLength: {
      value: 8,
      message: "電話最少 8 碼",
    },
  },
  address: {
    required: "請輸入地址",
  },
};
