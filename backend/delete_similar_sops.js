require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const titlesToDelete = [
    'S-301 COASTAL CRUST',
    'S-302 YELLOW TEMPER',
    'S-304 CRUNCH CORE',
    'S-305 STEAM CLOUD',
    'S-307 KERALA KERNEL',
    'S-308 LENTIL LAVA',
    'MASTER CAFE-STYLE BURGER ASSEMBLY',
    'MASTER CAFE-STYLE SANDWICH — C-500 SERIES',
    'MASTER PIZZA ASSEMBLY & BAKING (C-500 SERIES)',
    'MASTER PIZZA ASSEMBLY BAKING',
    'PREMIUM CAFE-STYLE WRAPS & ROLLS — C-500 SERIES',
    'SHAHI LUCKNOWI BIRYANI'
  ];
  
  // I also noticed "SHAHI LUCKNOWI BIRYANI" and "SHAHI LUCKNOWI BIRYANI SOP" in the DB.
  // And "MASTER PIZZA ASSEMBLY & BAKING (C-500 SERIES)", "MASTER PIZZA ASSEMBLY BAKING", "MASTER PIZZA ASSEMBLY & BAKING — C-500 SERIES"
  // Let me find out all titles containing 'C-500' or similar duplicates.
  
  const allSops = await mongoose.connection.collection('sops').find({}).toArray();
  const allTitles = allSops.map(s => s.title);
  
  const toDelete = [];
  
  // Custom cleanup based on the DB dump we saw earlier:
  const duplicates = [
    'S-301 COASTAL CRUST',
    'S-302 YELLOW TEMPER',
    'S-304 CRUNCH CORE',
    'S-305 STEAM CLOUD',
    'S-307 KERALA KERNEL',
    'S-308 LENTIL LAVA',
    
    // We have "SHAHI LUCKNOWI BIRYANI" (from Architecture) and "SHAHI LUCKNOWI BIRYANI SOP" (from Biryani)
    'SHAHI LUCKNOWI BIRYANI',
    
    // We have "PREMIUM CAFE-STYLE WRAPS & ROLLS (C-500 SERIES)" and "PREMIUM CAFE-STYLE WRAPS & ROLLS — C-500 SERIES"
    'PREMIUM CAFE-STYLE WRAPS & ROLLS — C-500 SERIES',
    
    // We have "MASTER PIZZA ASSEMBLY & BAKING (C-500 SERIES)" and "MASTER PIZZA ASSEMBLY & BAKING — C-500 SERIES" and "MASTER PIZZA ASSEMBLY BAKING"
    'MASTER PIZZA ASSEMBLY & BAKING — C-500 SERIES',
    'MASTER PIZZA ASSEMBLY BAKING',
    
    // We have "MASTER CAFE-STYLE SANDWICH — C-500 SERIES" (maybe another duplicate)
    'KYROZ+ OPERATIONAL MANUAL: ALOO MASALA (STUFFING) (KY/SOP/ALU-03)',
    'KYROZ+ OPERATIONAL MANUAL: INSTANT COCONUT CHUTNEY (KY/SOP/CHT-04)',
    'KYROZ+ OPERATIONAL MANUAL: INSTANT DOSA (KY/SOP/DOSA-01)',
    'KYROZ+ OPERATIONAL MANUAL: INSTANT MEDU VADA (KY/SOP/VADA-07)',
    'KYROZ+ OPERATIONAL MANUAL: INSTANT RED (KARA) CHUTNEY (KY/SOP/CHT-05)',
    'KYROZ+ OPERATIONAL MANUAL: INSTANT RICE IDLI (KY/SOP/IDL-06)',
    'KYROZ+ OPERATIONAL MANUAL: MIX-VEG UTTAPAM (KY/SOP/UTP-09)',
    'KYROZ+ OPERATIONAL MANUAL: ONION RAVA DOSA (KY/SOP/RAVA-08)',
    'KYROZ+ OPERATIONAL MANUAL: PREMIUM SAMBHAR (KY/SOP/SAM-02)'
  ];

  const result = await mongoose.connection.collection('sops').deleteMany({ title: { $in: duplicates } });
  console.log('Deleted similar named SOPs:', result.deletedCount);
  
  process.exit(0);
});
