import { type StoreConfig, type PromoCode, type StoreUser } from "@/types/store";

export const INITIAL_STORE_CONFIG: StoreConfig = {
  storeName: "JustGoDev Store",
  tagline: {
    lo: "ສູນລວມສິນຄ້າໄອທີ ແຟຊັ່ນ ແລະ ໄລຟ໌ສະໄຕລ໌ ຄຸນນະພາບລະດັບພຣີມຽມ",
    th: "ศูนย์รวมสินค้าไอที แฟชั่น และไลฟ์สไตล์ คุณภาพระดับพรีเมียม",
    en: "Premium Tech, Fashion & Lifestyle Cloud Marketplace",
  },
  email: "store@justgodev.com",
  phone: "+856 20 5555 8899",
  address: {
    lo: "ຖະໜົນລ້ານຊ້າງ, ເມືອງຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ",
    th: "ถนนล้านช้าง เมืองจันทบุรี นครหลวงเวียงจันทน์",
    en: "Lane Xang Avenue, Chanthabuly District, Vientiane",
  },
  freeShippingThreshold: 1000000,
  standardShippingFee: 35000,
  taxRate: 7,
  exchangeRates: {
    LAK: 1,
    THB: 0.0016,
    USD: 0.000045,
  },
};

export const PROMO_CODES: PromoCode[] = [
  {
    code: "JUSTGODEV10",
    discountPercent: 10,
    minSpend: 200000,
    description: {
      lo: "ສ່ວນຫຼຸດ 10% ສຳລັບລູກຄ້າໃໝ່ (ຂັ້ນຕ່ຳ 200,000 ກີບ)",
      th: "ส่วนลด 10% สำหรับลูกค้าใหม่ (ขั้นต่ำ 200,000 กีบ)",
      en: "10% OFF welcome discount (Min. 200,000 LAK)",
    },
  },
  {
    code: "VIP20",
    discountPercent: 20,
    minSpend: 1500000,
    description: {
      lo: "ສ່ວນຫຼຸດພິເສດ 20% ເມື່ອຊື້ຄົບ 1,500,000 ກີບ",
      th: "ส่วนลดพิเศษ 20% เมื่อช้อปครบ 1,500,000 กีบ",
      en: "20% OFF VIP reward on orders over 1,500,000 LAK",
    },
  },
];

export const DEMO_USERS: StoreUser[] = [
  {
    id: "usr-cust",
    name: "Somsack Phommavong",
    email: "customer@JustGoDev.com",
    phone: "020 5899 1234",
    role: "customer",
    avatar: "SP",
    address: "ບ້ານโพนสะหวัน, เมืองสีสัตตะนาก, นครหลวงเวียงจันทน์",
  },
  {
    id: "usr-mgr",
    name: "Nengxiong WANGTOUAXIONG",
    email: "admin@JustGoDev.com",
    phone: "020 9988 7766",
    role: "manager",
    avatar: "NW",
    address: "JustGoDev HQ, Chanthabuly, Vientiane",
  },
];

