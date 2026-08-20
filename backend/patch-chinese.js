const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// We will inject everything as per user instruction: prefix + exact codes.

const lastRM = "{ code: 'RM_PINEAPPLE_PIECES', name: 'Pineapple Pieces', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 }";
const rmInjection = `{ code: 'RM_PINEAPPLE_PIECES', name: 'Pineapple Pieces', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    // CHOPSUEY
    { code: 'CHOPSUEY_RM001', name: 'Z-105 TANGY COAT Premix', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'CHOPSUEY_RM002', name: 'Master Sweet & Sour Gravy', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'CHOPSUEY_RM003', name: 'Crispy Fried Noodle Nest', category: 'Chinese', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 10 },
    { code: 'CHOPSUEY_RM004', name: 'Mixed Vegetables', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'CHOPSUEY_RM005', name: 'Tomato Ketchup', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'CHOPSUEY_RM006', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'CHOPSUEY_RM007', name: 'Pineapple Pieces', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'CHOPSUEY_RM008', name: 'Egg Bullseye / Boiled Egg', category: 'Chinese', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 7 },
    { code: 'CHOPSUEY_RM009', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    
    // CHILLI
    { code: 'CHILLI_RM001', name: 'Z-102 CRYSTAL GLAZE Premix', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 280 },
    { code: 'CHILLI_RM002', name: 'Master Chilli Liquid Base', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'CHILLI_RM003', name: 'Fried Paneer / Chicken / Soya', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'CHILLI_RM004', name: 'Capsicum Cubes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'CHILLI_RM005', name: 'Onion Cubes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'CHILLI_RM006', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'CHILLI_RM007', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'CHILLI_RM008', name: 'Slit Green Chilli', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'CHILLI_RM009', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },

    // MANCHURIAN
    { code: 'MANCHURIAN_RM001', name: 'Z-101 DARK MASTER Premix', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'MANCHURIAN_RM002', name: 'Master Manchurian Liquid Base', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 140 },
    { code: 'MANCHURIAN_RM003', name: 'Fried Veg Manchurian / Chicken', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'MANCHURIAN_RM004', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'MANCHURIAN_RM005', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'MANCHURIAN_RM006', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },

    // HONEYCHILLI
    { code: 'HONEYCHILLI_RM001', name: 'Z-105 TANGY COAT Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'HONEYCHILLI_RM002', name: 'Double Fried Potato Fingers', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'HONEYCHILLI_RM003', name: 'Tomato Ketchup', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'HONEYCHILLI_RM004', name: 'Honey', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'HONEYCHILLI_RM005', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'HONEYCHILLI_RM006', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'HONEYCHILLI_RM007', name: 'Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'HONEYCHILLI_RM008', name: 'White Sesame', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'HONEYCHILLI_RM009', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'HONEYCHILLI_RM010', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },

    // HOTSOUR
    { code: 'HOTSOUR_RM001', name: 'Z-102 CRYSTAL GLAZE LIQUID', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'HOTSOUR_RM002', name: 'Mixed Soup Vegetables', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'HOTSOUR_RM003', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'HOTSOUR_RM004', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'HOTSOUR_RM005', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'HOTSOUR_RM006', name: 'Red Chilli Paste', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'HOTSOUR_RM007', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'HOTSOUR_RM008', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },

    // MANCHOW
    { code: 'MANCHOW_RM001', name: 'Z-101 DARK MASTER Liquid', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 320 },
    { code: 'MANCHOW_RM002', name: 'Mixed Soup Vegetables', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'MANCHOW_RM003', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'MANCHOW_RM004', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'MANCHOW_RM005', name: 'Fresh Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'MANCHOW_RM006', name: 'Fresh Ginger', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 140 },
    { code: 'MANCHOW_RM007', name: 'Coriander Stems', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'MANCHOW_RM008', name: 'Black Pepper', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    { code: 'MANCHOW_RM009', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'MANCHOW_RM010', name: 'Fried Noodles', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'MANCHOW_RM011', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'MANCHOW_RM012', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },

    // CHILLIOIL
    { code: 'CHILLIOIL_RM001', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'CHILLIOIL_RM002', name: 'Teja Chilli Flakes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'CHILLIOIL_RM003', name: 'Kashmiri Chilli Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 450 },
    { code: 'CHILLIOIL_RM004', name: 'Star Anise', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 1200 },
    { code: 'CHILLIOIL_RM005', name: 'Cinnamon', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    { code: 'CHILLIOIL_RM006', name: 'Salt', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },

    // GARLICOIL
    { code: 'GARLICOIL_RM001', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'GARLICOIL_RM002', name: 'Fresh Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'GARLICOIL_RM003', name: 'Salt', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },

    // MOMOS
    { code: 'MOMOS_RM001', name: 'Frozen Veg/Chicken Momos', category: 'Chinese', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 8 },
    { code: 'MOMOS_RM002', name: 'Z-106 ARMOUR BASE', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'MOMOS_RM003', name: 'Z-107 RUBY CONCENTRATE', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'MOMOS_RM004', name: 'Mayonnaise', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'MOMOS_RM005', name: 'Cornflakes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 180 },
    { code: 'MOMOS_RM006', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'MOMOS_RM007', name: 'F-302 MASTER GARLIC OIL', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },

    // UNIMANCH (Universal Manchurian Z-101)
    { code: 'UNIMANCH_RM001', name: 'Z-101 DARK MASTER Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'UNIMANCH_RM002', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'UNIMANCH_RM003', name: 'Fresh Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNIMANCH_RM004', name: 'Fresh Ginger', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 140 },
    { code: 'UNIMANCH_RM005', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'UNIMANCH_RM006', name: 'Soy Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'UNIMANCH_RM007', name: 'Red Chilli Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 90 },
    { code: 'UNIMANCH_RM008', name: 'Green Chilli Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 90 },
    { code: 'UNIMANCH_RM009', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNIMANCH_RM010', name: 'Tomato Ketchup', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNIMANCH_RM011', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'UNIMANCH_RM012', name: 'Fried Protein/Balls', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },

    // UNICHILLI (Universal Chilli Z-102)
    { code: 'UNICHILLI_RM001', name: 'Z-102 CRYSTAL GLAZE Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 280 },
    { code: 'UNICHILLI_RM002', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'UNICHILLI_RM003', name: 'Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNICHILLI_RM004', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'UNICHILLI_RM005', name: 'Soy Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'UNICHILLI_RM006', name: 'Red Chilli Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 90 },
    { code: 'UNICHILLI_RM007', name: 'Green Chilli Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 90 },
    { code: 'UNICHILLI_RM008', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNICHILLI_RM009', name: 'Tomato Ketchup', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNICHILLI_RM010', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'UNICHILLI_RM011', name: 'Capsicum Cubes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNICHILLI_RM012', name: 'Onion Cubes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'UNICHILLI_RM013', name: 'Fried Protein', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },

    // UNISCHEZWAN (Z-103)
    { code: 'UNISCHEZWAN_RM001', name: 'Z-103 RED FIRE BATCH Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'UNISCHEZWAN_RM002', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'UNISCHEZWAN_RM003', name: 'Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNISCHEZWAN_RM004', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNISCHEZWAN_RM005', name: 'Dark Soy Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 90 },
    { code: 'UNISCHEZWAN_RM006', name: 'Boiled Rice / Noodles', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNISCHEZWAN_RM007', name: 'Z-101 / Z-102 Master Liquid', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'UNISCHEZWAN_RM008', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'UNISCHEZWAN_RM009', name: 'Fried Protein', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'UNISCHEZWAN_RM010', name: 'Mixed Vegetables', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },

    // UNIWOK (Z-104)
    { code: 'UNIWOK_RM001', name: 'Z-104 VOK DUST Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'UNIWOK_RM002', name: '80% Boiled Noodles/Rice', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNIWOK_RM003', name: 'Mixed Julienne Vegetables', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'UNIWOK_RM004', name: 'Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNIWOK_RM005', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'UNIWOK_RM006', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNIWOK_RM007', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'UNIWOK_RM008', name: 'Butter', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 500 },
    { code: 'UNIWOK_RM009', name: 'Fried Chicken / Scrambled Egg', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },

    // UNIFRY (Z-106)
    { code: 'UNIFRY_RM001', name: 'Z-106 ARMOUR BASE Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'UNIFRY_RM002', name: 'Egg', category: 'Chinese', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 7 },
    { code: 'UNIFRY_RM003', name: 'Chilled Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'UNIFRY_RM004', name: 'Salt', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'UNIFRY_RM005', name: 'Ginger Garlic Paste', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNIFRY_RM006', name: 'White Pepper', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    { code: 'UNIFRY_RM007', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNIFRY_RM008', name: 'Chicken/Paneer/Mushroom', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'UNIFRY_RM009', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },

    // RUBY (Z-107)
    { code: 'RUBY_RM001', name: 'Z-107 RUBY CONCENTRATE Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RUBY_RM002', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'RUBY_RM003', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RUBY_RM004', name: 'Fresh Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 }`;

