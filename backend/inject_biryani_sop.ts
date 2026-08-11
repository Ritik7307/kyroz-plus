import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import Sop from './src/models/Sop';

dotenv.config();

const contentEn = `SOP: SHAHI LUCKNOWI BIRYANI (MASTER METHOD)

Batch Size: 1 kg Chicken + 1 kg Rice

For 15 kg: Multiply the quantities proportionally according to the required batch size.

Formula: 150 g Yogurt + 250 g Ghee/Oil + 50 ml Milk

1. PREPARATION

Rice:
Clean 1 kg long-grain Basmati rice and soak it in water for 0.5 hour (30 minutes).

Chicken:
Wash 1 kg chicken (large pieces) and keep it in a strainer to drain out excess water.

Onion (Birista):
Finely slice 200 g onions, fry them until golden brown, and keep them aside.

Yogurt:
Use 150 g yogurt. The yogurt should not be too sour.

Ginger-Garlic Paste:
Use 40 g freshly ground ginger-garlic paste.

KYROZ Premix:
Use 1 full packet of B-401 ROYAL AWADH.

2. COOKING THE YAKHNI (THE BASE)

Step 1 - Ghee/Oil:
Heat 250 g Ghee/Oil in a large cooking vessel.

Step 2 - Bhunai:
Add the ginger-garlic paste to the hot oil and sauté for 30 seconds on medium heat. Then add 1 packet of B-401 and sauté for another 30 seconds.

Now add the chicken, yogurt, and 50% of the fried brown onions. Sauté on high heat for 3-4 minutes until the ghee/oil becomes visible on top.

Step 3 - Cooking:
Add 100-150 ml water. Cover the vessel and cook on low heat until the chicken is approximately 80% cooked.

Check: The meat should become tender but should not separate from the bone.

Step 4 - Final Yakhni:
Before giving dum, check that a small amount of Shorba (gravy) remains at the bottom.

Remove approximately 70-100 ml Rogan (the oil/ghee visible on top).

The gravy must not become completely dry.

3. COOKING THE RICE

Step 1 - Water:
Boil 5-6 litres of water in a large vessel.

Step 2 - Salt and Whole Spices:
Add the following to the boiling water:

40 g (2 tablespoons) Salt
2 Bay Leaves
1 Large Cardamom
4 Small Cardamoms
7-8 Cloves
10-15 Black Peppercorns
2 pieces of 1-inch Cinnamon
15 ml Oil
Juice of 1 Lemon

Step 3 - Kani Check:
Add the soaked rice. When the rice is approximately 70% cooked, immediately drain it.

Check: When pressed by hand, the rice grain should break into 3 pieces.

4. GIVING DUM (FINAL TOUCH)

Step 1 - Layering:
Spread the boiled rice evenly over the yakhni to form an even layer.

Step 2 - Aroma Mix:
In a bowl, mix:

50 ml Milk
Saffron Colour
3 drops Meetha Attar
1 teaspoon Kewra

Pour this mixture evenly over the rice. At the same time, add the Rogan that was removed from the yakhni.

Step 3 - Garnish:
Sprinkle the remaining fried brown onions evenly over the top.

Step 4 - Dum Timing:
Seal the vessel properly using a cloth or dough.

First, keep it on high heat for 5 minutes.

Then place a Tawa underneath the vessel.

Cook on very low heat (Sim) for 15-20 minutes.

TROUBLESHOOTING / HELPER SAFETY

1. SALT

If the Yakhni tastes slightly sharp or salty when checked, the final biryani should have the correct salt level.

If the salt tastes perfectly balanced in the Yakhni, add 2 g additional salt.

2. PREVENTING BURNING

If you notice even a slight burning smell from the vessel, immediately turn off the gas and cool the bottom of the vessel by applying cold water externally.

3. WET BIRYANI

If the rice feels too wet after dum, remove the lid and leave the biryani uncovered for 5 minutes to allow excess steam to escape.

MASTER FORMULA

Chicken: 1 kg
Basmati Rice: 1 kg
Yogurt: 150 g
Ghee/Oil: 250 g
Milk: 50 ml
Onion for Birista: 200 g
Ginger-Garlic Paste: 40 g
KYROZ B-401 ROYAL AWADH: 1 Packet
Water for Yakhni: 100-150 ml
Rogan to Remove: 70-100 ml
Rice Boiling Water: 5-6 Litres
Salt: 40 g + adjustment as required
Oil in Rice Water: 15 ml
Lemon: 1
Meetha Attar: 3 drops
Kewra: 1 teaspoon`;

