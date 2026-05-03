const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/kyroz';
const USER_ID = '69f5e3b052f7bf6a6d934ef4';

const SopSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  category: String,
  contentEn: String,
  contentHi: String,
}, { timestamps: true });

const Sop = mongoose.model('Sop', SopSchema);

const sops = [
  {
    title: "CORN PALAK CHEESE",
    category: "Dish",
    contentEn: `Portion: 300g\nGravy Mix: Green Gravy (70%) + White Gravy (30%)\n\nINITIAL SETUP:\nFlame: Medium (Avoid high heat to prevent discoloration of spinach)\nBase: 1 tbsp Butter\nReheating: Add 30ml water or milk (Milk helps retain green color)\n\nCOOKING PROCESS:\nHeat butter and add ginger-garlic paste with finely chopped green chili.\nAdd 2 ladles of green gravy and 1 ladle of white gravy.\nAdd boiled sweet corn and paneer cubes (approx. 50g).\nAdd a pinch of garam masala and chaat masala (avoid red chili powder).\nAdd grated cheese and mix until completely melted.\n\nFINISHING:\nGravy should be smooth, thick, and velvety.\nAdd 1 tbsp fresh cream and a pinch of sugar to balance bitterness.\nCook on low flame for 30 seconds and switch off.\n\nGARNISH:\nGrated cheese on top\nSweet corn kernels\nCream swirl\n\nTROUBLESHOOTING:\nIf color turns dark → Avoid high flame; add white gravy to balance.\nIf gravy is too thin → Add cheese or grated paneer.\n\nTIP:\nThis is a mild and creamy dish. Ensure corn and cheese are present in every bite.`,
    contentHi: `प्रारंभिक तैयारी:\nआंच: मध्यम रखें (तेज़ आंच पर पालक का रंग काला हो सकता है)\nबेस: 1 बड़ा चम्मच मक्खन\nरीहीटिंग: 30ml पानी या दूध डालें (दूध से हरा रंग बना रहता है)\n\nपकाने की प्रक्रिया:\nमक्खन गरम करें और उसमें अदरक-लहसुन पेस्ट तथा बारीक कटी हरी मिर्च डालें।\n2 करछी ग्रीन ग्रेवी और 1 करछी व्हाइट ग्रेवी मिलाएँ।\nउबला हुआ स्वीट कॉर्न और लगभग 50 ग्राम पनीर के टुकड़े डालें।\nथोड़ा गरम मसाला और चाट मसाला डालें (लाल मिर्च न डालें)।\nकद्दूकस किया हुआ चीज डालकर पूरी तरह घुलने तक मिलाएँ।\n\nअंतिम चरण:\nग्रेवी मुलायम, गाढ़ी और क्रीमी होनी चाहिए।\n1 बड़ा चम्मच फ्रेश क्रीम और एक चुटकी चीनी डालें।\nधीमी आंच पर 30 सेकंड पकाकर गैस बंद करें।\n\nसजावट:\nऊपर से कद्दूकस किया हुआ चीज\nस्वीट कॉर्न के दाने\nक्रीम का डिजाइन\n\nसमस्या समाधान:\nअगर रंग काला हो जाए → तेज आंच से बचें और व्हाइट ग्रेवी मिलाएँ।\nअगर ग्रेवी पतली हो → चीज या पनीर डालकर गाढ़ी करें।\n\nटिप:\nयह डिश हल्की और क्रीमी होती है। हर बाइट में कॉर्न और चीज होना चाहिए।`
  },
  {
    title: "LEHSUNI PANEER",
    category: "Dish",
    contentEn: `Portion: 300g\nGravy Mix: Green (80%) + White (20%)\n\nINITIAL SETUP:\nFlame: Medium to High\nBase: 1 tbsp oil + 1 tsp ghee\nReheating: 30–40ml water\n\nCOOKING PROCESS:\nHeat oil and ghee, then add finely chopped garlic.\nCook until garlic turns golden brown (do not burn).\nAdd ginger-garlic paste and green chili.\nAdd green gravy and white gravy.\nAdd garam masala and chaat masala.\nAdd paneer cubes and cook for 1 minute.\n\nFINISHING:\nAdd fresh cream and kasuri methi.\nOptional: Add garlic tadka for stronger flavor.\n\nGARNISH:\nFried garlic\nCream swirl\nWhole dry red chili\n\nTROUBLESHOOTING:\nIf garlic tastes bitter → it is overcooked/burnt.\nIf flavor is weak → add a few drops of lemon juice.\n\nTIP:\nGarlic aroma should be strong and noticeable throughout the dish.`,
    contentHi: `प्रारंभिक तैयारी:\nआंच: मध्यम से तेज\nबेस: 1 बड़ा चम्मच तेल + 1 छोटा चम्मच घी\nरीहीटिंग: 30–40ml पानी\n\nपकाने की प्रक्रिया:\nतेल और घी गरम करें, फिर बारीक कटा हुआ लहसुन डालें।\nलहसुन को सुनहरा होने तक भूनें (जलने न दें)।\nअदरक-लहसुन पेस्ट और हरी मिर्च डालें।\nग्रीन ग्रेवी और व्हाइट ग्रेवी मिलाएँ।\nगरम मसाला और चाट मसाला डालें।\nपनीर के टुकड़े डालकर 1 मिनट तक पकाएँ।\n\nअंतिम चरण:\nफ्रेश क्रीम और कसूरी मेथी डालें।\nअधिक स्वाद के लिए ऊपर से लहसुन का तड़का डाल सकते हैं।\n\nसजावट:\nतला हुआ लहसुन\nक्रीम डिजाइन\nसाबुत सूखी लाल मिर्च\n\nसमस्या समाधान:\nअगर लहसुन कड़वा लगे → वह जल गया है।\nअगर स्वाद हल्का लगे → थोड़ा नींबू का रस डालें।\n\nटिप:\nइस डिश में लहसुन की खुशबू प्रमुख होनी चाहिए।`
  },
  {
    title: "MALAI KOFTA RED",
    category: "Dish",
    contentEn: `Portion: 300g\nGravy Mix: Makhni (60%) + White (40%)\n\nINITIAL SETUP:\nFlame: Low to Medium\nBase: 1 tbsp butter + 1/2 tsp oil\nReheating: 40–50ml water\n\nCOOKING PROCESS:\nHeat butter and add ginger-garlic paste.\nAdd makhni gravy and white gravy.\nAdd Kashmiri red chili and garam masala.\nAdd a small amount of sugar or honey.\nDo not cook kofta in gravy.\n\nFINISHING:\nGravy should be smooth, thick, and velvety.\nAdd fresh cream and kasuri methi.\nCook until butter starts releasing.\n\nGARNISH:\nPlace koftas on top of gravy.\nAdd cream design and coriander.\n\nTROUBLESHOOTING:\nIf gravy is too tangy → add cream or white gravy.\nIf kofta breaks → add only during serving.\n\nTIP:\nFocus on silky and rich gravy texture.`,
    contentHi: `प्रारंभिक तैयारी:\nआंच: धीमी से मध्यम\nबेस: 1 बड़ा चम्मच मक्खन + 1/2 छोटा चम्मच तेल\nरीहीटिंग: 40–50ml पानी\n\nपकाने की प्रक्रिया:\nमक्खन गरम करें और अदरक-लहसुन पेस्ट डालें।\nमखनी और व्हाइट ग्रेवी मिलाएँ।\nकश्मीरी लाल मिर्च और गरम मसाला डालें।\nथोड़ी चीनी या शहद मिलाएँ।\nकोफ्ते को ग्रेवी में न पकाएँ।\n\nअंतिम चरण:\nग्रेवी मुलायम, गाढ़ी और क्रीमी होनी चाहिए।\nफ्रेश क्रीम और कसूरी मेथी डालें।\nजब मक्खन अलग दिखने लगे तब गैस बंद करें।\n\nसजावट:\nकोफ्ते को ऊपर रखें।\nक्रीम और धनिया से सजाएँ।\n\nसमस्या समाधान:\nग्रेवी खट्टी हो → क्रीम या व्हाइट ग्रेवी डालें।\nकोफ्ता टूटे → सर्व करते समय ही डालें।\n\nटिप:\nग्रेवी को रेशमी और समृद्ध रखें।`
  },
  {
    title: "MUSHROOM DO PYAZA",
    category: "Dish",
    contentEn: `INITIAL SETUP:\nFlame: High\nBase: Oil + butter\n\nCOOKING PROCESS:\nSauté onion cubes and mushrooms on high flame.\nAdd ginger-garlic paste and green chili.\nAdd kadhai gravy and curry base.\nAdd spices and mix well.\n\nFINISHING:\nKeep semi-dry consistency.\nAdd curd or cream.\nQuick high flame cooking.\n\nGARNISH:\nCoriander and ginger juliennes.\n\nTROUBLESHOOTING:\nMushrooms soggy → cook on high flame.\nToo spicy → add butter.\n\nTIP:\nOnion should remain slightly crunchy.`,
    contentHi: `प्रारंभिक तैयारी:\nआंच: तेज\nबेस: तेल और मक्खन\n\nपकाने की प्रक्रिया:\nप्याज और मशरूम को तेज आंच पर भूनें।\nअदरक-लहसुन और हरी मिर्च डालें।\nकढ़ाई ग्रेवी और करी बेस मिलाएँ।\nमसाले डालकर अच्छे से मिलाएँ।\n\nअंतिम चरण:\nडिश को सेमी-ड्राई रखें।\nदही या क्रीम डालें।\nतेज आंच पर जल्दी पकाएँ।\n\nसजावट:\nधनिया और अदरक से सजाएँ।\n\nसमस्या समाधान:\nमशरूम नरम हो जाए → तेज आंच पर पकाएँ।\nबहुत तीखा हो → मक्खन डालें।\n\nटिप:\nप्याज हल्का कुरकुरा रहना चाहिए।`
  },
  {
    title: "PANEER DHANIA ADRAKI",
    category: "Dish",
    contentEn: `INITIAL SETUP:\nFlame: Medium to High\nBase: Oil + ghee\n\nCOOKING PROCESS:\nAdd ginger juliennes and ginger-garlic paste.\nAdd curry base and white gravy.\nAdd fresh coriander.\nAdd spices and paneer cubes.\n\nFINISHING:\nKeep semi-thick consistency.\nAdd cream and kasuri methi.\n\nGARNISH:\nFresh coriander and ginger.\n\nTROUBLESHOOTING:\nGinger bitter → avoid burning.\nToo spicy → add cream.\n\nTIP:\nEvery bite should have ginger and coriander flavor.`,
    contentHi: `प्रारंभिक तैयारी:\nआंच: मध्यम से तेज\nबेस: तेल और घी\n\nपकाने की प्रक्रिया:\nअदरक और अदरक-लहसुन पेस्ट डालें।\nकरी बेस और व्हाइट ग्रेवी मिलाएँ।\nताजा धनिया डालें।\nमसाले और पनीर डालें।\n\nअंतिम चरण:\nग्रेवी हल्की गाढ़ी रखें।\nक्रीम और कसूरी मेथी डालें।\n\nसजावट:\nधनिया और अदरक से सजाएँ।\n\nसमस्या समाधान:\nअदरक कड़वा लगे → जलने न दें।\nज्यादा तीखा हो → क्रीम डालें।\n\nटिप:\nहर बाइट में अदरक और धनिया का स्वाद होना चाहिए।`
  },
  {
    title: "PANEER LABABDAR",
    category: "Dish",
    contentEn: `INITIAL SETUP:\nFlame: Medium\nBase: Butter + oil\n\nCOOKING PROCESS:\nAdd ginger and coriander.\nAdd makhni gravy and curry base.\nAdd paneer cubes.\nAdd spices.\n\nFINISHING:\nSemi-thick consistency.\nAdd cream and kasuri methi.\n\nGARNISH:\nCream and grated paneer.\n\nTROUBLESHOOTING:\nToo sweet → add curry base.\nColor dull → add butter.\n\nTIP:\nGravy should coat paneer, not flow.`,
    contentHi: `प्रारंभिक तैयारी:\nआंच: मध्यम\nबेस: मक्खन और तेल\n\nपकाने की प्रक्रिया:\nअदरक और धनिया डालें।\nमखनी और करी बेस मिलाएँ।\nपनीर डालें।\nमसाले डालें।\n\nअंतिम चरण:\nग्रेवी हल्की गाढ़ी रखें।\nक्रीम और कसूरी मेथी डालें।\n\nसजावट:\nक्रीम और कद्दूकस पनीर।\n\nसमस्या समाधान:\nबहुत मीठा हो → करी बेस डालें।\nरंग फीका हो → मक्खन डालें।\n\nटिप:\nग्रेवी पनीर पर चिपकी होनी चाहिए।`
  },
  {
    title: "PANEER PASANDA",
    category: "Dish",
    contentEn: `INITIAL SETUP:\nFlame: Low to Medium\nBase: Butter + oil\n\nCOOKING PROCESS:\nPrepare stuffed paneer sandwiches.\nAdd ginger-garlic paste.\nAdd white gravy and makhni gravy.\nAdd paneer carefully.\n\nFINISHING:\nVelvety consistency.\nAdd curd or cream.\n\nGARNISH:\nGrated paneer and cream.\n\nTROUBLESHOOTING:\nToo sweet → add chaat masala.\nCurdling → lower flame.\n\nTIP:\nHandle paneer gently.`,
    contentHi: `प्रारंभिक तैयारी:\nआंच: धीमी से मध्यम\nबेस: मक्खन और तेल\n\nपकाने की प्रक्रिया:\nस्टफ्ड पनीर तैयार करें।\nअदरक-लहसुन डालें।\nव्हाइट और मखनी ग्रेवी मिलाएँ।\nपनीर धीरे से डालें।\n\nअंतिम चरण:\nग्रेवी मुलायम और क्रीमी रखें।\nदही या क्रीम डालें।\n\nसजावट:\nकद्दूकस पनीर और क्रीम।\n\nसमस्या समाधान:\nबहुत मीठा हो → चाट मसाला डालें।\nफट जाए → आंच कम करें।\n\nटिप:\nपनीर को धीरे संभालें।`
  },
  {
    title: "PANCH RATAN CURRY",
    category: "Dish",
    contentEn: `INITIAL SETUP:\nFlame: Medium to High\nBase: Ghee + butter\n\nCOOKING PROCESS:\nRoast makhana, paneer, mushrooms, corn, peas.\nAdd triple gravy mix.\nAdd spices.\n\nFINISHING:\nRich semi-thick gravy.\nAdd cream and saffron milk.\nAdd slight sweetness.\n\nGARNISH:\nPomegranate, cashew, cream.\n\nTROUBLESHOOTING:\nMakhana soft → roast properly.\nColor dull → add butter.\n\nTIP:\nAll 5 ingredients must be visible.`,
    contentHi: `प्रारंभिक तैयारी:\nआंच: मध्यम से तेज\nबेस: घी और मक्खन\n\nपकाने की प्रक्रिया:\nमखाना, पनीर, मशरूम, कॉर्न, मटर भूनें।\nतीनों ग्रेवी मिलाएँ।\nमसाले डालें।\n\nअंतिम चरण:\nगाढ़ी और रिच ग्रेवी रखें।\nक्रीम और केसर डालें।\nहल्की मिठास रखें।\n\nसजावट:\nअनार, काजू, क्रीम।\n\nसमस्या समाधान:\nमखाना नरम हो → सही से भूनें।\nरंग फीका हो → मक्खन डालें।\n\nटिप:\nपांचों सामग्री दिखनी चाहिए।`
  },
  {
    title: "VEG HANDI",
    category: "Dish",
    contentEn: `INITIAL SETUP:\nFlame: Medium to High\nBase: Butter + oil\n\nCOOKING PROCESS:\nAdd vegetables and paneer.\nAdd multiple gravies.\nAdd spices and curd.\n\nFINISHING:\nMedium thick consistency.\nAdd cream and kasuri methi.\n\nGARNISH:\nButter, coriander, cream.\n\nTROUBLESHOOTING:\nMessy texture → add kadhai masala.\nDark color → add cream.\n\nTIP:\nDo not over-mix vegetables.`,
    contentHi: `प्रारंभिक तैयारी:\nआंच: मध्यम से तेज\nबेस: मक्खन और तेल\n\nपकाने की प्रक्रिया:\nसब्जियां और पनीर डालें।\nतीनों ग्रेवी मिलाएँ।\nमसाले और दही डालें।\n\nअंतिम चरण:\nमध्यम गाढ़ी ग्रेवी रखें।\nक्रीम और कसूरी मेथी डालें।\n\nसजावट:\nमक्खन, धनिया, क्रीम।\n\nसमस्या समाधान:\nटेक्सचर खराब हो → कढ़ाई मसाला डालें।\nरंग काला हो → क्रीम डालें।\n\nटिप:\nसब्जियों को ज्यादा न मिलाएं।`
  },
  {
    title: "VEG JALFREZI",
    category: "Dish",
    contentEn: `INITIAL SETUP:\nFlame: High\nBase: Oil\n\nCOOKING PROCESS:\nSauté vegetables and paneer.\nAdd gravy mix.\nAdd curd and spices.\n\nFINISHING:\nSemi-dry consistency.\nAdd sugar and vinegar.\n\nGARNISH:\nGinger and coriander.\n\nTROUBLESHOOTING:\nVeggies mushy → cook on high flame.\nToo dry → add curry base.\n\nTIP:\nKeep vegetables crunchy.`,
    contentHi: `प्रारंभिक तैयारी:\nआंच: तेज\nबेस: तेल\n\nपकाने की प्रक्रिया:\nसब्जियां और पनीर भूनें।\nग्रेवी मिलाएँ।\nदही और मसाले डालें।\n\nअंतिम चरण:\nसेमी-ड्राई रखें।\nचीनी और सिरका डालें।\n\nसजावट:\nअदरक और धनिया।\n\nसमस्या समाधान:\nसब्जियां नरम हो → तेज आंच पर पकाएँ।\nसूखी लगे → करी बेस डालें।\n\nटिप:\nसब्जियां कुरकुरी रहनी चाहिए।`
  }
];

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to MongoDB for seeding...');
  
  for (const sopData of sops) {
    await Sop.findOneAndUpdate(
      { title: sopData.title, userId: USER_ID },
      { ...sopData, userId: USER_ID },
      { upsert: true, new: true }
    );
    console.log(`Seeded SOP: ${sopData.title}`);
  }

  console.log('Seeding complete!');
  process.exit(0);
}).catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
