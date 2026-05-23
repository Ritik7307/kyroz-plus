import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

const biryaniSops = [
  {
    title: 'INDO ARABIC WHITE MANDI SOP',
    category: 'Mandi/Biryani',
    contentEn: `1. Preparation
Batch Size: 1 kg Chicken/Mutton + 1 kg Rice
Kit: B-404 A (Meat Marination) + B-404 B (White Rice Mix)

Ingredients

1 kg Chicken or Mutton
1 kg Long Grain Basmati Rice or Sella Rice
40g Ginger-Garlic Paste
Juice of 2 lemons
5–6 Green Chillies
2 finely chopped onions
30 ml Oil
2–3 litres Water

Rice Preparation

Soak Long Grain Basmati rice for 30 minutes.
Soak Sella rice for 1 to 1.5 hours.

Meat Preparation

Make deep cuts on the meat pieces for proper marination.

2. Meat Marination

In a bowl, mix:
B-404 A
40g Ginger-Garlic Paste
Juice of 2 lemons
30 ml Oil
Apply this paste evenly on the meat.
Marinate:
Chicken: 1 hour
Mutton: 2 hours

3. Steam Cooking & Stock Preparation

Boil 2–3 litres water in a large vessel.
Place a steamer or strainer above the vessel.
Put marinated meat in the steamer.
Cover and cook on low flame until meat becomes tender:
Chicken: 30–45 minutes
Mutton: 1–1.5 hours
Check in between.

Important Rule

Do NOT discard the liquid collected below.
This meat juice stock will be used for rice cooking.

4. Rice Cooking

Heat 150 ml oil in another large vessel.
Add chopped onions and cook until soft pink.
Do NOT brown the onions.
Add B-404 B and sauté for 10–15 seconds.
Add measured meat stock.
Liquid quantity should be double the rice quantity.
Once boiling starts, add:
Split green chillies
Soaked rice
Cook until water is absorbed.
Give dum (covered steam cooking) for 15 minutes.

5. Finishing & Presentation
Meat Fry

Lightly fry the steamed meat in a pan with a little oil for 2 minutes.
Meat should become slightly crispy and orange from outside.

Serving

First place white mandi rice on the serving plate.
Arrange fried meat on top.

Smoky Flavor (Dhungar)

Place a burning coal in a small bowl inside the pot.
Pour a little ghee over it.
Cover for 5 minutes.

Serving Sides

Red chutney (Sahawek)
Kachumber salad
Fried almonds
Raisins
Barista (fried onions)

6. Troubleshooting

Rice turning yellow or dull: Onions were overcooked or stock was too dark. Cook onions less and use cleaner stock.
Meat hard: Steam longer next time.
Salt balance issue: Taste the stock before adding rice. It should taste slightly salty for perfect rice.

7. Presentation Checklist

Rice grains should be separate and white.
Meat should be crispy outside and juicy inside.
Smoky aroma should be present.
Side chutney should be fresh and spicy.`,
    contentHi: `1. तैयारी
बैच साइज़: 1 किलो चिकन/मटन + 1 किलो चावल
किट: B-404 A (Meat Marination) + B-404 B (White Rice Mix)

सामग्री

1 किलो चिकन या मटन
1 किलो Long Grain Basmati या Sella चावल
40g अदरक-लहसुन पेस्ट
2 नींबू का रस
5–6 हरी मिर्च
2 बारीक कटे प्याज
30 ml तेल
2–3 लीटर पानी

चावल तैयारी

Long Grain Basmati को 30 मिनट भिगोएं।
Sella चावल को 1 से 1.5 घंटे भिगोएं।

मीट तैयारी

मीट पर गहरे कट लगाएं ताकि मसाला अंदर तक जाए।

2. मीट मेरिनेशन

एक बाउल में मिलाएं:
B-404 A
40g अदरक-लहसुन पेस्ट
2 नींबू का रस
30 ml तेल
इस मिश्रण को मीट पर अच्छी तरह लगाएं।
मेरिनेट करें:
चिकन: 1 घंटा
मटन: 2 घंटे

3. स्टीम कुकिंग और स्टॉक तैयारी

बड़े बर्तन में 2–3 लीटर पानी उबालें।
ऊपर steamer या छलनी रखें।
मेरिनेट किया हुआ मीट उसमें रखें।
ढककर धीमी आंच पर पकाएं:
चिकन: 30–45 मिनट
मटन: 1–1.5 घंटे
बीच-बीच में चेक करें।

महत्वपूर्ण नियम

नीचे जमा liquid को बिल्कुल न फेंकें।
यही meat stock चावल बनाने में इस्तेमाल होगा।

4. चावल बनाने की प्रक्रिया

दूसरे बर्तन में 150 ml तेल गरम करें।
कटे प्याज डालें और हल्का गुलाबी होने तक पकाएं।
प्याज को भूरा न करें।
B-404 B डालकर 10–15 सेकंड भूनें।
Meat stock डालें।
Liquid मात्रा चावल की मात्रा से दोगुनी होनी चाहिए।
उबाल आने पर डालें:
चीरी हुई हरी मिर्च
भीगे हुए चावल
पानी सूखने तक पकाएं।
15 मिनट दम दें।

5. फिनिशिंग और सर्विंग
मीट फ्राई

Steamed meat को थोड़ा तेल डालकर 2 मिनट हल्का fry करें।
बाहर से crispy और orange दिखना चाहिए।

सर्विंग

प्लेट में पहले सफेद मंडी चावल रखें।
ऊपर fried meat रखें।

Smoky Flavor (धुंगर)

बर्तन में छोटे कटोरे में जलता कोयला रखें।
ऊपर थोड़ा घी डालें।
5 मिनट ढक दें।

साइड्स

लाल चटनी (Sahawek)
कचुंबर सलाद
तले बादाम
किशमिश
फ्राइड प्याज (Barista)

6. समस्या समाधान

चावल पीले या फीके हो रहे हैं: प्याज ज्यादा पक गए या stock dark था। प्याज कम पकाएं।
मीट सख्त है: अगली बार ज्यादा steam करें।
नमक सही नहीं है: चावल डालने से पहले stock चखें। थोड़ा नमकीन होना चाहिए।

7. प्रेजेंटेशन चेकलिस्ट

चावल का हर दाना अलग और सफेद होना चाहिए।
मीट बाहर से crispy और अंदर से juicy होना चाहिए।
Smoky खुशबू आनी चाहिए।
साइड चटनी ताजी और तीखी होनी चाहिए।`
  },
  {
    title: 'SHAHI LUCKNOWI BIRYANI SOP',
    category: 'Mandi/Biryani',
    contentEn: `1. Preparation
Batch Size: 1 kg Chicken + 1 kg Rice
Formula: 150g Curd + 250g Ghee/Oil + 50 ml Milk
Premix: 1 Full Packet B-401 ROYAL AWADH

Ingredients

1 kg Chicken (large pieces)
1 kg Long Grain Basmati Rice
200g Onion (for birista)
150g Curd (not too sour)
40g Fresh Ginger-Garlic Paste
250g Ghee or Oil
50 ml Milk
100–150 ml Water

Rice Preparation

Clean and soak basmati rice for 30 minutes.

Chicken Preparation

Wash chicken and drain excess water.

Birista Preparation

Thinly slice 200g onions.
Fry until golden brown.
Keep aside.

2. Yakhni Preparation (Base Gravy)

Heat 250g ghee or oil in a large vessel.
Add ginger-garlic paste and sauté for 30 seconds on medium flame.
Add 1 full packet B-401 ROYAL AWADH.
Sauté for another 30 seconds.
Add:
Chicken
Curd
50% of fried onions
Cook on high flame for 3–4 minutes until oil starts separating.
Add 100–150 ml water.
Cover and cook on low flame until chicken is 80% cooked.

Important Check

Chicken should become tender but should not fall off the bone.

3. Final Yakhni Rule

Before dum, some gravy should remain at the bottom.
Do NOT dry the gravy completely.
Remove 70–100 ml surface oil/ghee (rogan) and keep aside for final layering.

4. Rice Cooking

Boil 5–6 litres water in a large vessel.
Add:
40g Salt (approx. 2 large spoons)
2 Bay leaves
1 Black cardamom
4 Green cardamoms
7–8 Cloves
10–15 Black peppercorns
2 pieces cinnamon (1 inch each)
15 ml Oil
Juice of 1 lemon
Add soaked rice.
Cook until 70% done.

Kani Test

When pressed by hand, rice should break into 3 pieces.
Drain immediately.

5. Dum Process (Final Cooking)
Layering

Spread the partially cooked rice evenly over the yakhni.

Aroma Mix
Mix:

50 ml Milk
Saffron color
3 drops sweet attar
1 spoon kewra water
Pour this aroma mix over the rice.
Add the reserved rogan (oil/ghee).
Sprinkle remaining fried onions.

6. Dum Cooking

Seal the vessel with cloth or dough.
Cook:
5 minutes on high flame
Then place tawa underneath
15–20 minutes on very low flame

7. Troubleshooting

Salt issue: If yakhni tastes strongly salty, biryani will be balanced. If it tastes normal, add 2g more salt.
Burning smell: Switch off flame immediately and cool the vessel bottom with water.
Wet biryani: After dum, open lid and allow steam to escape for 5 minutes.`,
    contentHi: `1. तैयारी
बैच साइज़: 1 किलो चिकन + 1 किलो चावल
फॉर्मूला: 150g दही + 250g घी/तेल + 50 ml दूध
प्रीमिक्स: 1 पूरा पैकेट B-401 ROYAL AWADH

सामग्री

1 किलो चिकन (बड़े टुकड़े)
1 किलो Long Grain Basmati चावल
200g प्याज (बिरिस्ता के लिए)
150g दही (ज्यादा खट्टा नहीं)
40g ताजा अदरक-लहसुन पेस्ट
250g घी या तेल
50 ml दूध
100–150 ml पानी

चावल तैयारी

चावल साफ करके 30 मिनट भिगोएं।

चिकन तैयारी

चिकन धोकर अतिरिक्त पानी निकाल दें।

बिरिस्ता तैयारी

200g प्याज पतले काटें।
सुनहरा भूरा तलें।
अलग रखें।

2. यखनी तैयारी (बेस ग्रेवी)

बड़े बर्तन में 250g घी या तेल गरम करें।
अदरक-लहसुन पेस्ट डालकर medium flame पर 30 सेकंड भूनें।
1 पूरा पैकेट B-401 ROYAL AWADH डालें।
30 सेकंड और भूनें।
अब डालें:
चिकन
दही
50% फ्राइड प्याज
तेज आंच पर 3–4 मिनट पकाएं जब तक तेल ऊपर न दिखे।
100–150 ml पानी डालें।
ढककर धीमी आंच पर चिकन को 80% पकाएं।

महत्वपूर्ण जांच

चिकन नरम होना चाहिए लेकिन हड्डी से अलग नहीं होना चाहिए।

3. अंतिम यखनी नियम

दम से पहले नीचे थोड़ी ग्रेवी रहनी चाहिए।
ग्रेवी पूरी तरह सूखनी नहीं चाहिए।
ऊपर का 70–100 ml तेल/घी (रोगन) निकालकर अलग रखें।

4. चावल पकाना

बड़े बर्तन में 5–6 लीटर पानी उबालें।
इसमें डालें:
40g नमक (लगभग 2 बड़े चम्मच)
2 तेज पत्ता
1 बड़ी इलायची
4 छोटी इलायची
7–8 लौंग
10–15 काली मिर्च
2 दालचीनी टुकड़े (1 inch)
15 ml तेल
1 नींबू का रस
भीगे चावल डालें।
70% पकने तक उबालें।

कनी टेस्ट

हाथ से दबाने पर चावल 3 टुकड़ों में टूटना चाहिए।
तुरंत छान लें।

5. दम प्रक्रिया
Layering

आधे पके चावल यखनी के ऊपर समान रूप से फैलाएं।

Aroma Mix
मिलाएं:

50 ml दूध
केसर रंग
3 बूंद मीठा अत्तर
1 चम्मच केवड़ा जल
यह मिश्रण चावल पर डालें।
अलग रखा रोगन डालें।
बचा हुआ फ्राइड प्याज ऊपर छिड़कें।

6. दम कुकिंग

बर्तन को कपड़े या आटे से सील करें।
पकाएं:
5 मिनट तेज आंच
फिर नीचे तवा रखें
15–20 मिनट धीमी आंच

7. समस्या समाधान

नमक समस्या: यदि यखनी ज्यादा नमकीन लगे तो बिरयानी संतुलित बनेगी। सामान्य लगे तो 2g नमक और डालें।
जलने की गंध: तुरंत गैस बंद करें और बर्तन के नीचे ठंडा पानी लगाएं।
गीली बिरयानी: दम के बाद ढक्कन खोलकर 5 मिनट भाप निकलने दें।`
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    for (const sop of biryaniSops) {
      await MasterSop.findOneAndUpdate(
        { title: sop.title },
        sop,
        { upsert: true, new: true }
      );
      console.log(`Upserted: ${sop.title}`);
    }

    console.log(`Successfully seeded ${biryaniSops.length} ACTUAL Global SOPs for Mandi/Biryani.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