if (!content.includes('CHOPSUEY_RM001')) {
  content = content.replace(lastRM, rmInjection);
}

// --- SFG Injection ---
const lastSFG = "{ code: 'SFG_G201', name: 'G-201 SUNSET BASE', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.17 },";
const sfgInjection = `{ code: 'SFG_G201', name: 'G-201 SUNSET BASE', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.17 },
    // CHOPSUEY
    { code: 'CHOPSUEY_SFG001', name: 'Master Sweet & Sour Gravy', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.12 },
    { code: 'CHOPSUEY_SFG002', name: 'Crispy Noodle Nest', batchYield: 50, yieldUnit: 'pcs', currentStock: 50, costPerUnit: 10 },
    // CHILLI
    { code: 'CHILLI_SFG001', name: 'Master Chilli Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'CHILLI_SFG002', name: 'Fried Protein', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    // MANCHURIAN
    { code: 'MANCHURIAN_SFG001', name: 'Master Manchurian Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.14 },
    { code: 'MANCHURIAN_SFG002', name: 'Fried Manchurian Balls', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.20 },
    // HONEYCHILLI
    { code: 'HONEYCHILLI_SFG001', name: 'Double Fried Potato', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'HONEYCHILLI_SFG002', name: 'Honey Chilli Glaze Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.18 },
    // HOTSOUR
    { code: 'HOTSOUR_SFG001', name: 'Z-102 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.11 },
    { code: 'HOTSOUR_SFG002', name: 'Mixed Soup Vegetables', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.12 },
    // MANCHOW
    { code: 'MANCHOW_SFG001', name: 'Z-101 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.13 },
    { code: 'MANCHOW_SFG002', name: 'Mixed Soup Vegetables', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.12 },
    { code: 'MANCHOW_SFG003', name: 'Fried Soup Noodles', batchYield: 2000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.15 },
    // CHILLIOIL
    { code: 'CHILLIOIL_SFG001', name: 'F-301 Master Chilli Oil', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.40 },
    // GARLICOIL
    { code: 'GARLICOIL_SFG001', name: 'F-302 Master Garlic Oil', batchYield: 500, yieldUnit: 'ml', currentStock: 500, costPerUnit: 0.35 },
    // MOMOS
    { code: 'MOMOS_SFG001', name: 'Prepared Ruby Sauce', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'MOMOS_SFG002', name: 'Prepared Z-106 Batter', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.12 },
    // UNIMANCH
    { code: 'UNIMANCH_SFG001', name: 'Master Manchurian Liquid', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.14 },
    { code: 'UNIMANCH_SFG002', name: 'Fried Protein', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.20 },
    // UNICHILLI
    { code: 'UNICHILLI_SFG001', name: 'Master Chilli Liquid', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'UNICHILLI_SFG002', name: 'Fried Protein', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    // UNISCHEZWAN
    { code: 'UNISCHEZWAN_SFG001', name: 'Master Schezwan Paste', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.25 },
    { code: 'UNISCHEZWAN_SFG002', name: 'Boiled Rice / Noodles', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    // UNIWOK
    { code: 'UNIWOK_SFG001', name: '80% Boiled Noodles', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'UNIWOK_SFG002', name: '80% Boiled Rice', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    // UNIFRY
    { code: 'UNIFRY_SFG001', name: 'Prepared Batter', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.12 },
    { code: 'UNIFRY_SFG002', name: 'Pre-marinated Protein', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.30 },
    // RUBY
    { code: 'RUBY_SFG001', name: 'Prepared Momo Chutney', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.20 }`;

