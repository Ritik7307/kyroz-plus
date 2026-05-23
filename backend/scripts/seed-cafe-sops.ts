import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

const cafeSops = [
  {
    title: 'BURGER SAUCE & DIP SOP',
    category: 'Cafe',
    contentEn: '1. Classic Burger Sauce\n\nRatio: 200g Mayonnaise + 100g Ketchup + 30g C-503 VELVET GLAZE\nResult: Creates a classic orange burger sauce similar to McDonald’s or Burger King style.\n\n2. Tandoori Burger Sauce\n\nRatio: 300g Mayonnaise + 50g C-503 VELVET GLAZE + 10g Red Chilli Powder\nImportant Note: Do NOT add ketchup.\nResult: Gives a tandoori paneer burger style flavor.\n\n3. Cheesy Garlic Dip\n\nRatio: 250g Mayonnaise + 30g C-503 VELVET GLAZE + 50g Liquid Cheese\nBest used for garlic bread and snacks.\n\n4. Preparation Method\n\nTake a clean plastic or glass bowl.\nAdd measured mayonnaise and ketchup (if required as per recipe).\nAdd C-503 VELVET GLAZE premix.\nMix thoroughly using a whisk or spoon until there are no lumps.\nRefrigerate the prepared sauce for 20 minutes before use.\nThis helps the spices hydrate properly and develops the final color and taste.\n\n5. Storage Instructions\n\nAlways store prepared sauce in the refrigerator.\nAvoid using dirty spoons inside the container to prevent cross-contamination.\nKeep container tightly closed.\n\n6. Troubleshooting\n\nToo salty: Add a little more mayonnaise.\nSauce too thin: Use extra thick veg mayonnaise.\nColor too light: Increase premix by 5g or add 1 spoon extra ketchup.',
    contentHi: '1. क्लासिक बर्गर सॉस\n\nअनुपात: 200g मेयोनीज़ + 100g केचप + 30g C-503 VELVET GLAZE\nपरिणाम: McDonald’s या Burger King जैसी क्लासिक ऑरेंज बर्गर सॉस तैयार होगी।\n\n2. तंदूरी बर्गर सॉस\n\nअनुपात: 300g मेयोनीज़ + 50g C-503 VELVET GLAZE + 10g लाल मिर्च पाउडर\nमहत्वपूर्ण नोट: इसमें केचप बिल्कुल न डालें।\nपरिणाम: तंदूरी पनीर बर्गर जैसा स्वाद मिलेगा।\n\n3. चीजी गार्लिक डिप\n\nअनुपात: 250g मेयोनीज़ + 30g C-503 VELVET GLAZE + 50g लिक्विड चीज़\nगार्लिक ब्रेड और स्नैक्स के लिए उपयुक्त।\n\n4. बनाने की प्रक्रिया\n\nएक साफ प्लास्टिक या कांच का बाउल लें।\nआवश्यक रेसिपी के अनुसार मेयोनीज़ और केचप डालें।\nC-503 VELVET GLAZE प्रीमिक्स डालें।\nwhisk या चम्मच से अच्छी तरह मिलाएं जब तक कोई गांठ न रहे।\nउपयोग से पहले तैयार सॉस को 20 मिनट के लिए फ्रिज में रखें।\nइससे मसाले अच्छी तरह hydrate होते हैं और सही रंग व स्वाद आता है।\n\n5. स्टोरेज निर्देश\n\nतैयार सॉस हमेशा फ्रिज में रखें।\nCross-contamination से बचने के लिए गंदा चम्मच कंटेनर में न डालें।\nकंटेनर हमेशा अच्छी तरह बंद रखें।\n\n6. समस्या समाधान\n\nबहुत नमकीन: थोड़ा और मेयोनीज़ मिलाएं।\nसॉस पतली है: Extra thick veg mayonnaise इस्तेमाल करें।\nरंग हल्का है: 5g प्रीमिक्स बढ़ाएं या 1 चम्मच अतिरिक्त केचप डालें।'
  },
  {
    title: 'HERB & GARLIC SPREAD SOP',
    category: 'Cafe',
    contentEn: '1. Garlic Bread Spread\n\nRatio: 200g Soft Butter + 40g C-504 HERB INFUSION\nUse Amul or any local soft butter.\nResult: Creates a garlic butter spread similar to Domino’s style garlic bread.\n\n2. Sandwich / Wrap Spread\n\nRatio: 300g Mayonnaise + 30g C-504 HERB INFUSION\nLet the mixture rest for 10 minutes after mixing.\nResult: Creates a premium herb & garlic mayo spread.\n\n3. Preparation Method\nFor Butter Spread:\n\nButter should be soft at room temperature.\nDo NOT use melted butter.\nMelted butter causes the seasoning to settle at the bottom.\nAdd C-504 HERB INFUSION and mix thoroughly until fully blended.\n\nFor Mayo Spread:\n\nAdd C-504 HERB INFUSION to mayonnaise.\nMix properly until smooth.\nLet it rest for 10 minutes before use.\n\n4. Usage Instructions\nGarlic Bread:\n\nApply a light layer inside and on top of the bread.\nToast in oven or on tawa until golden.\n\nSandwich / Wrap:\n\nApply as a base spread on bread or wrap.\n\n5. Helper Advice\n\nSalt Warning: This premix already contains 100% salt.\nSince butter already contains salt, the ratio is balanced to avoid excessive saltiness.\nKeep the container tightly closed to maintain garlic freshness.\nFor stronger garlic flavor, fresh garlic paste can be added if required.\n\n6. Troubleshooting\n\nBread burning: Butter quantity is less or seasoning is too much. Increase butter.\nTaste bland: Add a little more premix or fresh garlic paste.\nSpread separating: Butter may be melted instead of soft. Always use soft butter.',
    contentHi: '1. गार्लिक ब्रेड स्प्रेड\n\nअनुपात: 200g नरम बटर + 40g C-504 HERB INFUSION\nAmul या कोई भी लोकल soft butter इस्तेमाल करें।\nपरिणाम: Domino’s स्टाइल गार्लिक बटर स्प्रेड तैयार होगा।\n\n2. सैंडविच / रैप स्प्रेड\n\nअनुपात: 300g मेयोनीज़ + 30g C-504 HERB INFUSION\nमिक्स करने के बाद 10 मिनट आराम दें।\nपरिणाम: प्रीमियम Herb & Garlic Mayo Spread तैयार होगा।\n\n3. बनाने की प्रक्रिया\nबटर स्प्रेड के लिए:\n\nबटर room temperature पर नरम होना चाहिए।\nपिघला हुआ बटर इस्तेमाल न करें।\nपिघले हुए बटर में मसाला नीचे बैठ जाता है।\nC-504 HERB INFUSION डालकर अच्छी तरह मिलाएं।\n\nमेयो स्प्रेड के लिए:\n\nमेयोनीज़ में C-504 HERB INFUSION डालें।\nअच्छी तरह smooth होने तक मिलाएं।\nउपयोग से पहले 10 मिनट छोड़ दें।\n\n4. उपयोग करने का तरीका\nगार्लिक ब्रेड:\n\nब्रेड के अंदर और ऊपर हल्की layer लगाएं।\nओवन या तवे पर सुनहरा होने तक सेकें।\n\nसैंडविच / रैप:\n\nब्रेड या रैप पर बेस स्प्रेड की तरह लगाएं।\n\n5. सहायक के लिए सुझाव\n\nनमक चेतावनी: इस प्रीमिक्स में पहले से 100% नमक मौजूद है।\nबटर में भी नमक होता है, इसलिए ratio संतुलित रखा गया है।\nगार्लिक की freshness बनाए रखने के लिए कंटेनर हमेशा अच्छी तरह बंद रखें।\nज्यादा strong garlic flavor के लिए fresh garlic paste मिलाया जा सकता है।\n\n6. समस्या समाधान\n\nब्रेड जल रही है: बटर कम है या मसाला ज्यादा है। बटर बढ़ाएं।\nस्वाद फीका है: थोड़ा और प्रीमिक्स या fresh garlic paste मिलाएं।\nस्प्रेड अलग हो रहा है: बटर पिघला हुआ था। हमेशा soft butter इस्तेमाल करें।'
  },
  {
    title: 'INSTANT PIZZA DOUGH SOP',
    category: 'Cafe',
    contentEn: '1. Preparation (Dough Making Method)\n\nIngredients for 1 kg Premix\n\n1 kg C-501 DOUGH MASTER\n600–700 ml Lukewarm water\n50 ml Refined oil or olive oil\n\nSteps\n\nTake 1 kg C-501 DOUGH MASTER in a clean bowl or mixer bowl.\nSlowly add 600–700 ml lukewarm water.\nAdd 50 ml refined oil or olive oil along with the water.\nKnead the dough for 10–15 minutes until it becomes completely smooth.\nPerform the window test:\nStretch a small piece of dough.\nIf it stretches thin without tearing (forming a thin sheet), the dough is ready.\n\n2. Proofing & Storage\n\nApply a light layer of oil on the dough.\nCover with a damp cloth or plastic wrap.\nLet it rest in a warm place at normal room temperature for 45–60 minutes.\nDough should double in size.\nOnce doubled, gently press (punch) the dough to release extra air.\nDivide into portions as needed (example: 200g for a 10-inch pizza).\nStore in refrigerator or use immediately.\n\n3. Helper Advice\n\nWater Temperature: Water should be lukewarm, not too hot or too cold.\nVery hot water can kill the yeast.\nTest with your finger; it should feel mildly warm.\nCover Properly: If left open, a dry crust forms on top.\nHygiene: Clean hands and work surface before preparation.\nLightly dust with flour while handling.\nDo Not Over-Knead: Once smooth, stop kneading or pizza base may become hard.\n\n4. Troubleshooting\n\nDough not rising: Water was too cold or premix was exposed to air. Use warmer water next time.\nDough too sticky: Too much water added. Sprinkle dry flour and knead again.\nPizza base hard: Oven temperature too low or dough too old. Preheat oven to 220°C–250°C.\nSour smell from dough: Dough was left outside too long. Refrigerate after 1 hour.\n\n5. Storage Rules\n\nAfter opening, store C-501 DOUGH MASTER in an airtight container.\nMoisture can damage the yeast.\nFollow FIFO (First In First Out) rule.',
    contentHi: '1. तैयारी (डो बनाने की विधि)\n\n1 किलो प्रीमिक्स के लिए सामग्री\n\n1 किलो C-501 DOUGH MASTER\n600–700 ml गुनगुना पानी\n50 ml रिफाइंड तेल या ऑलिव ऑयल\n\nस्टेप्स\n\nएक साफ बर्तन या मिक्सर बाउल में 1 किलो C-501 DOUGH MASTER लें।\nधीरे-धीरे 600–700 ml गुनगुना पानी डालें।\nपानी के साथ 50 ml तेल मिलाएं।\nडो को 10–15 मिनट तक अच्छी तरह गूंधें जब तक यह पूरी तरह smooth न हो जाए।\nWindow Test करें:\nडो का छोटा हिस्सा खींचें।\nयदि बिना फटे पतली परत बन जाए तो डो तैयार है।\n\n2. Proofing और Storage\n\nडो पर हल्का तेल लगाएं।\nगीले कपड़े या प्लास्टिक रैप से ढक दें।\nसामान्य गर्म जगह पर 45–60 मिनट के लिए छोड़ दें।\nडो का आकार दोगुना होना चाहिए।\nदोगुना होने के बाद हल्के से दबाकर अतिरिक्त हवा निकालें।\nआवश्यकता अनुसार portion बनाएं (जैसे 10-inch pizza के लिए 200g)।\nफ्रिज में रखें या तुरंत उपयोग करें।\n\n3. सहायक के लिए सुझाव\n\nपानी का तापमान: पानी न ज्यादा गरम हो न ज्यादा ठंडा।\nज्यादा गरम पानी yeast को खराब कर सकता है।\nउंगली से चेक करें, हल्की गर्माहट महसूस होनी चाहिए।\nढककर रखें: खुला छोड़ने पर ऊपर सूखी परत बन जाएगी।\nसफाई: तैयारी से पहले हाथ और काम करने की जगह साफ रखें।\nहल्का मैदा dusting के लिए इस्तेमाल करें।\nज्यादा न गूंधें: Smooth होने के बाद ज्यादा kneading न करें, वरना pizza base hard हो जाएगा।\n\n4. समस्या समाधान\n\nडो फूल नहीं रहा: पानी ठंडा था या premix हवा में खुला था। अगली बार थोड़ा ज्यादा गुनगुना पानी लें।\nडो ज्यादा चिपक रहा है: पानी ज्यादा हो गया। थोड़ा सूखा मैदा डालकर फिर से गूंधें।\nपिज़्ज़ा बेस hard है: Oven temperature कम था या डो पुराना था। Oven को 220°C–250°C पर preheat करें।\nखट्टा smell: डो ज्यादा देर बाहर रखा गया। 1 घंटे बाद फ्रिज में रखें।\n\n5. स्टोरेज नियम\n\nC-501 DOUGH MASTER खोलने के बाद airtight container में रखें।\nनमी yeast को खराब कर सकती है।\nFIFO (First In First Out) नियम अपनाएं।'
  },
  {
    title: 'PERI-PERI SEASONING SOP',
    category: 'Cafe',
    contentEn: '1. For French Fries & Nuggets\n\nUse immediately after deep frying while the fries or nuggets are still slightly oily.\nRatio: 200g fries = 1 large spoon (approx. 10–15g) C-509 FIRE DUST\nPut the fries in a bowl and sprinkle the seasoning.\nToss the bowl properly so every fry gets evenly coated.\n\n2. For Paneer / Chicken Grills\n\nCoat paneer or chicken with C-509 FIRE DUST before grilling.\nThis gives a peri-peri flavor.\n\n3. Usage Instructions\n\nAlways apply C-509 FIRE DUST on hot fried items.\nCold fries will not hold the seasoning properly.\nToss immediately after frying for best coating.\n\n4. Storage Instructions\n\nStore in a completely dry place.\nC-509 FIRE DUST contains citric acid and sugar, which may clump if exposed to moisture.\nAlways keep the container tightly closed.\n\n5. Helper Advice\n\nNo Extra Salt: C-509 FIRE DUST already contains salt.\nDo not add extra salt while frying or serving.\nUniform Coating: Toss in a bowl instead of mixing with a spoon.\nBowl tossing gives even seasoning coverage.\nFor less spicy serving, offer mayo dip.\n\n6. Troubleshooting\n\nToo spicy: Reduce seasoning quantity next time or serve with mayo dip.\nSeasoning not sticking: Apply immediately after frying while fries are hot and oily.\nIf fries become dry, spray a little oil before seasoning.\nSeasoning clumping: Moisture entered the container. Store in dry conditions.',
    contentHi: '1. फ्रेंच फ्राइज और नगेट्स के लिए\n\nDeep fry करने के तुरंत बाद इस्तेमाल करें जब fries या nuggets हल्के oily हों।\nअनुपात: 200g fries = 1 बड़ा चम्मच (लगभग 10–15g) C-509 FIRE DUST\nFries को बाउल में डालें और seasoning छिड़कें।\nअच्छी तरह toss करें ताकि हर fry पर मसाला बराबर लगे।\n\n2. पनीर / चिकन ग्रिल के लिए\n\nGrill करने से पहले paneer या chicken पर C-509 FIRE DUST coat करें।\nइससे peri-peri flavor मिलेगा।\n\n3. उपयोग करने का तरीका\n\nहमेशा C-509 FIRE DUST गरम fried items पर ही डालें।\nठंडे fries पर मसाला ठीक से नहीं चिपकेगा।\nFrying के तुरंत बाद toss करें।\n\n4. स्टोरेज निर्देश\n\nपूरी तरह सूखी जगह पर रखें।\nC-509 FIRE DUST में citric acid और sugar है, जो नमी में चिपक सकते हैं।\nकंटेनर हमेशा अच्छी तरह बंद रखें।\n\n5. सहायक के लिए सुझाव\n\nअतिरिक्त नमक न डालें: C-509 FIRE DUST में पहले से नमक है।\nतलते समय या सर्व करते समय अलग से नमक न डालें।\nसमान coating: चम्मच से मिलाने के बजाय bowl toss करें।\nइससे seasoning बराबर लगती है।\nकम तीखा चाहने वाले ग्राहकों को mayo dip दें।\n\n6. समस्या समाधान\n\nबहुत तीखा: अगली बार मसाला कम डालें या mayo dip के साथ सर्व करें।\nमसाला चिपक नहीं रहा: Fries गरम और oily रहते ही seasoning डालें।\nअगर fries सूख गए हों तो थोड़ा oil spray करें।\nमसाला चिपक गया/गांठ बन गई: कंटेनर में नमी चली गई है। सूखी जगह पर रखें।'
  },
  {
    title: 'PREMIUM PINK SAUCE PASTA SOP',
    category: 'Cafe',
    contentEn: '1. Measurement (For 1 Portion)\n\nBoiled Pasta (Penne/Fusilli): 180–200g\nFull Cream Milk: 150 ml\nWater: 50 ml\nC-505 ALFREDO CORE: 30g (approx. 2 large spoons)\nC-506 MARINARA CORE: 20g (approx. 1.5 large spoons)\nButter / Oil: 10g\nVegetables: Sweet corn, capsicum, onion\n\nPink Sauce Ratio\n\nWhite Sauce : Red Sauce = 60 : 40\nThis maintains proper creaminess and spice balance.\n\n2. Cooking Steps\n\nHeat butter or oil in a pan.\nAdd vegetables and sauté on high flame for 1 minute.\nAdd 150 ml milk and 50 ml water.\nAdd both premixes together:\n30g C-505 ALFREDO CORE\n20g C-506 MARINARA CORE\nWhisk continuously on medium flame until the sauce becomes smooth.\nSauce should develop a rich orange-pink color.\nOnce sauce thickens and starts boiling, add boiled pasta.\nCook for 1–2 minutes until pasta is fully coated.\nServe hot.\n\n3. Helper Advice\n\nColor Rule:\nIf sauce looks too white → add 5g more red premix.\nIf sauce looks too red → add a little milk or white premix.\nNo Extra Salt: Both premixes already contain salt.\nExtra Rich Option: Add 1 spoon fresh cream or cheese slice for premium taste.\nCold Mixing Rule: Always mix powders in cold liquid first to avoid lumps.\n\n4. Troubleshooting\n\nSauce curdling: Flame too high or milk reacted with red sauce acidity. Always mix powders in milk-water first before heating.\nSauce too dark: Too much red premix added. Balance with milk or white premix.\nPasta too dry: Pasta absorbed the sauce. Add 2 spoons hot milk before serving.\nLumps in sauce: Powder was added incorrectly. Whisk continuously.\n\n5. Presentation Tip\n\nTop with black olives and a light sprinkle of C-509 FIRE DUST for premium café-style presentation.',
    contentHi: '1. मात्रा (1 पोर्शन के लिए)\n\nउबला पास्ता (Penne/Fusilli): 180–200g\nफुल क्रीम दूध: 150 ml\nपानी: 50 ml\nC-505 ALFREDO CORE: 30g (लगभग 2 बड़े चम्मच)\nC-506 MARINARA CORE: 20g (लगभग 1.5 बड़े चम्मच)\nबटर / तेल: 10g\nसब्जियां: स्वीट कॉर्न, शिमला मिर्च, प्याज\n\nपिंक सॉस अनुपात\n\nWhite Sauce : Red Sauce = 60 : 40\nइससे creaminess और spice का संतुलन बना रहता है।\n\n2. बनाने की प्रक्रिया\n\nपैन में बटर या तेल गरम करें।\nसब्जियां डालकर तेज आंच पर 1 मिनट sauté करें।\n150 ml दूध और 50 ml पानी डालें।\nदोनों premix एक साथ डालें:\n30g C-505 ALFREDO CORE\n20g C-506 MARINARA CORE\nMedium flame पर लगातार whisk करें।\nसॉस smooth होकर orange-pink रंग की होनी चाहिए।\nजब सॉस गाढ़ी होकर उबलने लगे तो उबला पास्ता डालें।\n1–2 मिनट पकाएं ताकि पास्ता पूरी तरह coat हो जाए।\nगरमा-गरम सर्व करें।\n\n3. सहायक के लिए सुझाव\n\nColor Rule:\nसॉस ज्यादा सफेद लगे → 5g red premix बढ़ाएं।\nसॉस ज्यादा लाल लगे → थोड़ा दूध या white premix मिलाएं।\nअतिरिक्त नमक न डालें: दोनों premix में पहले से नमक है।\nExtra Rich Option: Premium taste के लिए fresh cream या cheese slice डाल सकते हैं।\nCold Mixing Rule: गांठों से बचने के लिए powder हमेशा ठंडे liquid में मिलाएं।\n\n4. समस्या समाधान\n\nसॉस फट रही है: आंच तेज है या red sauce acidity की वजह से दूध फट गया। पहले powder liquid में मिलाएं फिर heat करें।\nसॉस ज्यादा dark है: Red premix ज्यादा है। दूध या white premix मिलाकर balance करें।\nपास्ता सूखा है: पास्ता ने सॉस सोख ली। Serve करने से पहले 2 चम्मच गरम दूध मिलाएं।\nगांठें हैं: Powder सही तरह नहीं मिला। लगातार whisk करें।\n\n5. Presentation Tip\n\nऊपर black olives और हल्का C-509 FIRE DUST डालकर premium café style presentation दें।'
  },
  {
    title: 'RED SAUCE PASTA (ARRABBIATA) SOP',
    category: 'Cafe',
    contentEn: '1. Measurement (For 1 Portion)\n\nBoiled Pasta (Penne/Fusilli): 180–200g\nWater / Tomato Stock: 200 ml\nC-506 MARINARA CORE: 50g (approx. 3.5 large spoons)\nRefined Oil / Olive Oil: 10 ml\nVegetables: Garlic chunks, capsicum, onion, sweet corn\n\n2. Cooking Steps\n\nHeat oil in a pan.\nIf fresh garlic and onion are available, lightly fry until slightly golden.\nAdd the remaining vegetables.\nCook on high flame for 1 minute.\nAdd 200 ml water or tomato stock.\nImmediately add 50g C-506 MARINARA CORE.\nStir continuously until the sauce starts boiling.\nOnce boiled, the sauce develops a deep dark red color.\nWhen the sauce starts thickening, add boiled pasta.\nCook for 1–2 minutes so the pasta absorbs the flavor.\nServe hot.\n\n3. Helper Advice\n\nNo Extra Salt: C-506 MARINARA CORE already contains balanced salt and spice.\nDo not add anything extra.\nConsistency Rule: Red sauce pasta should remain slightly saucy compared to white sauce pasta.\nDo not over-dry the sauce.\nPink Sauce Shortcut: If customer asks for mix sauce pasta, combine red sauce and white sauce in 1:1 ratio.\nFresh Touch: Fresh basil leaves can be added at the end for better aroma.\n\n4. Troubleshooting\n\nSauce too sour: Too much premix added. Add water and a little sugar.\nLumps in sauce: Powder was not mixed properly. Add powder immediately after water and stir continuously.\nPasta tastes bland: Pasta was over-washed after boiling. Cook slightly longer in sauce so flavor gets absorbed.\nColor not deep red: Sauce was not boiled enough. Let it boil properly for 1–2 minutes.\n\n5. Presentation Tip\n\nGarnish with grated cheese, oregano, or chilli flakes for a premium presentation.\nImproves customer value perception.',
    contentHi: '1. मात्रा (1 पोर्शन के लिए)\n\nउबला पास्ता (Penne/Fusilli): 180–200g\nपानी / टमाटर स्टॉक: 200 ml\nC-506 MARINARA CORE: 50g (लगभग 3.5 बड़े चम्मच)\nरिफाइंड तेल / ऑलिव ऑयल: 10 ml\nसब्जियां: लहसुन के टुकड़े, शिमला मिर्च, प्याज, स्वीट कॉर्न\n\n2. बनाने की प्रक्रिया\n\nपैन में तेल गरम करें।\nयदि ताजा लहसुन और प्याज हों तो हल्का सुनहरा होने तक भूनें।\nबाकी सब्जियां डालें।\nतेज आंच पर 1 मिनट पकाएं।\n200 ml पानी या टमाटर स्टॉक डालें।\nतुरंत 50g C-506 MARINARA CORE डालें।\nलगातार चलाते रहें जब तक सॉस उबलने न लगे।\nउबलने के बाद सॉस गहरा लाल रंग ले लेगी।\nजब सॉस गाढ़ी होने लगे तो उबला पास्ता डालें।\n1–2 मिनट पकाएं ताकि पास्ता स्वाद अच्छी तरह सोख ले।\nगरमा-गरम सर्व करें।\n\n3. सहायक के लिए सुझाव\n\nअतिरिक्त नमक न डालें: C-506 MARINARA CORE में नमक और मसाले संतुलित हैं।\nअलग से कुछ न डालें।\nConsistency Rule: रेड सॉस पास्ता व्हाइट सॉस की तुलना में थोड़ा saucy रहना चाहिए।\nइसे ज्यादा सूखा न करें।\nPink Sauce Shortcut: यदि ग्राहक mix sauce मांगे तो red और white sauce को 1:1 ratio में मिलाएं।\nFresh Touch: अंत में ताजा basil leaves डाल सकते हैं।\n\n4. समस्या समाधान\n\nसॉस ज्यादा खट्टी है: Premix ज्यादा डल गया। थोड़ा पानी और हल्की चीनी मिलाएं।\nगांठें हैं: Powder सही तरह नहीं मिला। पानी डालते ही powder डालें और लगातार चलाएं।\nपास्ता फीका है: उबालने के बाद ज्यादा धो दिया गया। सॉस में थोड़ा ज्यादा पकाएं।\nरंग गहरा नहीं है: सॉस ठीक से नहीं उबली। 1–2 मिनट अच्छी तरह उबालें।\n\n5. Presentation Tip\n\nऊपर grated cheese, oregano, या chilli flakes डालकर premium look दें।\nइससे customer को better value feel होती है।'
  },
  {
    title: 'UNIVERSAL PATTY PREMIX SOP',
    category: 'Cafe',
    contentEn: '1. Veg Patty Preparation\n\nUse boiled and cooled potatoes.\nMash the potatoes properly.\nRatio: 1 kg boiled potatoes + 60g C-502 GRILL DUST (approx. 3 large spoons)\nMix thoroughly.\n\n2. Chicken Patty Preparation\n\nUse chicken mince.\nRatio: 1 kg chicken mince + 75g C-502 GRILL DUST (approx. 4 large spoons)\nMix properly until evenly combined.\n\n3. Resting Process\n\nAfter mixing, keep the mixture in the refrigerator for 15 minutes.\nThis helps roasted besan absorb moisture.\nMakes the patty firm and easier to shape.\n\n4. Shaping Instructions\n\nMake balls of 70–80g each.\nFlatten into patties of approximately 3.5-inch diameter.\nKeep thickness uniform for even cooking.\n\n5. Helper Advice\n\nNo Extra Salt: C-502 GRILL DUST already contains 100% salt.\nDo not add extra salt.\nTemperature Rule: Always use cooled potatoes.\nHot potatoes release moisture and make the mixture soft.\nExtra Crisp Option: Roll patties in breadcrumbs before frying for extra crispiness.\n\n6. Troubleshooting\n\nPatty too wet / sticky: Add 10–20g breadcrumbs or dry flour.\nTaste bland: Increase premix by 5g next time.\nToo spicy: Add more boiled potato or grated paneer to balance.\nPatty breaking: Mixture may not have rested enough. Refrigerate longer.',
    contentHi: '1. वेज पैटी तैयारी\n\nउबले और ठंडे आलू इस्तेमाल करें।\nआलू को अच्छी तरह मैश करें।\nअनुपात: 1 किलो उबले आलू + 60g C-502 GRILL DUST (लगभग 3 बड़े चम्मच)\nअच्छी तरह मिलाएं।\n\n2. चिकन पैटी तैयारी\n\nचिकन mince इस्तेमाल करें।\nअनुपात: 1 किलो चिकन mince + 75g C-502 GRILL DUST (लगभग 4 बड़े चम्मच)\nसमान रूप से अच्छी तरह मिलाएं।\n\n3. Resting प्रक्रिया\n\nमिक्स करने के बाद मिश्रण को 15 मिनट के लिए फ्रिज में रखें।\nइससे roasted besan नमी सोख लेता है।\nपैटी firm बनती है और shape देना आसान होता है।\n\n4. आकार देने की प्रक्रिया\n\n70–80g के गोले बनाएं।\nलगभग 3.5-inch diameter की flat patty बनाएं।\nसमान मोटाई रखें ताकि cooking बराबर हो।\n\n5. सहायक के लिए सुझाव\n\nअतिरिक्त नमक न डालें: C-502 GRILL DUST में पहले से 100% नमक है।\nअलग से नमक न डालें।\nTemperature Rule: हमेशा ठंडे आलू इस्तेमाल करें।\nगरम आलू नमी छोड़ते हैं और मिश्रण नरम हो जाता है।\nExtra Crisp Option: अतिरिक्त crispiness के लिए frying से पहले breadcrumbs में coat करें।\n\n6. समस्या समाधान\n\nपैटी ज्यादा गीली / चिपचिपी है: 10–20g breadcrumbs या सूखा मैदा मिलाएं।\nस्वाद फीका है: अगली बार premix 5g बढ़ाएं।\nबहुत तीखी है: ज्यादा उबले आलू या कद्दूकस किया paneer मिलाएं।\nपैटी टूट रही है: मिश्रण को पर्याप्त rest नहीं मिला। थोड़ा और फ्रिज में रखें।'
  },
  {
    title: 'UNIVERSAL SHAKE & COFFEE SYSTEM SOP',
    category: 'Cafe',
    contentEn: '1. Standard Shake Preparation Method\n\nIngredients\n\nChilled Full Cream Milk: 200 ml\nShake Base: 40–45g\nFlavoring: Syrup / Biscuit / Coffee (as required)\nIce Cubes: 2–3 cubes only\n\nSteps\n\nAdd 200 ml ice-cold full cream milk into the mixer jar.\nAdd 40–45g shake base as per recipe.\nAdd required flavoring such as syrup, Oreo, KitKat, or coffee.\nAdd only 2–3 ice cubes.\nBlend for 45–60 seconds until the shake becomes thick and smooth.\n\n2. Recipe Chart\n\nA. Using C-507 SNOW BASE (White Base)\n\nVanilla Shake\n\n200 ml Milk + 40g Vanilla Base\n\nMango / Strawberry Shake\n\n200 ml Milk + 40g Vanilla Base + 20 ml Fruit Syrup\n\nClassic Cold Coffee\n\n200 ml Milk + 35g Vanilla Base + 1.5 tsp Instant Coffee\n\nB. Using C-508 COCOA BASE (Dark Base)\n\nClassic Chocolate Shake\n\n200 ml Milk + 45g Chocolate Base\n\nOreo / KitKat Shake\n\n200 ml Milk + 45g Chocolate Base + 2 biscuits/sticks\n\nMocha Coffee\n\n200 ml Milk + 35g Chocolate Base + 1 tsp Instant Coffee\n\nHazelnut Shake\n\n200 ml Milk + 40g Chocolate Base + 15 ml Hazelnut Syrup\n\n3. Helper Advice\n\nMilk Temperature Rule: Milk must always be ice-cold.\nWarm milk will not produce a thick shake.\nCoffee Mixing Rule: For cold coffee, dissolve coffee powder in 1 spoon hot water first, then add to the blender.\nThis ensures uniform taste.\nPresentation Tip: Apply chocolate or strawberry syrup inside the glass walls before serving for a premium café look.\nCleaning Rule: Wash the blender jar immediately after every shake to prevent flavor mixing.\n\n4. Troubleshooting\n\nShake too thin: Milk was not cold enough or too much ice was added. Use chilled milk and add 5g extra powder.\nLess sweetness: Customer prefers sweeter taste. Add sugar powder or extra syrup.\nLumps: Blending time was too short. Blend for at least 45 seconds.\nCoffee too bitter: Too much coffee powder. Add extra milk or vanilla base.\n\n5. Storage Rules\n\nKeep powder containers tightly closed.\nMoisture can cause lumps.\nAlways use a dry spoon while handling premix.',
    contentHi: '1. स्टैंडर्ड शेक बनाने की विधि\n\nसामग्री\n\nठंडा फुल क्रीम दूध: 200 ml\nशेक बेस: 40–45g\nफ्लेवरिंग: Syrup / Biscuit / Coffee (आवश्यकतानुसार)\nबर्फ के टुकड़े: केवल 2–3\n\nस्टेप्स\n\nमिक्सर जार में 200 ml बर्फ जैसा ठंडा फुल क्रीम दूध डालें।\nरेसिपी के अनुसार 40–45g शेक बेस डालें।\nआवश्यक flavoring जैसे syrup, Oreo, KitKat या coffee डालें।\nकेवल 2–3 ice cubes डालें।\n45–60 सेकंड तक blend करें जब तक shake thick और smooth न हो जाए।\n\n2. रेसिपी चार्ट\n\nA. C-507 SNOW BASE (White Base) से\n\nVanilla Shake\n\n200 ml दूध + 40g Vanilla Base\n\nMango / Strawberry Shake\n\n200 ml दूध + 40g Vanilla Base + 20 ml Fruit Syrup\n\nClassic Cold Coffee\n\n200 ml दूध + 35g Vanilla Base + 1.5 tsp Instant Coffee\n\nB. C-508 COCOA BASE (Dark Base) से\n\nClassic Chocolate Shake\n\n200 ml दूध + 45g Chocolate Base\n\nOreo / KitKat Shake\n\n200 ml दूध + 45g Chocolate Base + 2 biscuits/sticks\n\nMocha Coffee\n\n200 ml दूध + 35g Chocolate Base + 1 tsp Instant Coffee\n\nHazelnut Shake\n\n200 ml दूध + 40g Chocolate Base + 15 ml Hazelnut Syrup\n\n3. सहायक के लिए सुझाव\n\nMilk Temperature Rule: दूध हमेशा बर्फ जैसा ठंडा होना चाहिए।\nगरम दूध से thick shake नहीं बनेगा।\nCoffee Mixing Rule: Cold coffee के लिए coffee powder को पहले 1 चम्मच गरम पानी में घोलें।\nइससे स्वाद समान रहता है।\nPresentation Tip: Premium café look के लिए glass के अंदर chocolate या strawberry syrup लगाएं।\nCleaning Rule: हर shake के बाद blender jar तुरंत धोएं ताकि flavors mix न हों।\n\n4. समस्या समाधान\n\nShake पतला है: दूध पर्याप्त ठंडा नहीं था या बर्फ ज्यादा थी। ठंडा दूध लें और 5g extra powder डालें।\nमीठापन कम है: ग्राहक ज्यादा मीठा चाहता है। Sugar powder या extra syrup डालें।\nगांठें हैं: Blend कम समय हुआ। कम से कम 45 सेकंड blend करें।\nCoffee ज्यादा कड़वी है: Coffee powder ज्यादा है। थोड़ा extra दूध या vanilla base डालें।\n\n5. स्टोरेज नियम\n\nPowder containers हमेशा अच्छी तरह बंद रखें।\nनमी से गांठें बन सकती हैं।\nPremix निकालते समय हमेशा सूखा चम्मच इस्तेमाल करें।'
  },
  },
  {
    title: 'KFC-STYLE CRISPY CHICKEN (C-510 ZING MASTER)',
    category: 'Cafe',
    contentEn: `1. MARINATION STANDARD (24-HOUR PROCESS)

Item: Chicken Cuts
Specification: Popcorn, Strips, Wings, or Leg Pieces (1 kg)
Notes: Fresh and properly cleaned

Item: Marinade Powder
Specification: C-510 ZING MASTER (40g)
Notes: Measure accurately

Item: Water
Specification: 50ml to 60ml
Notes: For dissolving seasoning; if chicken is already wet, avoid extra water

Item: Marination Time
Specification: 24 Hours (Mandatory)
Notes: Keep inside refrigerator (Chiller Zone)

Marination Method:
For 1 kg chicken, mix 40g C-510 ZING MASTER in 50ml water to create a thick paste.
Apply evenly over all chicken pieces and mix thoroughly.
Store in an airtight container and refrigerate for 24 hours.
This ensures the seasoning penetrates deep inside the chicken, including near the bone.

--------------------------------------------------

2. DRY COATING STATION SETUP

Set up these two containers:
Tub 1 (Dry Mix): Refined Flour (Maida) + 1 spoon C-509 FIRE DUST
Tub 2 (Chilled Water): Ice-cold water

--------------------------------------------------

3. STEP-BY-STEP COOKING METHOD

Step 1: First Coating
Remove marinated chicken from refrigerator.
Place it in dry flour.
Lightly coat using gentle hand movement.

Step 2: Water Dip
Dip coated chicken in cold water for 2–3 seconds.

Step 3: Second Coating
Return chicken to dry flour.
Toss gently 10–12 times to create crispy flakes.

Step 4: Shake
Shake off extra flour.

Step 5: Frying
Immediately place in hot oil.

--------------------------------------------------

4. FRYING TEMPERATURE & TIME

CRITICAL RULE: Oil must be fully preheated.

Chicken Popcorn:
Temperature: 180°C
Time: 3–4 minutes
Check: Golden brown and floating

Chicken Strips:
Temperature: 180°C
Time: 4–5 minutes
Check: Crispy texture

Chicken Wings:
Temperature: 170°C
Time: 6–7 minutes
Check: Fully cooked

Chicken Leg Piece:
Temperature: 160°C
Time: 10–12 minutes
Check: Deep internal cooking

--------------------------------------------------

5. HELPER TIPS

No Extra Salt: C-510 already contains balanced salt and spice.
Ice Cold Water Only: Normal water will ruin coating.
Avoid Overcrowding: Do not fry too many pieces together.

--------------------------------------------------

6. TROUBLESHOOTING

Problem: Crunch too hard
Reason: Pressed too hard in flour
Solution: Use gentle coating

Problem: Coating falling off
Reason: Water not cold enough
Solution: Use chilled water and shake properly

Problem: Raw inside
Reason: Oil too hot
Solution: Fry slowly at 160°C

--------------------------------------------------

7. PRESENTATION

After frying, place chicken on strainer for 1 minute.
Sprinkle C-509 FIRE DUST on top.
Serve in bucket or plate.`,
    contentHi: `1. मैरिनेशन स्टैंडर्ड (24 घंटे प्रक्रिया)

आइटम: चिकन कट्स
विवरण: पॉपकॉर्न, स्ट्रिप्स, विंग्स या लेग पीस (1 किलो)
नोट: ताज़ा और साफ

आइटम: मैरिनेड पाउडर
विवरण: C-510 ZING MASTER (40 ग्राम)
नोट: सही मात्रा लें

आइटम: पानी
विवरण: 50–60 ml
नोट: मसाला घोलने के लिए

आइटम: मैरिनेशन समय
विवरण: 24 घंटे (अनिवार्य)
नोट: फ्रिज के चिलर में रखें

मैरिनेशन विधि:
1 किलो चिकन के लिए 40 ग्राम C-510 ZING MASTER को 50 ml पानी में मिलाकर गाढ़ा पेस्ट बनाएं।
इस पेस्ट को चिकन के सभी पीस पर अच्छे से लगाएं।
एयरटाइट कंटेनर में बंद करके 24 घंटे फ्रिज में रखें।
इससे मसाला अंदर तक अच्छी तरह पहुंचता है।

--------------------------------------------------

2. ड्राई कोटिंग सेटअप

दो कंटेनर तैयार करें:
टब 1 (ड्राई मिक्स): मैदा + 1 चम्मच C-509 FIRE DUST
टब 2 (ठंडा पानी): बर्फ जैसा ठंडा पानी

--------------------------------------------------

3. कुकिंग प्रोसेस

स्टेप 1: पहली कोटिंग
मैरिनेटेड चिकन को फ्रिज से निकालें।
मैदे में डालें।
हल्के हाथ से कोट करें।

स्टेप 2: पानी डिप
2–3 सेकंड ठंडे पानी में डुबोएं।

स्टेप 3: दूसरी कोटिंग
फिर मैदे में डालें।
10–12 बार हल्के हाथ से घुमाएं।

स्टेप 4: झटकें
अतिरिक्त मैदा हटा दें।

स्टेप 5: फ्राई करें
तुरंत गरम तेल में डालें।

--------------------------------------------------

4. फ्राइंग तापमान और समय

महत्वपूर्ण नियम: तेल पूरी तरह गरम होना चाहिए।

चिकन पॉपकॉर्न:
तापमान: 180°C
समय: 3–4 मिनट
चेक: गोल्डन ब्राउन

चिकन स्ट्रिप्स:
तापमान: 180°C
समय: 4–5 मिनट
चेक: क्रिस्पी

चिकन विंग्स:
तापमान: 170°C
समय: 6–7 मिनट
चेक: पूरी तरह पका

चिकन लेग पीस:
तापमान: 160°C
समय: 10–12 मिनट
चेक: अंदर तक पका हुआ

--------------------------------------------------

5. हेल्पर टिप्स

अतिरिक्त नमक न डालें: मसाले में सब बैलेंस है।
सिर्फ ठंडा पानी इस्तेमाल करें: नॉर्मल पानी कोटिंग खराब करेगा।
बहुत सारे पीस साथ में न डालें: तेल का तापमान गिर जाएगा।

--------------------------------------------------

6. समस्याएं और समाधान

समस्या: बहुत हार्ड क्रंच
कारण: बहुत जोर से दबाया
समाधान: हल्के हाथ से कोट करें

समस्या: कोटिंग उतर रही है
कारण: पानी पर्याप्त ठंडा नहीं
समाधान: ठंडा पानी इस्तेमाल करें

समस्या: अंदर से कच्चा
कारण: तेल ज्यादा गरम
समाधान: 160°C पर धीरे पकाएं

--------------------------------------------------

7. सर्विंग

फ्राई होने के बाद 1 मिनट स्ट्रेनर पर रखें।
ऊपर से C-509 FIRE DUST छिड़कें।
बकेट या प्लेट में सर्व करें।`
  },
  {
    title: 'MASTER CAFE-STYLE BURGER ASSEMBLY',
    category: 'Cafe',
    contentEn: `1. THE 6-LAYER ASSEMBLY (BURGER SYSTEM)

The burger should be assembled from bottom to top in this exact sequence:
Bottom Bun: Apply C-503 VELVET GLAZE (Base sauce layer)
Layer 02 (Bottom Vegetables): A light layer of shredded lettuce or cabbage
Layer 03 (Cheese - Optional): 1 cheese slice (if requested by customer)
Layer 04 (Main Patty): Hot and crispy patty made using C-502 GRILL DUST
Layer 05 (Top Toppings): 2 slices tomato + 2 slices onion/cucumber
Top Bun: Apply C-503 VELVET GLAZE (Classic or spicy variant)

--------------------------------------------------

2. COOKING STEPS

Step 1: Bun Toasting
Cut burger bun into two halves.
Apply light butter and toast inner side on tawa or griddle for 15–20 seconds.
Bun should remain soft, not over toasted.

Step 2: Base Sauce
Apply 1 small spoon of C-503 VELVET GLAZE evenly on bottom bun.

Step 3: Vegetable Layer
Place shredded lettuce or cabbage over sauce.
This prevents bun from becoming soggy.

Step 4: Patty & Cheese
Place freshly fried hot patty.
If cheese burger, place cheese slice immediately over hot patty so it melts slightly.

Step 5: Top Toppings
Add tomato and onion slices over patty.

Step 6: Top Sauce & Closing
Apply 1 spoon sauce inside top bun.
Close burger.
Press lightly and wrap.

--------------------------------------------------

3. MENU VARIATIONS

Classic Aloo Tikki Burger:
Patty: Standard Aloo Patty
Sauce: Mayo + Ketchup + Premix

Crispy Veggie Crunch Burger:
Patty: Mix Veg Patty + Crunchy Coating
Sauce: Mayo + Ketchup + Premix

Tandoori Paneer Burger:
Patty: Fried Paneer Slab
Sauce: Mayo + Premix + Chilli Powder

Spicy Chicken Zinger:
Patty: Chicken Mince Patty
Sauce: Mayo + Chilli Sauce + Premix

--------------------------------------------------

4. HELPER TIPS

The Crunch Rule: Always fry patty when order arrives. Pre-fried patties become soft.
Sauce Balance: Spread sauce evenly till bun edges.
Vegetable Freshness: Cut tomatoes and onions fresh and store chilled. Cold crunchy vegetables improve taste.

--------------------------------------------------

5. TROUBLESHOOTING

Problem: Burger slipping apart
Reason: Too much sauce or wet tomato
Solution: Dry tomato slices and use controlled sauce quantity

Problem: Bottom bun soggy
Reason: Hot patty placed directly on bun
Solution: Always add lettuce/cabbage barrier

Problem: Bun dry and hard
Reason: Old bun or over toasted
Solution: Use fresh buns and light warming only

--------------------------------------------------

6. PRESENTATION

Wrap burger properly in burger wrap paper.
Serve hot.
Optional: Add fries or dip alongside.

Kyroz+ Systems | Accuracy. Consistency. Growth.
One System. Endless Menu.`,
    contentHi: `1. 6-लेयर बर्गर असेंबली सिस्टम

बर्गर को नीचे से ऊपर इस क्रम में बनाना है:
बॉटम बन: C-503 VELVET GLAZE सॉस लगाएं
लेयर 2: हल्की लेट्यूस या पत्ता गोभी
लेयर 3: 1 चीज स्लाइस (यदि ग्राहक मांगे)
लेयर 4: गरम और क्रिस्पी पैटी
लेयर 5: 2 टमाटर स्लाइस + 2 प्याज/खीरा स्लाइस
टॉप बन: C-503 VELVET GLAZE सॉस

--------------------------------------------------

2. कुकिंग स्टेप्स

स्टेप 1: बन टोस्टिंग
बर्गर बन को दो हिस्सों में काटें।
हल्का बटर लगाकर 15–20 सेकंड सेकें।
बन नरम रहना चाहिए।

स्टेप 2: बेस सॉस
बॉटम बन पर 1 चम्मच सॉस लगाएं।

स्टेप 3: वेजिटेबल लेयर
ऊपर लेट्यूस या पत्ता गोभी रखें।
इससे बन गीला नहीं होगा।

स्टेप 4: पैटी और चीज
गरम फ्रेश पैटी रखें।
चीज बर्गर हो तो तुरंत चीज स्लाइस रखें।

स्टेप 5: टॉप टॉपिंग्स
टमाटर और प्याज रखें।

स्टेप 6: बंद करें
ऊपर वाले बन पर सॉस लगाएं।
बर्गर बंद करें।
हल्का प्रेस करें।

--------------------------------------------------

3. मेन्यू वैरिएशन्स

क्लासिक आलू टिक्की:
स्टैंडर्ड आलू पैटी
सॉस: मेयो + केचप + प्रीमिक्स

क्रिस्पी वेजी क्रंच:
मिक्स वेज पैटी
सॉस: मेयो + केचप + प्रीमिक्स

तंदूरी पनीर:
फ्राइड पनीर स्लैब
सॉस: मेयो + प्रीमिक्स + चिली पाउडर

स्पाइसी चिकन जिंगर:
चिकन पैटी
सॉस: मेयो + चिली सॉस + प्रीमिक्स

--------------------------------------------------

4. हेल्पर टिप्स

क्रंच रोल: ऑर्डर आने पर ही पैटी फ्राई करें। पहले से फ्राई पैटी नरम हो जाती है।
सॉस बैलेंस: सॉस किनारों तक फैलाएं।
फ्रेश वेजिटेबल: ताज़ी ठंडी सब्जियां इस्तेमाल करें।

--------------------------------------------------

5. समस्याएं और समाधान

समस्या: बर्गर फिसल रहा है
कारण: ज्यादा सॉस
समाधान: नियंत्रित मात्रा रखें

समस्या: नीचे का बन गीला
कारण: गरम पैटी सीधे रखी
समाधान: लेट्यूस बैरियर लगाएं

समस्या: बन हार्ड
कारण: ज्यादा टोस्ट
समाधान: हल्का सेकें

--------------------------------------------------

6. सर्विंग

बर्गर रैप पेपर में अच्छे से पैक करें।
गरम सर्व करें।
चाहें तो फ्राइज साथ दें।`
  },
  {
    title: 'MASTER PIZZA ASSEMBLY & BAKING (C-500 SERIES)',
    category: 'Cafe',
    contentEn: `1. RAW MATERIAL MEASUREMENT (PER 10-INCH MEDIUM PIZZA)

Pizza Base: C-501 DOUGH MASTER prepared 10-inch pizza base
Pizza Sauce: C-506 MARINARA CORE sauce | Quantity: 50g
Cheese: Mozzarella + Cheddar diced blend | Quantity: 80g–100g
Vegetables: Capsicum, Onion, Sweet Corn, Mushroom | Quantity: 40g
Seasoning: C-509 FIRE DUST | For final topping

--------------------------------------------------

2. PIZZA ASSEMBLY STEPS

Step 1: Base Docking
Take the prepared pizza base.
If the base is not pre-baked, prick small holes across the surface using a fork.
This prevents the pizza from puffing in the center during baking.

Step 2: Sauce Layering
Add 50g pizza sauce in the center.
Spread evenly in circular motion.
Leave approximately 1/2 inch crust edge uncovered.

Step 3: First Cheese Layer
Add 30% of total cheese over the sauce.
This acts as a locking layer and helps toppings stay in place.

Step 4: Toppings Placement
Spread vegetables evenly across the pizza.
Do not overload one section.

Step 5: Final Cheese Layer
Add remaining 70% cheese evenly over toppings.
Toppings should be lightly covered.

--------------------------------------------------

3. BAKING STANDARDS

CRITICAL RULE: Preheat oven at least 15 minutes before baking. Cold oven will produce hard pizza.

Commercial Deck Oven:
Top Temperature: 280°C
Bottom Temperature: 260°C

Conveyor Pizza Oven:
Temperature: 250°C
Speed: 5 to 5.5 minutes

Baking Time: 5 to 6 minutes
Bake until: Cheese develops light brown spots and Crust becomes golden brown

--------------------------------------------------

4. HELPER TIPS

No Soggy Base: Ensure vegetables are dry. Wet vegetables can make pizza soggy.
Golden Edge Finish: After baking, lightly brush butter or olive oil on crust edges. Improves shine and premium appearance.
Cutting Rule: Cut immediately after baking using pizza cutter. Cut into 4 or 6 equal slices. Late cutting causes cheese stretching issues.

--------------------------------------------------

5. TROUBLESHOOTING

Problem: Cheese burned but base raw
Reason: Top heat too high
Solution: Reduce top heat by 10–20°C and increase bottom heat

Problem: Pizza puffed in center
Reason: Base not docked properly
Solution: Always prick holes before baking

Problem: Cheese melted but no stretch
Reason: Low oven temperature or underbaked
Solution: Maintain 260°C+ and bake till brown spots appear

--------------------------------------------------

6. PRESENTATION

Place pizza in pizza box or wooden platter.
Provide 1 small pouch of C-509 FIRE DUST alongside.
Serve hot.

Kyroz+ Systems | Accuracy. Consistency. Growth.
Perfect Crust. Perfect Melt.`,
    contentHi: `1. कच्चे माल की मात्रा (10 इंच मीडियम पिज्जा)

पिज्जा बेस: C-501 DOUGH MASTER से बना 10 इंच बेस
पिज्जा सॉस: C-506 MARINARA CORE | मात्रा: 50 ग्राम
चीज: Mozzarella + Cheddar blend | मात्रा: 80–100 ग्राम
सब्जियां: शिमला मिर्च, प्याज, स्वीट कॉर्न, मशरूम | मात्रा: 40 ग्राम
सीज़निंग: C-509 FIRE DUST

--------------------------------------------------

2. पिज्जा असेंबली स्टेप्स

स्टेप 1: बेस डॉकिंग
पिज्जा बेस लें।
अगर बेस प्री-बेक्ड नहीं है तो फोर्क से छोटे-छोटे छेद करें।
इससे बीच में फूलने से बचता है।

स्टेप 2: सॉस लेयरिंग
बीच में 50 ग्राम सॉस डालें।
गोल घुमाते हुए फैलाएं।
किनारों पर आधा इंच जगह छोड़ें।

स्टेप 3: पहली चीज लेयर
कुल चीज का 30% डालें।
इससे टॉपिंग्स अपनी जगह रहती हैं।

स्टेप 4: टॉपिंग्स रखें
सब्जियां बराबर फैलाएं।
एक जगह ज्यादा न डालें।

स्टेप 5: अंतिम चीज लेयर
बाकी 70% चीज ऊपर डालें।
टॉपिंग्स हल्की ढकी रहें।

--------------------------------------------------

3. बेकिंग स्टैंडर्ड

महत्वपूर्ण नियम: ओवन 15 मिनट पहले प्रीहीट करें। ठंडे ओवन में पिज्जा हार्ड बनेगा।

कमर्शियल डेक ओवन:
ऊपर तापमान: 280°C
नीचे तापमान: 260°C

कन्वेयर ओवन:
तापमान: 250°C
स्पीड: 5–5.5 मिनट

बेकिंग समय: 5–6 मिनट
चेक: चीज पर हल्के ब्राउन स्पॉट और क्रस्ट गोल्डन ब्राउन

--------------------------------------------------

4. हेल्पर टिप्स

गीला बेस न हो: सब्जियां सूखी रखें।
गोल्डन एज: बेकिंग के बाद किनारों पर हल्का बटर या ऑलिव ऑयल लगाएं।
कटिंग रूल: तुरंत काटें। 4 या 6 बराबर स्लाइस करें।

--------------------------------------------------

5. समस्याएं और समाधान

समस्या: चीज जल गई लेकिन बेस कच्चा
कारण: ऊपर की गर्मी ज्यादा
समाधान: ऊपर की गर्मी कम करें

समस्या: बीच में फूल गया
कारण: बेस में छेद नहीं किए
समाधान: हमेशा डॉकिंग करें

समस्या: चीज स्ट्रेच नहीं
कारण: कम तापमान
समाधान: सही तापमान रखें

--------------------------------------------------

6. सर्विंग

पिज्जा बॉक्स या लकड़ी प्लेट में रखें।
साथ में C-509 FIRE DUST का छोटा पाउच दें।
गरम सर्व करें।`
  },
  {
    title: 'PREMIUM CAFE-STYLE WRAPS & ROLLS (C-500 SERIES)',
    category: 'Cafe',
    contentEn: `1. WRAP STRUCTURE (LAYERING SYSTEM)

The wrap should be assembled from inside to outside in this exact structure:
Base: 8-inch or 10-inch Tortilla / Lachha Paratha
Moisture Barrier: Light layer of lettuce or cabbage
Purpose: Prevents sauce from making the wrap soggy
Main Filling: Fried Patty (C-502) / Paneer / OR Crispy Fried Chicken (C-510 ZING MASTER)
Flavor Layer: Long sliced onions + tomatoes + light sprinkle of C-509 FIRE DUST
Creamy Finish: 2 tablespoons C-503 VELVET GLAZE sauce

--------------------------------------------------

2. COOKING STEPS

Step 1: Base Heating
Warm tortilla or paratha lightly on tawa without oil or butter.
Heat for 10–15 seconds on both sides.
Base should remain soft and foldable.

Step 2: Sauce Application
Apply 1 tablespoon C-503 VELVET GLAZE sauce in center line.

Step 3: Vegetable Layer
Add shredded lettuce or cabbage over sauce.

Step 4: Filling Placement
Veg Version: Place sliced/crushed C-502 veg patty
Non-Veg Version: Place crispy fried chicken strips prepared using C-510 ZING MASTER

Step 5: Flavor Toppings
Add long sliced onions and tomatoes.
Sprinkle C-509 FIRE DUST lightly.

Step 6: Final Sauce Layer
Add 1 additional spoon of C-503 VELVET GLAZE over filling.

Step 7: Folding & Grilling
Fold bottom edge slightly upward.
Fold both sides inward.
Roll tightly.
Apply light butter on tawa or griller.
Toast for approximately 30 seconds until golden grill marks appear.

--------------------------------------------------

3. MENU VARIATIONS

Classic Veggie Wrap
Base: 8-inch Tortilla | Filling: C-502 Veg Patty (Crushed) | Seasoning: Mild C-509 FIRE DUST

Peri-Peri Paneer Wrap
Base: 8-inch Tortilla | Filling: Grilled Paneer Strips | Seasoning: Extra spicy C-509 FIRE DUST

Zing Crunchy Roll
Base: 8-inch Tortilla | Filling: C-510 ZING MASTER Fried Chicken | Special Sauce: C-503 mixed with mint

Crispy Chicken Wrap
Base: 8-inch Tortilla | Filling: C-510 Chicken Strips | Sauce: Standard C-503 VELVET GLAZE

--------------------------------------------------

4. HELPER TIPS

Tight Folding Rule: Always roll tightly. Loose wraps leak sauce while eating.
Crunch Rule: Chicken strips must be served hot and crispy.
Wrapping Presentation: Wrap half portion using butter paper or aluminum foil. Cut diagonally from center. This improves premium presentation.

--------------------------------------------------

5. TROUBLESHOOTING

Problem: Wrap tearing from bottom
Reason: Dry tortilla or excessive filling
Solution: Use fresh tortilla and avoid overfilling

Problem: Wrap feels dry
Reason: Less sauce or overcooked filling
Solution: Increase sauce quantity

Problem: Wrap becomes soggy
Reason: Wet vegetables or delayed serving
Solution: Grill immediately and serve fresh

--------------------------------------------------

6. PRESENTATION

Wrap half in butter paper or foil.
Cut diagonally.
Serve hot.
Optional: Serve with fries or dip.

Kyroz+ Systems | Accuracy. Growth. Consistency.
Crunchy Outside. Juicy Inside.`,
    contentHi: `1. रैप स्ट्रक्चर (लेयरिंग सिस्टम)

रैप को अंदर से बाहर इस क्रम में बनाना है:
बेस: 8 या 10 इंच टॉर्टिला / लच्छा पराठा
मॉइस्चर बैरियर: हल्की लेट्यूस या पत्ता गोभी
उद्देश्य: सॉस से रैप गीला न हो
मुख्य फिलिंग: फ्राइड पैटी (C-502) / पनीर / या क्रिस्पी फ्राइड चिकन (C-510)
फ्लेवर लेयर: लंबे कटे प्याज + टमाटर + हल्का C-509 FIRE DUST
क्रीमी फिनिश: 2 बड़े चम्मच C-503 VELVET GLAZE

--------------------------------------------------

2. कुकिंग स्टेप्स

स्टेप 1: बेस गर्म करना
टॉर्टिला या पराठा तवे पर बिना तेल के हल्का गर्म करें।
दोनों तरफ 10–15 सेकंड।
नरम और फोल्डेबल रहना चाहिए।

स्टेप 2: सॉस लगाना
बीच में 1 बड़ा चम्मच C-503 सॉस लगाएं।

स्टेप 3: वेजिटेबल लेयर
ऊपर लेट्यूस या पत्ता गोभी रखें।

स्टेप 4: फिलिंग रखना
वेज: C-502 पैटी रखें
नॉन-वेज: क्रिस्पी चिकन स्ट्रिप्स रखें

स्टेप 5: फ्लेवर टॉपिंग्स
प्याज और टमाटर रखें।
हल्का FIRE DUST छिड़कें।

स्टेप 6: अंतिम सॉस
ऊपर 1 चम्मच अतिरिक्त सॉस डालें।

स्टेप 7: फोल्डिंग और ग्रिलिंग
नीचे से मोड़ें।
दोनों साइड अंदर करें।
टाइट रोल बनाएं।
हल्का बटर लगाकर 30 सेकंड ग्रिल करें।

--------------------------------------------------

3. मेन्यू वैरिएशन्स

क्लासिक वेजी रैप
बेस: 8 इंच टॉर्टिला | फिलिंग: C-502 वेज पैटी | सीज़निंग: माइल्ड FIRE DUST

पेरी-पेरी पनीर रैप
करवा: 8 इंच टॉर्टिला | फिलिंग: ग्रिल्ड पनीर | सीज़निंग: एक्स्ट्रा स्पाइसी FIRE DUST

जिंग क्रंची रोल
बेस: 8 इंच टॉर्टिला | फिलिंग: फ्राइड चिकन | स्पेशल सॉस: मिंट मिक्स

Crispy Chicken Wrap
बेस: 8 इंच टॉर्टिला | फिलिंग: चिकन स्ट्रिप्स | सॉस: स्टैंडर्ड C-503

--------------------------------------------------

4. हेल्पर टिप्स

टाइट रोल: ढीला रोल न बनाएं।
क्रंच नियम: चिकन गरम और क्रिस्पी होना चाहिए।
प्रेजेंटेशन: बटर पेपर या फॉइल में आधा रैप करें। बीच से तिरछा काटें।

--------------------------------------------------

5. समस्याएं और समाधान

समस्या: नीचे से फट रहा
कारण: सूखा टॉर्टिला
समाधान: फ्रेश बेस इस्तेमाल करें

समस्या: ड्राई लग रहा
कारण: कम सॉस
समाधान: सॉस बढ़ाएं

समस्या: गीला हो गया
कारण: गीली सब्जियां
समाधान: तुरंत सर्व करें

--------------------------------------------------

6. सर्विंग

आधा बटर पेपर/फॉइल में पैक करें।
तिरछा काटें।
गरम सर्व करें।`
  }
];
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    await MasterSop.insertMany(cafeSops);

    console.log(`Successfully seeded ${cafeSops.length} ACTUAL Global SOPs for Cafe.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
