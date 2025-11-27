import 'dotenv/config';
import { db } from '.';
import { productsTable } from './schema';

async function main() {
  const products: (typeof productsTable.$inferInsert)[] = [
    // Components
    {
      name: 'Intel Core i9-13900K',
      description:
        'Prosesor Intel Raptor Lake, 24 core, performa tinggi untuk gaming dan rendering.',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4DmQhDGytIYf41PcUMa-GqnL7-gZx_y-p9g&s',
      price: 9_500_000,
      type: 'component',
      category: 'cpu',
    },
    {
      name: 'AMD Ryzen 9 7900X',
      description: 'Prosesor AMD Zen 4, unggul pada multi-thread untuk content creation.',
      imageUrl: 'https://blossomzones.com/wp-content/uploads/2022/09/7900X.png',
      price: 8_200_000,
      type: 'component',
      category: 'cpu',
    },
    {
      name: 'ASUS ROG Strix Z790-E Gaming',
      description:
        'Motherboard ATX high-end untuk prosesor Intel generasi terbaru, fitur gaming lengkap.',
      imageUrl:
        'https://rog.asus.com/id/motherboards/rog-strix/rog-strix-z790-e-gaming-wifi-model/',
      price: 6_000_000,
      type: 'component',
      category: 'motherboard',
    },
    {
      name: 'MSI MPG X670E Carbon',
      description: 'Motherboard AM5 premium dengan fitur PCIe 5.0 dan pendinginan baik.',
      imageUrl:
        'https://storage-asset.msi.com/global/picture/image/feature/mb/X670/mpg/X670E-CARBON-WIFI/mpg_x670e_carbon_wifi.png',
      price: 5_700_000,
      type: 'component',
      category: 'motherboard',
    },
    {
      name: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz',
      description: 'RAM DDR5 cepat untuk gaming dan workstation.',
      imageUrl:
        'https://www.corsair.com/ww/en/p/ddr5-ram/cmh32gx5m2e6000c36/vengeance-rgb-32gb-2x16gb-ddr5-dram-6000mt-s-c36-memory-kit-black-cmh32gx5m2e6000c36?srsltid=AfmBOorTR4s190KO4sFSXYb-yQAd8ZwLTXkXh18mer-quD7V5u48uNn8',
      price: 3_400_000,
      type: 'component',
      category: 'ram',
    },
    {
      name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz',
      description: 'RAM performa tinggi dengan RGB, ideal untuk overclocking.',
      imageUrl: 'https://www.gskill.com/_upload/images/2110201626450.png',
      price: 4_200_000,
      type: 'component',
      category: 'ram',
    },
    {
      name: 'Samsung 980 PRO 1TB NVMe PCIe 4.0',
      description: 'SSD NVMe cepat untuk sistem operasi dan aplikasi berat.',
      imageUrl:
        'https://images.samsung.com/is/image/samsung/p6pim/za/mz-v8p1t0bw/gallery/za-980-pro-nvme-m2-ssd-mz-v8p1t0bw-332073513?$Q90_1248_936_F_PNG$',
      price: 1_900_000,
      type: 'component',
      category: 'storage',
    },
    {
      name: 'Seagate Barracuda 2TB HDD 7200RPM',
      description: 'Penyimpanan besar untuk file dan backup.',
      imageUrl:
        'https://translate.google.com/translate?u=https://www.seagate.com/support/internal-hard-drives/desktop-hard-drives/barracuda-3-5/&hl=id&sl=en&tl=id&client=imgs',
      price: 750_000,
      type: 'component',
      category: 'storage',
    },
    {
      name: 'NVIDIA GeForce RTX 4090 24GB',
      description: 'GPU flagship untuk gaming 4K dan rendering GPU intensif.',
      imageUrl:
        'https://asset.msi.com/resize/image/global/product/product_16655531780ae76e91e577ad9719f1f135824e1a15.png62405b38c58fe0f07fcef2367d8a9ba1/600.png',
      price: 45_000_000,
      type: 'component',
      category: 'gpu',
    },
    {
      name: 'NVIDIA GeForce RTX 4070 Ti 12GB',
      description: 'GPU high-end untuk gaming pada resolusi tinggi dengan efisiensi baik.',
      imageUrl:
        'https://asset.msi.com/resize/image/global/product/product_1672734501633e5e2445a44bac87ac9167addd009f.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png',
      price: 12_500_000,
      type: 'component',
      category: 'gpu',
    },
    {
      name: 'Corsair RM850x (850W) Modular',
      description: 'PSU 80+ Gold, modular penuh, andal untuk build high-end.',
      imageUrl:
        'https://img.overclockers.co.uk/images/POW-CRS-02466/74e63eaebcade286e6c572cb2db79a46.jpg',
      price: 2_200_000,
      type: 'component',
      category: 'psu',
    },
    {
      name: 'Seasonic Focus GX-750 (750W) 80+ Gold',
      description: 'PSU berkualitas tinggi dengan jaminan stabilitas daya.',
      imageUrl: 'https://seasonic.com/wp-content/uploads/2024/04/FOCUS-GX-750-Box-1440x1080.webp',
      price: 1_800_000,
      type: 'component',
      category: 'psu',
    },
    {
      name: 'NZXT H510',
      description: 'Casing mid-tower minimalis dengan manajemen kabel baik.',
      imageUrl:
        'https://www.azioonline.com/wp-content/uploads/2022/05/NZXT-H510-Flow-Mid-Tower-Black-Edition-ATX-1.webp',
      price: 900_000,
      type: 'component',
      category: 'casing',
    },
    {
      name: 'Cooler Master NR200P',
      description: 'Casing SFF dengan airflow dan opsi pendinginan baik.',
      imageUrl: 'https://a.storyblok.com/f/281110/9f54fe9d1c/nr200p-gallery-9.png',
      price: 1_600_000,
      type: 'component',
      category: 'casing',
    },
    {
      name: 'Noctua NH-D15',
      description: 'Pendingin udara premium, dingin dan tenang.',
      imageUrl:
        'https://static0.xdaimages.com/wordpress/wp-content/uploads/2023/02/noctua-nh-d15.png',
      price: 1_200_000,
      type: 'component',
      category: 'cooling',
    },
    {
      name: 'Corsair iCUE H100i RGB (240mm) AIO',
      description: 'Pendingin cair AIO 240mm dengan kontrol RGB dan performa tinggi.',
      imageUrl:
        'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Liquid-Cooling/base-rgb-elite-coolers-config/Gallery/H100i_RGB_ELITE_01.webp',
      price: 1_500_000,
      type: 'component',
      category: 'cooling',
    },

    // Accessories
    {
      name: 'Samsung Odyssey G7 27" 240Hz',
      description: 'Monitor gaming QHD, refresh rate tinggi, ideal untuk kompetitif gaming.',
      imageUrl:
        'https://images.samsung.com/is/image/samsung/ie-monitor-cg75-lc27g75tqsuxen-frontblack-245380307?$Q90_1248_936_F_PNG$',
      price: 8_900_000,
      type: 'accessory',
      category: 'monitor',
    },
    {
      name: 'LG UltraGear 27GN950 4K 144Hz',
      description: 'Monitor 4K untuk gaming dan content creation dengan warna akurat.',
      imageUrl:
        'https://img-prd-pim.poorvika.com/cdn-cgi/image/width=500,height=500,quality=75/product/lg-ultragear-qhd-ips-gaming-monitor-black-27-inch-side-view.png',
      price: 12_000_000,
      type: 'accessory',
      category: 'monitor',
    },
    {
      name: 'Keychron K2 (Hot-swappable) - Tenkeyless',
      description: 'Keyboard mekanik nirkabel populer dengan opsi switch hot-swap.',
      imageUrl:
        'https://keychron.com.au/cdn/shop/files/Keychron-K2-hot-swappable-wireless-mechanical-keyboard-for-Mac-Windows-iOS-Gateron-switch-red-with-type-C-RGB-white-backlight-aluminum-frame.png',
      price: 1_200_000,
      type: 'accessory',
      category: 'keyboard',
    },
    {
      name: 'Razer Huntsman Mini 60%',
      description: 'Keyboard mekanik compact dengan switch opto-mechanical Razer.',
      imageUrl: 'https://assets.razerzone.com/eeimages/support/products/1689/1689-huntsmanmini.png',
      price: 1_450_000,
      type: 'accessory',
      category: 'keyboard',
    },
    {
      name: 'Logitech G502 HERO',
      description: 'Mouse gaming dengan sensor presisi tinggi dan bobot yang dapat disesuaikan.',
      imageUrl:
        'https://www.logitechg.com/content/dam/gaming/en/non-braid/hyjal-g502-hero/2025/g502-hero-mouse-top-angle-gallery-1.png',
      price: 900_000,
      type: 'accessory',
      category: 'mouse',
    },
    {
      name: 'Razer DeathAdder V2',
      description: 'Mouse ergonomis populer untuk gaming dengan sensor cepat.',
      imageUrl:
        'https://assets.razerzone.com/eeimages/support/products/1612/1612_razerdeathadderv2.png',
      price: 850_000,
      type: 'accessory',
      category: 'mouse',
    },
    {
      name: 'SteelSeries Arctis 7 (Wireless)',
      description: 'Headset nirkabel gaming dengan kenyamanan dan kualitas suara baik.',
      imageUrl: 'https://blossomzones.com/wp-content/uploads/2017/02/ARCTIS-7.png',
      price: 1_700_000,
      type: 'accessory',
      category: 'headset',
    },
    {
      name: 'HyperX Cloud II',
      description: 'Headset kabel nyaman dengan mic yang jelas dan suara seimbang.',
      imageUrl:
        'https://blog-uploads.imgix.net/2019/05/HyperX_Cloud_II-1000x750.png?auto=compress%2Cformat',
      price: 1_000_000,
      type: 'accessory',
      category: 'headset',
    },
    {
      name: 'Edifier R1280T',
      description: 'Speaker bookshelf ekonomis dengan suara jernih untuk desktop.',
      imageUrl:
        'https://edifier-online.com/cdn/shop/files/edifier-r1280t-2_be6e557e-6f4f-4a58-84cd-5afd74151809.png',
      price: 1_200_000,
      type: 'accessory',
      category: 'speaker',
    },
    {
      name: 'Razer Goliathus Extended Chroma',
      description: 'Mousepad besar dengan RGB untuk ruang kerja/gaming.',
      imageUrl: 'https://dl.razerzone.com/src2/eeimages/1395/1395_goliathusextended.png',
      price: 550_000,
      type: 'accessory',
      category: 'mouse',
    },
  ];

  console.log('delete all products...');
  await db.delete(productsTable);
  console.log('all products deleted');

  console.log('inserting products...');
  await db.insert(productsTable).values(products);
  console.log('New products created!');

  console.log('Seeding completed.');
}

main();