if (!content.includes('CHOPSUEY_SFG001')) {
  content = content.replace(lastSFG, sfgInjection);
}

// --- PT Injection ---
const ptBlockEnd = `        { sfgId: rmIds['RM_SUGAR'], quantity: 2, unit: 'gm' }
      ]
    }`;
const ptInjection = `        { sfgId: rmIds['RM_SUGAR'], quantity: 2, unit: 'gm' }
      ]
    },
    // CHOPSUEY
    {
      code: 'CHOPSUEY_PT001',
      name: 'American Chopsuey Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['CHOPSUEY_SFG001'], quantity: 350, unit: 'ml' }, // PT001 Master Gravy
        { sfgId: rmIds['CHOPSUEY_RM004'], quantity: 120, unit: 'gm' }, // PT002 Mixed Veg
        { sfgId: sfgIds['CHOPSUEY_SFG002'], quantity: 1, unit: 'pcs' }, // PT003 Crispy Noodle Nest
        { sfgId: rmIds['CHOPSUEY_RM005'], quantity: 30, unit: 'ml' }, // PT004 Tomato Ketchup
        { sfgId: rmIds['CHOPSUEY_RM006'], quantity: 45, unit: 'ml' }, // PT005 Cornflour Slurry
        { sfgId: rmIds['CHOPSUEY_RM007'], quantity: 20, unit: 'gm' }, // PT006 Pineapple
        { sfgId: rmIds['CHOPSUEY_RM008'], quantity: 1, unit: 'pcs' }, // PT007 Egg
        { sfgId: rmIds['CHOPSUEY_RM009'], quantity: 20, unit: 'ml' }, // PT008 Oil
      ]
    },
    // CHILLI DRY
    {
      code: 'CHILLI_PT001',
      name: 'Chilli Portion Dry',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['CHILLI_SFG001'], quantity: 100, unit: 'ml' }, // PT001
        { sfgId: sfgIds['CHILLI_SFG002'], quantity: 180, unit: 'gm' }, // PT002
        { sfgId: rmIds['CHILLI_RM004'], quantity: 50, unit: 'gm' }, // PT003
        { sfgId: rmIds['CHILLI_RM005'], quantity: 50, unit: 'gm' }, // PT004
        { sfgId: rmIds['CHILLI_RM006'], quantity: 10, unit: 'ml' }, // PT005
        { sfgId: rmIds['CHILLI_RM008'], quantity: 5, unit: 'gm' }, // PT006
        { sfgId: rmIds['CHILLI_RM009'], quantity: 5, unit: 'gm' }, // PT007
      ]
    },
    // CHILLI GRAVY
    {
      code: 'CHILLI_PT101',
      name: 'Chilli Portion Gravy',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['CHILLI_SFG001'], quantity: 300, unit: 'ml' }, // PT101
        { sfgId: rmIds['CHILLI_RM007'], quantity: 30, unit: 'ml' }, // PT102
        { sfgId: sfgIds['CHILLI_SFG002'], quantity: 180, unit: 'gm' }, // PT103
        { sfgId: rmIds['CHILLI_RM004'], quantity: 50, unit: 'gm' }, // PT104
        { sfgId: rmIds['CHILLI_RM005'], quantity: 50, unit: 'gm' }, // PT105
        { sfgId: rmIds['CHILLI_RM006'], quantity: 10, unit: 'ml' }, // PT106
        { sfgId: rmIds['CHILLI_RM008'], quantity: 5, unit: 'gm' }, // PT107
        { sfgId: rmIds['CHILLI_RM009'], quantity: 5, unit: 'gm' }, // PT108
      ]
    },
    // MANCHURIAN DRY
    {
      code: 'MANCHURIAN_PT001',
      name: 'Manchurian Portion Dry',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['MANCHURIAN_SFG001'], quantity: 100, unit: 'ml' }, // PT001
        { sfgId: rmIds['MANCHURIAN_RM004'], quantity: 15, unit: 'ml' }, // PT002
        { sfgId: sfgIds['MANCHURIAN_SFG002'], quantity: 180, unit: 'gm' }, // PT003
        { sfgId: rmIds['MANCHURIAN_RM005'], quantity: 10, unit: 'ml' }, // PT004
        { sfgId: rmIds['MANCHURIAN_RM006'], quantity: 5, unit: 'gm' }, // PT005
      ]
    },
    // MANCHURIAN GRAVY
    {
      code: 'MANCHURIAN_PT101',
      name: 'Manchurian Portion Gravy',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['MANCHURIAN_SFG001'], quantity: 275, unit: 'ml' }, // PT101
        { sfgId: rmIds['MANCHURIAN_RM004'], quantity: 45, unit: 'ml' }, // PT102
        { sfgId: sfgIds['MANCHURIAN_SFG002'], quantity: 180, unit: 'gm' }, // PT103
        { sfgId: rmIds['MANCHURIAN_RM005'], quantity: 10, unit: 'ml' }, // PT104
        { sfgId: rmIds['MANCHURIAN_RM006'], quantity: 5, unit: 'gm' }, // PT105
      ]
    },
    // HONEYCHILLI
    {
      code: 'HONEYCHILLI_PT001',
      name: 'Honey Chilli Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['HONEYCHILLI_SFG001'], quantity: 180, unit: 'gm' }, // PT001
        { sfgId: sfgIds['HONEYCHILLI_SFG002'], quantity: 120, unit: 'ml' }, // PT002
        { sfgId: rmIds['HONEYCHILLI_RM003'], quantity: 15, unit: 'ml' }, // PT003
        { sfgId: rmIds['HONEYCHILLI_RM004'], quantity: 15, unit: 'ml' }, // PT004
        { sfgId: rmIds['HONEYCHILLI_RM005'], quantity: 15, unit: 'ml' }, // PT005
        { sfgId: rmIds['HONEYCHILLI_RM007'], quantity: 5, unit: 'gm' }, // PT006
        { sfgId: rmIds['HONEYCHILLI_RM008'], quantity: 3, unit: 'gm' }, // PT007
        { sfgId: rmIds['HONEYCHILLI_RM009'], quantity: 5, unit: 'gm' }, // PT008
        { sfgId: rmIds['HONEYCHILLI_RM006'], quantity: 10, unit: 'ml' }, // PT009
      ]
    },
    // HOTSOUR
    {
      code: 'HOTSOUR_PT001',
      name: 'Hot Sour Soup Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['HOTSOUR_SFG001'], quantity: 120, unit: 'ml' }, // PT001
        { sfgId: rmIds['HOTSOUR_RM003'], quantity: 180, unit: 'ml' }, // PT002
        { sfgId: sfgIds['HOTSOUR_SFG002'], quantity: 40, unit: 'gm' }, // PT003
        { sfgId: rmIds['HOTSOUR_RM004'], quantity: 30, unit: 'ml' }, // PT004
        { sfgId: rmIds['HOTSOUR_RM005'], quantity: 2.5, unit: 'ml' }, // PT005
        { sfgId: rmIds['HOTSOUR_RM006'], quantity: 2, unit: 'gm' }, // PT006
        { sfgId: rmIds['HOTSOUR_RM007'], quantity: 5, unit: 'gm' }, // PT007
        { sfgId: rmIds['HOTSOUR_RM008'], quantity: 5, unit: 'ml' }, // PT008
      ]
    },
    // MANCHOW
    {
      code: 'MANCHOW_PT001',
      name: 'Manchow Soup Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['MANCHOW_SFG001'], quantity: 100, unit: 'ml' }, // PT001
        { sfgId: rmIds['MANCHOW_RM003'], quantity: 200, unit: 'ml' }, // PT002
        { sfgId: sfgIds['MANCHOW_SFG002'], quantity: 40, unit: 'gm' }, // PT003
        { sfgId: rmIds['MANCHOW_RM004'], quantity: 30, unit: 'ml' }, // PT004
        { sfgId: rmIds['MANCHOW_RM005'], quantity: 5, unit: 'gm' }, // PT005
        { sfgId: rmIds['MANCHOW_RM006'], quantity: 2, unit: 'gm' }, // PT006
        { sfgId: rmIds['MANCHOW_RM007'], quantity: 3, unit: 'gm' }, // PT007
        { sfgId: rmIds['MANCHOW_RM008'], quantity: 0.5, unit: 'gm' }, // PT008
        { sfgId: rmIds['MANCHOW_RM009'], quantity: 1, unit: 'ml' }, // PT009
        { sfgId: sfgIds['MANCHOW_SFG003'], quantity: 10, unit: 'gm' }, // PT010
        { sfgId: rmIds['MANCHOW_RM011'], quantity: 5, unit: 'gm' }, // PT011
        { sfgId: rmIds['MANCHOW_RM012'], quantity: 5, unit: 'ml' }, // PT012
      ]
    },
    // CHILLIOIL
    {
      code: 'CHILLIOIL_PT001',
      name: 'Master Chilli Oil (Soup)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['CHILLIOIL_SFG001'], quantity: 2.5, unit: 'ml' }]
    },
    {
      code: 'CHILLIOIL_PT002',
      name: 'Master Chilli Oil (Rice)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['CHILLIOIL_SFG001'], quantity: 5, unit: 'ml' }]
    },
    {
      code: 'CHILLIOIL_PT003',
      name: 'Master Chilli Oil (Momo)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['CHILLIOIL_SFG001'], quantity: 5, unit: 'ml' }]
    },
    // GARLICOIL
    {
      code: 'GARLICOIL_PT001',
      name: 'Master Garlic Oil (Rice)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['GARLICOIL_SFG001'], quantity: 15, unit: 'ml' }]
    },
    {
      code: 'GARLICOIL_PT002',
      name: 'Master Garlic Oil (Soup)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['GARLICOIL_SFG001'], quantity: 2.5, unit: 'ml' }]
    },
    {
      code: 'GARLICOIL_PT003',
      name: 'Master Garlic Oil (Dry)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['GARLICOIL_SFG001'], quantity: 5, unit: 'ml' }]
    },
    // MOMOS
    {
      code: 'MOMOS_PT001', // Steamed
      name: 'Momos Portion Steamed',
      costPerPortion: 0,
      ingredients: [
        { sfgId: rmIds['MOMOS_RM001'], quantity: 6, unit: 'pcs' },
        { sfgId: sfgIds['MOMOS_SFG001'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['MOMOS_RM007'], quantity: 2.5, unit: 'ml' },
      ]
    },
    {
      code: 'MOMOS_PT002', // Fried
      name: 'Momos Portion Fried',
      costPerPortion: 0,
      ingredients: [
        { sfgId: rmIds['MOMOS_RM001'], quantity: 6, unit: 'pcs' },
        { sfgId: sfgIds['MOMOS_SFG001'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['MOMOS_RM004'], quantity: 20, unit: 'ml' },
      ]
    },
    {
      code: 'MOMOS_PT003', // Kurkure
      name: 'Momos Portion Kurkure',
      costPerPortion: 0,
      ingredients: [
        { sfgId: rmIds['MOMOS_RM001'], quantity: 6, unit: 'pcs' },
        { sfgId: sfgIds['MOMOS_SFG002'], quantity: 25, unit: 'gm' },
        { sfgId: rmIds['MOMOS_RM005'], quantity: 20, unit: 'gm' },
        { sfgId: sfgIds['MOMOS_SFG001'], quantity: 30, unit: 'ml' },
      ]
    },
    // UNIMANCH (Z-101 Universal)
    {
      code: 'UNIMANCH_PT001',
      name: 'Uni Manchurian Dry',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNIMANCH_SFG001'], quantity: 100, unit: 'ml' },
        { sfgId: rmIds['UNIMANCH_RM011'], quantity: 15, unit: 'ml' },
        { sfgId: sfgIds['UNIMANCH_SFG002'], quantity: 180, unit: 'gm' }
      ]
    },
    {
      code: 'UNIMANCH_PT101',
      name: 'Uni Manchurian Gravy',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNIMANCH_SFG001'], quantity: 275, unit: 'ml' },
        { sfgId: rmIds['UNIMANCH_RM011'], quantity: 45, unit: 'ml' },
        { sfgId: sfgIds['UNIMANCH_SFG002'], quantity: 180, unit: 'gm' }
      ]
    },
    // UNICHILLI (Z-102 Universal)
    {
      code: 'UNICHILLI_PT001',
      name: 'Uni Chilli Dry',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNICHILLI_SFG001'], quantity: 100, unit: 'ml' },
        { sfgId: rmIds['UNICHILLI_RM010'], quantity: 15, unit: 'ml' },
        { sfgId: sfgIds['UNICHILLI_SFG002'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM011'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM012'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM002'], quantity: 10, unit: 'ml' },
      ]
    },
    {
      code: 'UNICHILLI_PT101',
      name: 'Uni Chilli Gravy',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNICHILLI_SFG001'], quantity: 300, unit: 'ml' },
        { sfgId: rmIds['UNICHILLI_RM010'], quantity: 30, unit: 'ml' },
        { sfgId: sfgIds['UNICHILLI_SFG002'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM011'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM012'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM002'], quantity: 10, unit: 'ml' },
      ]
    },
    // UNISCHEZWAN (Z-103)
    {
      code: 'UNISCHEZWAN_PT001',
      name: 'Uni Schezwan Rice',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNISCHEZWAN_SFG002'], quantity: 200, unit: 'gm' },
        { sfgId: sfgIds['UNISCHEZWAN_SFG001'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['UNISCHEZWAN_RM010'], quantity: 60, unit: 'gm' },
        { sfgId: rmIds['UNISCHEZWAN_RM002'], quantity: 15, unit: 'ml' },
      ]
    },
    {
      code: 'UNISCHEZWAN_PT101',
      name: 'Uni Schezwan Gravy',
      costPerPortion: 0,
      ingredients: [
        { sfgId: rmIds['UNISCHEZWAN_RM007'], quantity: 250, unit: 'ml' },
        { sfgId: sfgIds['UNISCHEZWAN_SFG001'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['UNISCHEZWAN_RM008'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['UNISCHEZWAN_RM009'], quantity: 180, unit: 'gm' },
      ]
    },
    // UNIWOK (Z-104)
    {
      code: 'UNIWOK_PT001',
      name: 'Uni Wok Noodles',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNIWOK_SFG001'], quantity: 200, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM003'], quantity: 60, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM004'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM001'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM006'], quantity: 5, unit: 'ml' },
        { sfgId: rmIds['UNIWOK_RM007'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['UNIWOK_RM008'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM005'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM009'], quantity: 60, unit: 'gm' }, // Optional protein
      ]
    },
    // UNIFRY (Z-106)
    {
      code: 'UNIFRY_PT001',
      name: 'Uni Fry Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNIFRY_SFG002'], quantity: 180, unit: 'gm' },
        { sfgId: sfgIds['UNIFRY_SFG001'], quantity: 60, unit: 'gm' },
        { sfgId: rmIds['UNIFRY_RM009'], quantity: 10, unit: 'ml' },
      ]
    },
    // RUBY (Z-107)
    {
      code: 'RUBY_PT001',
      name: 'Ruby Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['RUBY_SFG001'], quantity: 30, unit: 'ml' },
      ]
    }`;