const contentHi = `एसओपी: शाही लखनवी बिरयानी (मास्टर मेथड)

बैच साइज: 1 किलो चिकन + 1 किलो चावल

15 किलो के लिए: सभी सामग्री की मात्रा को आवश्यक बैच साइज के अनुसार उसी अनुपात में बढ़ाएं।

फॉर्मूला: 150 ग्राम दही + 250 ग्राम घी/तेल + 50 मिली दूध

1. तैयारी

चावल:
1 किलो लंबे दाने वाले बासमती चावल को साफ करके 0.5 घंटे (30 मिनट) के लिए पानी में भिगो दें।

चिकन:
1 किलो चिकन (बड़े पीस) को धोकर छलनी में रखें ताकि अतिरिक्त पानी निकल जाए।

प्याज़ (बिरिस्ता):
200 ग्राम बारीक कटे प्याज़ को सुनहरा भूरा होने तक फ्राई करके अलग रख लें।

दही:
150 ग्राम दही लें। दही ज्यादा खट्टा नहीं होना चाहिए।

अदरक-लहसुन पेस्ट:
40 ग्राम ताज़ा पिसा हुआ अदरक-लहसुन पेस्ट लें।

KYROZ प्रीमिक्स:
B-401 ROYAL AWADH का 1 पूरा पैकेट इस्तेमाल करें.

2. यखनी पकाना (बेस तैयार करना)

स्टेप 1 - घी/तेल:
एक बड़े भगोने में 250 ग्राम घी/तेल गरम करें।

स्टेप 2 - भुनाई:
गरम तेल में अदरक-लहसुन का पेस्ट डालकर मध्यम आंच पर 30 सेकंड भूनें। इसके बाद B-401 का 1 पैकेट डालकर इसे भी 30 सेकंड तक भूनें।

अब चिकन, दही और 50% ब्राउन किए हुए प्याज़ डालें। तेज़ आंच पर 3-4 मिनट तक भूनें, जब तक ऊपर घी/तेल दिखाई देने न लगे।

स्टेप 3 - पकाना:
अब इसमें 100-150 मिली पानी डालें। ढक्कन लगाकर हल्की आंच पर चिकन को लगभग 80% तक पकाएं।

चेक: मांस हड्डी से अलग नहीं होना चाहिए, केवल नरम होना चाहिए।

स्टेप 4 - अंतिम यखनी:
दम देने से पहले चेक करें कि नीचे थोड़ा शोरबा (ग्रेवी) बचा हुआ हो।

इसमें से लगभग 70-100 मिली रोगन (ऊपर दिखाई देने वाला तेल/घी) निकाल लें।

ग्रेवी पूरी तरह सूखनी नहीं चाहिए.

3. चावल उबालना

स्टेप 1 - पानी:
एक बड़े बर्तन में 5-6 लीटर पानी उबालें।

स्टेप 2 - नमक और साबुत मसाले:
उबलते पानी में निम्न सामग्री डालें:

40 ग्राम (2 बड़े चम्मच) नमक
2 तेज पत्ते
1 बड़ी इलायची
4 छोटी इलायची
7-8 लौंग
10-15 काली मिर्च
1 इंच दालचीनी के 2 टुकड़े
15 मिली तेल
1 नींबू का रस

स्टेप 3 - कनी चेक:
भीगे हुए चावल डालें। जब चावल लगभग 70% पक जाए, तो तुरंत चावल छान लें।

चेक: हाथ से दबाने पर चावल का दाना 3 टुकड़ों में टूटना चाहिए.

4. दम देना (अंतिम प्रक्रिया)

स्टेप 1 - लेयरिंग:
यखनी के ऊपर उबले हुए चावल की एक समान लेयर लगाएं।

स्टेप 2 - अरोमा मिक्स:
एक कटोरी में मिलाएं:

50 मिली दूध
केसर रंग
3 बूंद मीठा अत्तर
1 चम्मच केवड़ा

इस मिश्रण को चावल के ऊपर समान रूप से डालें। इसी समय यखनी से निकाला हुआ रोगन भी डाल दें।

स्टेप 3 - गार्निश:
बचे हुए ब्राउन किए हुए प्याज़ को ऊपर से समान रूप से डालें।

स्टेप 4 - दम का समय:
भगोने को कपड़े या आटे से अच्छी तरह सील करें।

पहले 5 मिनट तेज़ आंच पर रखें।

फिर भगोने के नीचे तवा रखें।

इसके बाद 15-20 मिनट बहुत हल्की आंच (सिम) पर दम दें.

समस्या समाधान / हेल्पर के लिए सावधानियां

1. नमक

अगर यखनी चखने पर नमक थोड़ा चटकीला या तेज़ लग रहा है, तो तैयार बिरयानी में नमक का स्तर सही रहेगा।

अगर यखनी में नमक बिल्कुल सही लग रहा है, तो 2 ग्राम अतिरिक्त नमक डालें.

2. जलने से बचाव

अगर भगोने से हल्की भी जलने की महक आए, तो तुरंत गैस बंद कर दें और भगोने के नीचे बाहर की तरफ ठंडा पानी लगाकर उसे ठंडा करें.

3. गीली बिरयानी

अगर दम के बाद चावल ज्यादा गीला लगे, तो ढक्कन हटाकर बिरयानी को 5 मिनट खुला रखें ताकि अतिरिक्त भाप निकल सके.

मास्टर फॉर्मूला

चिकन: 1 किलो
बासमती चावल: 1 किलो
दही: 150 ग्राम
घी/तेल: 250 ग्राम
दूध: 50 मिली
बिरिस्ता के लिए प्याज़: 200 ग्राम
अदरक-लहसुन पेस्ट: 40 ग्राम
KYROZ B-401 ROYAL AWADH: 1 पैकेट
यखनी के लिए पानी: 100-150 मिली
निकालने वाला रोगन: 70-100 मिली
चावल उबालने का पानी: 5-6 लीटर
नमक: 40 ग्राम + आवश्यकता के अनुसार समायोजन
चावल के पानी में तेल: 15 मिली
नींबू: 1
मीठा अत्तर: 3 बूंद
केवड़ा: 1 चम्मच`;

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string || 'mongodb://127.0.0.1:27017/kyroz');
    const user = await User.findOne();
    if (!user) throw new Error('No user found');
    const userId = user._id;

    console.log('Injecting SHAHI LUCKNOWI BIRYANI SOP...');
    
    // Add to MasterSop (if it exists)
    try {
      const MasterSopSchema = new mongoose.Schema({
        title: String,
        category: String,
        contentEn: String,
        contentHi: String,
        isInventoryLinked: Boolean,
        platesPerPacket: Number
      }, { collection: 'mastersops' });
      const MasterSop = mongoose.models.MasterSop || mongoose.model('MasterSop', MasterSopSchema);
      
      await MasterSop.findOneAndUpdate(
        { title: 'SHAHI LUCKNOWI BIRYANI (MASTER METHOD)' },
        {
          title: 'SHAHI LUCKNOWI BIRYANI (MASTER METHOD)',
          category: 'Biryani',
          contentEn,
          contentHi,
          isInventoryLinked: true,
          platesPerPacket: 15 // Roughly based on 1kg chicken + 1kg rice = ~15 plates
        },
        { upsert: true, new: true }
      );
      console.log('Added to MasterSop.');
    } catch(e: any) {
      console.log('MasterSop model/collection might not exist or failed:', e.message);
    }

    // Add to User's Sop
    await Sop.findOneAndUpdate(
      { title: 'SHAHI LUCKNOWI BIRYANI (MASTER METHOD)', userId },
      {
        title: 'SHAHI LUCKNOWI BIRYANI (MASTER METHOD)',
        category: 'Biryani',
        contentEn,
        contentHi,
        userId,
      },
      { upsert: true, new: true }
    );
    
    console.log('Added to User SOP collection successfully.');

    // Rerun RAG vector ingestion if backfill script is available
    console.log('Triggering AI ingestion...');
    try {
      const { processSopText } = require('./src/services/ai/ingestion.service');
      await processSopText(userId.toString(), `SOP: SHAHI LUCKNOWI BIRYANI (MASTER METHOD)\n\n${contentEn}`, 'en');
      await processSopText(userId.toString(), `SOP: SHAHI LUCKNOWI BIRYANI (MASTER METHOD)\n\n${contentHi}`, 'hi');
      console.log('AI ingestion complete.');
    } catch(e: any) {
      console.log('AI ingestion failed or skipped:', e.message);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
