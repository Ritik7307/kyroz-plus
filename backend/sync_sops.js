const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/kyroz';

const SopSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  category: String,
  contentEn: String,
  contentHi: String,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const Sop = mongoose.model('Sop', SopSchema);
const User = mongoose.model('User', UserSchema);

const masterSops = [
  {
    title: "CORN PALAK CHEESE",
    category: "Dish",
    contentEn: `Portion: 300g
Gravy Mix: Green Gravy (70%) + White Gravy (30%)

INITIAL SETUP:
Flame: Medium (Avoid high heat to prevent discoloration of spinach)
Base: 1 tbsp Butter
Reheating: Add 30ml water or milk (Milk helps retain green color)

COOKING PROCESS:
Heat butter and add ginger-garlic paste with finely chopped green chili.
Add 2 ladles of green gravy and 1 ladle of white gravy.
Add boiled sweet corn and paneer cubes (approx. 50g).
Add a pinch of garam masala and chaat masala (avoid red chili powder).
Add grated cheese and mix until completely melted.

FINISHING:
Gravy should be smooth, thick, and velvety.
Add 1 tbsp fresh cream and a pinch of sugar to balance bitterness.
Cook on low flame for 30 seconds and switch off.

GARNISH:
Grated cheese on top
Sweet corn kernels
Cream swirl

TROUBLESHOOTING:
If color turns dark -> Avoid high flame; add white gravy to balance.
If gravy is too thin -> Add cheese or grated paneer.

TIP:
This is a mild and creamy dish. Ensure corn and cheese are present in every bite.`,
    contentHi: `पोर्शन: 300g
ग्रेवी मिक्स: ग्रीन ग्रेवी (70%) + व्हाइट ग्रेवी (30%)

प्रारंभिक तैयारी:
आंच: मध्यम रखें (तेज़ आंच पर पालक का रंग काला हो सकता है)
बेस: 1 बड़ा चम्मच मक्खन
रीहीटिंग: 30ml पानी या दूध डालें (दूध से हरा रंग बना रहता है)

पकाने की प्रक्रिया:
मक्खन गरम करें और उसमें अदरक-लहसुन पेस्ट तथा बारीक कटी हरी मिर्च डालें।
2 करछी ग्रीन ग्रेवी और 1 करछी व्हाइट ग्रेवी मिलाएँ।
उबला हुआ स्वीट कॉर्न और लगभग 50 ग्राम पनीर के टुकड़े डालें।
थोड़ा गरम मसाला और चाट मसाला डालें (लाल मिर्च न डालें)।
कद्दूकस किया हुआ चीज डालकर पूरी तरह घुलने तक मिलाएँ।

अंतिम चरण:
ग्रेवी मुलायम, गाढ़ी और क्रीमी होनी चाहिए।
1 बड़ा चम्मच फ्रेश क्रीम और एक चुटकी चीनी डालें।
धीमी आंच पर 30 सेकंड पकाकर गैस बंद करें।

सजावट:
ऊपर से कद्दूकस किया हुआ चीज
स्वीट कॉर्न के दाने
क्रीम का डिजाइन

समस्या समाधान:
अगर रंग काला हो जाए -> तेज आंच से बचें और व्हाइट ग्रेवी मिलाएँ।
अगर ग्रेवी पतली हो -> चीज या पनीर डालकर गाढ़ी करें।

टिप:
यह डिश हल्की और क्रीमी होती है। हर बाइट में कॉर्न और चीज होना चाहिए।`
  },
  {
    title: "LEHSUNI PANEER",
    category: "Dish",
    contentEn: `Portion: 300g
Gravy Mix: Green (80%) + White (20%)

INITIAL SETUP:
Flame: Medium to High
Base: 1 tbsp oil + 1 tsp ghee
Reheating: 30–40ml water

COOKING PROCESS:
Heat oil and ghee, then add finely chopped garlic.
Cook until garlic turns golden brown (do not burn).
Add ginger-garlic paste and green chili.
Add green gravy and white gravy.
Add garam masala and chaat masala.
Add paneer cubes and cook for 1 minute.

FINISHING:
Add fresh cream and kasuri methi.
Optional: Add garlic tadka for stronger flavor.

GARNISH:
Fried garlic
Cream swirl
Whole dry red chili

TROUBLESHOOTING:
If garlic tastes bitter -> it is overcooked/burnt.
If flavor is weak -> add a few drops of lemon juice.

TIP:
Garlic aroma should be strong and noticeable throughout the dish.`,
    contentHi: `प्रारंभिक तैयारी:
आंच: मध्यम से तेज
बेस: 1 बड़ा चम्मच तेल + 1 छोटा चम्मच घी
रीहीटिंग: 30–40ml पानी

पकाने की प्रक्रिया:
तेल और घी गरम करें, फिर बारीक कटा हुआ लहसुन डालें।
लहसुन को सुनहरा होने तक भूनें (जलने न दें)।
अदरक-लहसुन पेस्ट और हरी मिर्च डालें।
ग्रीन ग्रेवी और व्हाइट ग्रेवी मिलाएँ।
गरम मसाला और चाट मसाला डालें।
पनीर के टुकड़े डालकर 1 मिनट तक पकाएँ।

अंतिम चरण:
फ्रेश क्रीम और कसूरी मेथी डालें।
अधिक स्वाद के लिए ऊपर से लहसुन का तड़का डाल सकते हैं।

सजावट:
तला हुआ लहसुन
क्रीम डिजाइन
साबुत सूखी लाल मिर्च

समस्या समाधान:
अगर लहसुन कड़वा लगे -> वह जल गया है।
अगर स्वाद हल्का लगे -> थोड़ा नींबू का रस डालें।

टिप:
इस डिश में लहसुन की खुशबू प्रमुख होनी चाहिए।`
  },
  {
    title: "MALAI KOFTA RED",
    category: "Dish",
    contentEn: `Portion: 300g
Gravy Mix: Makhni (60%) + White (40%)

INITIAL SETUP:
Flame: Low to Medium
Base: 1 tbsp butter + 1/2 tsp oil
Reheating: 40–50ml water

COOKING PROCESS:
Heat butter and add ginger-garlic paste.
Add makhni gravy and white gravy.
Add Kashmiri red chili and garam masala.
Add a small amount of sugar or honey.
Do not cook kofta in gravy.

FINISHING:
Gravy should be smooth, thick, and velvety.
Add fresh cream and kasuri methi.
Cook until butter starts releasing.

GARNISH:
Place koftas on top of gravy.
Add cream design and coriander.

TROUBLESHOOTING:
If gravy is too tangy -> add cream or white gravy.
If kofta breaks -> add only during serving.

TIP:
Focus on silky and rich gravy texture.`,
    contentHi: `प्रारंभिक तैयारी:
आंच: धीमी से मध्यम
बेस: 1 बड़ा चम्मच मक्खन + 1/2 छोटा चम्मच तेल
रीहीटिंग: 40–50ml पानी

पकाने की प्रक्रिया:
मक्खन गरम करें और अदरक-लहसुन पेस्ट डालें।
मखनी और व्हाइट ग्रेवी मिलाएँ।
कश्मीरी लाल मिर्च और गरम मसाला डालें।
थोड़ी चीनी या शहद मिलाएँ।
कोफ्ते को ग्रेवी में न पकाएँ।

अंतिम चरण:
ग्रेवी मुलायम, गाढ़ी और क्रीमी होनी चाहिए।
फ्रेश क्रीम और कसूरी मेथी डालें।
जब मक्खन अलग दिखने लगे तब गैस बंद करें।

सजावट:
कोफ्ते को ऊपर रखें।
क्रीम और धनिया से सजाएँ।

समस्या समाधान:
ग्रेवी खट्टी हो -> क्रीम या व्हाइट ग्रेवी डालें।
कोफ्ता टूटे -> सर्व करते समय ही डालें।

टिप:
ग्रेवी को रेशमी और समृद्ध रखें।`
  },
  {
    title: "MUSHROOM DO PYAZA",
    category: "Dish",
    contentEn: `INITIAL SETUP:
Flame: High
Base: Oil + butter

COOKING PROCESS:
Sauté onion cubes and mushrooms on high flame.
Add ginger-garlic paste and green chili.
Add kadhai gravy and curry base.
Add spices and mix well.

FINISHING:
Keep semi-dry consistency.
Add curd or cream.
Quick high flame cooking.

GARNISH:
Coriander and ginger juliennes.

TROUBLESHOOTING:
Mushrooms soggy -> cook on high flame.
Too spicy -> add butter.

TIP:
Onion should remain slightly crunchy.`,
    contentHi: `प्रारंभिक तैयारी:
आंच: तेज
बेस: तेल और मक्खन

पकाने की प्रक्रिया:
प्याज और मशरूम को तेज आंच पर भूनें।
अदरक-लहसुन और हरी मिर्च डालें।
कढ़ाई ग्रेवी और करी बेस मिलाएँ।
मसाले डालकर अच्छे से मिलाएँ।

अंतिम चरण:
डिश को सेमी-ड्राई रखें।
दही या क्रीम डालें।
तेज आंच पर जल्दी पकाएँ।

सजावट:
धनिया और अदरक से सजाएँ।

समस्या समाधान:
मशरूम नरम हो जाए -> तेज आंच पर पकाएँ।
बहुत तीखा हो -> मक्खन डालें।

टिप:
प्याज हल्का कुरकुरा रहना चाहिए।`
  },
  {
    title: "PANEER DHANIA ADRAKI",
    category: "Dish",
    contentEn: `INITIAL SETUP:
Flame: Medium to High
Base: Oil + ghee

COOKING PROCESS:
Add ginger juliennes and ginger-garlic paste.
Add curry base and white gravy.
Add fresh coriander.
Add spices and paneer cubes.

FINISHING:
Keep semi-thick consistency.
Add cream and kasuri methi.

GARNISH:
Fresh coriander and ginger.

TROUBLESHOOTING:
Ginger bitter -> avoid burning.
Too spicy -> add cream.

TIP:
Every bite should have ginger and coriander flavor.`,
    contentHi: `प्रारंभिक तैयारी:
आंच: मध्यम से तेज
बेस: तेल और घी

पकाने की प्रक्रिया:
अदरक और अदरक-लहसुन पेस्ट डालें।
करी बेस और व्हाइट ग्रेवी मिलाएँ।
ताजा धनिया डालें।
मसाले और पनीर डालें।

अंतिम चरण:
ग्रेवी हल्की गाढ़ी रखें।
क्रीम और कसूरी मेथी डालें।

सजावट:
धनिया और अदरक से सजाएँ।

समस्या समाधान:
अदरक कड़वा लगे -> जलने न दें।
ज्यादा तीखा हो -> क्रीम डालें।

टिप:
हर बाइट में अदरक और धनिया का स्वाद होना चाहिए।`
  },
  {
    title: "PANEER LABABDAR",
    category: "Dish",
    contentEn: `INITIAL SETUP:
Flame: Medium
Base: Butter + oil

COOKING PROCESS:
Add ginger and coriander.
Add makhni gravy and curry base.
Add paneer cubes.
Add spices.

FINISHING:
Semi-thick consistency.
Add cream and kasuri methi.

GARNISH:
Cream and grated paneer.

TROUBLESHOOTING:
Too sweet -> add curry base.
Color dull -> add butter.

TIP:
Gravy should coat paneer, not flow.`,
    contentHi: `प्रारंभिक तैयारी:
आंच: मध्यम
बेस: मक्खन और तेल

पकाने की प्रक्रिया:
अदरक और धनिया डालें।
मखनी और करी बेस मिलाएँ।
पनीर डालें।
मसाले डालें।

अंतिम चरण:
ग्रेवी हल्की गाढ़ी रखें।
क्रीम और कसूरी मेथी डालें।

सजावट:
क्रीम और कद्दूकस पनीर।

समस्या समाधान:
बहुत मीठा हो -> करी बेस डालें।
रंग फीका हो -> मक्खन डालें।

टिप:
ग्रेवी पनीर पर चिपकी होनी चाहिए।`
  },
  {
    title: "PANEER PASANDA",
    category: "Dish",
    contentEn: `INITIAL SETUP:
Flame: Low to Medium
Base: Butter + oil

COOKING PROCESS:
Prepare stuffed paneer sandwiches.
Add ginger-garlic paste.
Add white gravy and makhni gravy.
Add paneer carefully.

FINISHING:
Velvety consistency.
Add curd or cream.

GARNISH:
Grated paneer and cream.

TROUBLESHOOTING:
Too sweet -> add chaat masala.
Curdling -> lower flame.

TIP:
Handle paneer gently.`,
    contentHi: `प्रारंभिक तैयारी:
आंच: धीमी से मध्यम
बेस: मक्खन और तेल

पकाने की प्रक्रिया:
स्टफ्ड पनीर तैयार करें।
अदरक-लहसुन डालें।
व्हाइट और मखनी ग्रेवी मिलाएँ।
पनीर धीरे से डालें।

अंतिम चरण:
ग्रेवी मुलायम और क्रीमी रखें।
दही या क्रीम डालें।

सजावट:
कद्दूकस पनीर और क्रीम।

समस्या समाधान:
बहुत मीठा हो -> चाट मसाला डालें।
फट जाए -> आंच कम करें।

टिप:
पनीर को धीरे संभालें।`
  },
  {
    title: "PANCH RATAN CURRY",
    category: "Dish",
    contentEn: `INITIAL SETUP:
Flame: Medium to High
Base: Ghee + butter

COOKING PROCESS:
Roast makhana, paneer, mushrooms, corn, peas.
Add triple gravy mix.
Add spices.

FINISHING:
Rich semi-thick gravy.
Add cream and saffron milk.
Add slight sweetness.

GARNISH:
Pomegranate, cashew, cream.

TROUBLESHOOTING:
Makhana soft -> roast properly.
Color dull -> add butter.

TIP:
All 5 ingredients must be visible.`,
    contentHi: `प्रारंभिक तैयारी:
आंच: मध्यम से तेज
बेस: घी और मक्खन

पकाने की प्रक्रिया:
मखाना, पनीर, मशरूम, कॉर्न, मटर भूनें।
तीनों ग्रेवी मिलाएँ।
मसाले डालें।

अंतिम चरण:
गाढ़ी और रिच ग्रेवी रखें।
क्रीम और केसर डालें।
हल्की मिठास रखें।

सजावट:
अनार, काजू, क्रीम।

समस्या समाधान:
मखाना नरम हो -> सही से भूनें।
रंग फीका हो -> मक्खन डालें।

टिप:
पांचों सामग्री दिखनी चाहिए।`
  },
  {
    title: "VEG HANDI",
    category: "Dish",
    contentEn: `INITIAL SETUP:
Flame: Medium to High
Base: Butter + oil

COOKING PROCESS:
Add vegetables and paneer.
Add multiple gravies.
Add spices and curd.

FINISHING:
Medium thick consistency.
Add cream and kasuri methi.

GARNISH:
Butter, coriander, cream.

TROUBLESHOOTING:
Messy texture -> add kadhai masala.
Dark color -> add cream.

TIP:
Do not over-mix vegetables.`,
    contentHi: `प्रारंभिक तैयारी:
आंच: मध्यम से तेज
बेस: मक्खन और तेल

पकाने की प्रक्रिया:
सब्जियां और पनीर डालें।
तीनों ग्रेवी मिलाएँ।
मसाले और दही डालें।

अंतिम चरण:
मध्यम गाढ़ी ग्रेवी रखें।
क्रीम और कसूरी मेथी डालें।

सजावट:
मक्खन, धनिया, क्रीम।

समस्या समाधान:
टेक्सचर खराब हो -> कढ़ाई मसाला डालें।
रंग काला हो -> क्रीम डालें।

टिप:
सब्जियों को ज्यादा न मिलाएं।`
  },
  {
    title: "VEG JALFREZI",
    category: "Dish",
    contentEn: `INITIAL SETUP:
Flame: High
Base: Oil

COOKING PROCESS:
Sauté vegetables and paneer.
Add gravy mix.
Add curd and spices.

FINISHING:
Semi-dry consistency.
Add sugar and vinegar.

GARNISH:
Ginger and coriander.

TROUBLESHOOTING:
Veggies mushy -> cook on high flame.
Too dry -> add curry base.

TIP:
Keep vegetables crunchy.`,
    contentHi: `प्रारंभिक तैयारी:
आंच: तेज
बेस: तेल

पकाने की प्रक्रिया:
सब्जियां और पनीर भूनें।
ग्रेवी मिलाएँ।
दही और मसाले डालें।

अंतिम चरण:
सेमी-ड्राई रखें।
चीनी और सिरका डालें।

सजावट:
अदरक और धनिया।

समस्या समाधान:
सब्जियां नरम हो -> तेज आंच पर पकाएँ।
सूखी लगे -> करी बेस डालें।

टिप:
सब्जियां कुरकुरी रहनी चाहिए।`
  }
];

mongoose.connect(MONGO_URI).then(async () => {
  const users = await User.find();
  console.log(`Starting massive sync for ${users.length} users...`);

  for (const user of users) {
    for (const sopData of masterSops) {
      await Sop.findOneAndUpdate(
        { title: sopData.title, userId: user._id },
        { ...sopData, userId: user._id },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Synced ${masterSops.length} SOPs for: ${user.email}`);
  }
  
  console.log('--- MASSIVE SYNC COMPLETE ---');
  process.exit(0);
}).catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