if (!content.includes('CHOPSUEY_PT001')) {
  content = content.replace(ptBlockEnd, ptInjection);
}

// --- PKG Injection ---
const lastPKG = "{ code: 'PKG_PREMIUM_BOWL', name: 'Premium Deep Bowl/Handi', unit: 'pc', currentStock: 500, costPerUnit: 25 },";
const pkgInjection = `{ code: 'PKG_PREMIUM_BOWL', name: 'Premium Deep Bowl/Handi', unit: 'pc', currentStock: 500, costPerUnit: 25 },
    // CHOPSUEY
    { code: 'CHOPSUEY_PKG001', name: 'Large Shallow Bowl', unit: 'pc', currentStock: 500, costPerUnit: 25 },
    { code: 'CHOPSUEY_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'CHOPSUEY_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // CHILLI
    { code: 'CHILLI_PKG001', name: 'Chinese Bowl/Container', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'CHILLI_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'CHILLI_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // MANCHURIAN
    { code: 'MANCHURIAN_PKG001', name: 'Chinese Bowl / Container', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'MANCHURIAN_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'MANCHURIAN_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // HONEYCHILLI
    { code: 'HONEYCHILLI_PKG001', name: 'Starter Box/Bowl', unit: 'pc', currentStock: 500, costPerUnit: 12 },
    { code: 'HONEYCHILLI_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'HONEYCHILLI_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // HOTSOUR
    { code: 'HOTSOUR_PKG001', name: 'Soup Bowl', unit: 'pc', currentStock: 500, costPerUnit: 10 },
    { code: 'HOTSOUR_PKG002', name: 'Soup Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'HOTSOUR_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // MANCHOW
    { code: 'MANCHOW_PKG001', name: 'Soup Bowl', unit: 'pc', currentStock: 500, costPerUnit: 10 },
    { code: 'MANCHOW_PKG002', name: 'Soup Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'MANCHOW_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // CHILLIOIL
    { code: 'CHILLIOIL_PKG001', name: '1 L Food Grade Bottle', unit: 'pc', currentStock: 500, costPerUnit: 20 },
    { code: 'CHILLIOIL_PKG002', name: 'Batch Label', unit: 'pc', currentStock: 500, costPerUnit: 1 },
    // GARLICOIL
    { code: 'GARLICOIL_PKG001', name: '500 ml Bottle', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'GARLICOIL_PKG002', name: 'Batch Label', unit: 'pc', currentStock: 500, costPerUnit: 1 },
    // MOMOS
    { code: 'MOMOS_PKG001', name: 'Snack Box', unit: 'pc', currentStock: 500, costPerUnit: 8 },
    { code: 'MOMOS_PKG002', name: 'Sauce Cups', unit: 'pc', currentStock: 1000, costPerUnit: 2 },
    { code: 'MOMOS_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // UNIMANCH
    { code: 'UNIMANCH_PKG001', name: 'Chinese Bowl', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'UNIMANCH_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'UNIMANCH_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // UNICHILLI
    { code: 'UNICHILLI_PKG001', name: 'Chinese Bowl/Container', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'UNICHILLI_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'UNICHILLI_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // UNISCHEZWAN
    { code: 'UNISCHEZWAN_PKG001', name: 'Chinese Container', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'UNISCHEZWAN_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'UNISCHEZWAN_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // UNIWOK
    { code: 'UNIWOK_PKG001', name: 'Noodle/Rice Container', unit: 'pc', currentStock: 500, costPerUnit: 12 },
    { code: 'UNIWOK_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'UNIWOK_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // UNIFRY
    { code: 'UNIFRY_PKG001', name: 'Starter Box / Bowl', unit: 'pc', currentStock: 500, costPerUnit: 12 },
    { code: 'UNIFRY_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'UNIFRY_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // RUBY
    { code: 'RUBY_PKG001', name: '1 L Sauce Bottle / Dispenser', unit: 'pc', currentStock: 500, costPerUnit: 20 },
    { code: 'RUBY_PKG002', name: 'Batch Label', unit: 'pc', currentStock: 500, costPerUnit: 1 },`;

