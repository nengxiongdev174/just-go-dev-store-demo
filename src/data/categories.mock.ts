import { type CategoryItem } from "@/types/store";

export const CATEGORIES: CategoryItem[] = [
  {
    id: "all",
    name: {
      lo: "ສິນຄ້າທັງໝົດ",
      th: "สินค้าทั้งหมด",
      en: "All Products",
    },
    iconName: "LayoutGrid",
  },
  {
    id: "electronics",
    name: {
      lo: "ອຸປະກອນໄອທີ & ຄອມພິວເຕີ",
      th: "อุปกรณ์ไอที & คอมพิวเตอร์",
      en: "IT & Electronics",
    },
    iconName: "Laptop",
  },
  {
    id: "gadgets",
    name: {
      lo: "ແກັດເຈັດ & ອຸປະກອນເສີມ",
      th: "แกดเจ็ต & อุปกรณ์เสริม",
      en: "Smart Gadgets",
    },
    iconName: "Watch",
  },
  {
    id: "fashion",
    name: {
      lo: "ແຟຊັ່ນ & ເຄື່ອງແຕ່ງກາຍ",
      th: "แฟชั่น & เครื่องแต่งกาย",
      en: "Fashion & Apparel",
    },
    iconName: "Shirt",
  },
  {
    id: "home",
    name: {
      lo: "ເຄື່ອງໃຊ້ໄຟຟ້າໃນບ້ານ",
      th: "เครื่องใช้ไฟฟ้าในบ้าน",
      en: "Smart Home",
    },
    iconName: "Home",
  },
  {
    id: "lifestyle",
    name: {
      lo: "ໄລຟ໌ສະໄຕລ໌ & ກະເປົາ",
      th: "ไลฟ์สไตล์ & กระเป๋า",
      en: "Lifestyle & Bags",
    },
    iconName: "Briefcase",
  },
];