if (!content.includes('CHOPSUEY_PKG001')) {
  content = content.replace(lastPKG, pkgInjection);
}

// --- Dish Injection ---
const lastDish = "{ name: 'Paneer Butter Masala', category: 'Indian Veg', price: 299, packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } }";
const dishInjection = `{ name: 'Paneer Butter Masala', category: 'Indian Veg', price: 299, packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    // Chinese Dishes
    { name: 'American Chopsuey', category: 'Chinese', price: 260, packagingLogic: { takeaway: [pkgIds['CHOPSUEY_PKG001'], pkgIds['CHOPSUEY_PKG002'], pkgIds['CHOPSUEY_PKG003']], delivery: [pkgIds['CHOPSUEY_PKG001'], pkgIds['CHOPSUEY_PKG002'], pkgIds['CHOPSUEY_PKG003']], dineIn: [pkgIds['CHOPSUEY_PKG001']] } },
    { name: 'Chilli Paneer Dry', category: 'Chinese', price: 280, packagingLogic: { takeaway: [pkgIds['CHILLI_PKG001'], pkgIds['CHILLI_PKG002'], pkgIds['CHILLI_PKG003']], delivery: [pkgIds['CHILLI_PKG001'], pkgIds['CHILLI_PKG002'], pkgIds['CHILLI_PKG003']], dineIn: [pkgIds['CHILLI_PKG001']] } },
    { name: 'Chilli Paneer Gravy', category: 'Chinese', price: 290, packagingLogic: { takeaway: [pkgIds['CHILLI_PKG001'], pkgIds['CHILLI_PKG002'], pkgIds['CHILLI_PKG003']], delivery: [pkgIds['CHILLI_PKG001'], pkgIds['CHILLI_PKG002'], pkgIds['CHILLI_PKG003']], dineIn: [pkgIds['CHILLI_PKG001']] } },
    { name: 'Veg Manchurian Dry', category: 'Chinese', price: 250, packagingLogic: { takeaway: [pkgIds['MANCHURIAN_PKG001'], pkgIds['MANCHURIAN_PKG002'], pkgIds['MANCHURIAN_PKG003']], delivery: [pkgIds['MANCHURIAN_PKG001'], pkgIds['MANCHURIAN_PKG002'], pkgIds['MANCHURIAN_PKG003']], dineIn: [pkgIds['MANCHURIAN_PKG001']] } },
    { name: 'Veg Manchurian Gravy', category: 'Chinese', price: 260, packagingLogic: { takeaway: [pkgIds['MANCHURIAN_PKG001'], pkgIds['MANCHURIAN_PKG002'], pkgIds['MANCHURIAN_PKG003']], delivery: [pkgIds['MANCHURIAN_PKG001'], pkgIds['MANCHURIAN_PKG002'], pkgIds['MANCHURIAN_PKG003']], dineIn: [pkgIds['MANCHURIAN_PKG001']] } },
    { name: 'Honey Chilli Potato', category: 'Chinese', price: 240, packagingLogic: { takeaway: [pkgIds['HONEYCHILLI_PKG001'], pkgIds['HONEYCHILLI_PKG002'], pkgIds['HONEYCHILLI_PKG003']], delivery: [pkgIds['HONEYCHILLI_PKG001'], pkgIds['HONEYCHILLI_PKG002'], pkgIds['HONEYCHILLI_PKG003']], dineIn: [pkgIds['HONEYCHILLI_PKG001']] } },
    { name: 'Hot & Sour Soup Veg', category: 'Chinese', price: 150, packagingLogic: { takeaway: [pkgIds['HOTSOUR_PKG001'], pkgIds['HOTSOUR_PKG002'], pkgIds['HOTSOUR_PKG003']], delivery: [pkgIds['HOTSOUR_PKG001'], pkgIds['HOTSOUR_PKG002'], pkgIds['HOTSOUR_PKG003']], dineIn: [pkgIds['HOTSOUR_PKG001']] } },
    { name: 'Manchow Soup Veg', category: 'Chinese', price: 150, packagingLogic: { takeaway: [pkgIds['MANCHOW_PKG001'], pkgIds['MANCHOW_PKG002'], pkgIds['MANCHOW_PKG003']], delivery: [pkgIds['MANCHOW_PKG001'], pkgIds['MANCHOW_PKG002'], pkgIds['MANCHOW_PKG003']], dineIn: [pkgIds['MANCHOW_PKG001']] } },
    { name: 'Steamed Veg Momos', category: 'Chinese', price: 160, packagingLogic: { takeaway: [pkgIds['MOMOS_PKG001'], pkgIds['MOMOS_PKG002'], pkgIds['MOMOS_PKG003']], delivery: [pkgIds['MOMOS_PKG001'], pkgIds['MOMOS_PKG002'], pkgIds['MOMOS_PKG003']], dineIn: [pkgIds['MOMOS_PKG001']] } },
    { name: 'Fried Veg Momos', category: 'Chinese', price: 180, packagingLogic: { takeaway: [pkgIds['MOMOS_PKG001'], pkgIds['MOMOS_PKG002'], pkgIds['MOMOS_PKG003']], delivery: [pkgIds['MOMOS_PKG001'], pkgIds['MOMOS_PKG002'], pkgIds['MOMOS_PKG003']], dineIn: [pkgIds['MOMOS_PKG001']] } },
    { name: 'Kurkure Veg Momos', category: 'Chinese', price: 200, packagingLogic: { takeaway: [pkgIds['MOMOS_PKG001'], pkgIds['MOMOS_PKG002'], pkgIds['MOMOS_PKG003']], delivery: [pkgIds['MOMOS_PKG001'], pkgIds['MOMOS_PKG002'], pkgIds['MOMOS_PKG003']], dineIn: [pkgIds['MOMOS_PKG001']] } },
    { name: 'Schezwan Noodles Veg', category: 'Chinese', price: 230, packagingLogic: { takeaway: [pkgIds['UNISCHEZWAN_PKG001'], pkgIds['UNISCHEZWAN_PKG002'], pkgIds['UNISCHEZWAN_PKG003']], delivery: [pkgIds['UNISCHEZWAN_PKG001'], pkgIds['UNISCHEZWAN_PKG002'], pkgIds['UNISCHEZWAN_PKG003']], dineIn: [pkgIds['UNISCHEZWAN_PKG001']] } },
    { name: 'Hakka Noodles Veg', category: 'Chinese', price: 220, packagingLogic: { takeaway: [pkgIds['UNIWOK_PKG001'], pkgIds['UNIWOK_PKG002'], pkgIds['UNIWOK_PKG003']], delivery: [pkgIds['UNIWOK_PKG001'], pkgIds['UNIWOK_PKG002'], pkgIds['UNIWOK_PKG003']], dineIn: [pkgIds['UNIWOK_PKG001']] } }`;

if (!content.includes('American Chopsuey')) {
  content = content.replace(lastDish, dishInjection);
}

// --- Dish Recipe Mappings Injection ---
const lastMapping = "'Paneer Butter Masala': [{ itemModel: 'PortionMaster', code: 'PT_PANEER_BUTTER_MASALA', quantity: 1 }],";
const mappingInjection = `'Paneer Butter Masala': [{ itemModel: 'PortionMaster', code: 'PT_PANEER_BUTTER_MASALA', quantity: 1 }],
    'American Chopsuey': [{ itemModel: 'PortionMaster', code: 'CHOPSUEY_PT001', quantity: 1 }],
    'Chilli Paneer Dry': [{ itemModel: 'PortionMaster', code: 'CHILLI_PT001', quantity: 1 }],
    'Chilli Paneer Gravy': [{ itemModel: 'PortionMaster', code: 'CHILLI_PT101', quantity: 1 }],
    'Veg Manchurian Dry': [{ itemModel: 'PortionMaster', code: 'MANCHURIAN_PT001', quantity: 1 }],
    'Veg Manchurian Gravy': [{ itemModel: 'PortionMaster', code: 'MANCHURIAN_PT101', quantity: 1 }],
    'Honey Chilli Potato': [{ itemModel: 'PortionMaster', code: 'HONEYCHILLI_PT001', quantity: 1 }],
    'Hot & Sour Soup Veg': [{ itemModel: 'PortionMaster', code: 'HOTSOUR_PT001', quantity: 1 }],
    'Manchow Soup Veg': [{ itemModel: 'PortionMaster', code: 'MANCHOW_PT001', quantity: 1 }],
    'Steamed Veg Momos': [{ itemModel: 'PortionMaster', code: 'MOMOS_PT001', quantity: 1 }],
    'Fried Veg Momos': [{ itemModel: 'PortionMaster', code: 'MOMOS_PT002', quantity: 1 }],
    'Kurkure Veg Momos': [{ itemModel: 'PortionMaster', code: 'MOMOS_PT003', quantity: 1 }],
    'Schezwan Noodles Veg': [{ itemModel: 'PortionMaster', code: 'UNISCHEZWAN_PT001', quantity: 1 }],
    'Hakka Noodles Veg': [{ itemModel: 'PortionMaster', code: 'UNIWOK_PT001', quantity: 1 }],`;

if (!content.includes("'American Chopsuey':")) {
  content = content.replace(lastMapping, mappingInjection);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Chinese patch applied successfully!');
