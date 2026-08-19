import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

const actualSops = [
  {
    title: 'KYROZ+ OPERATIONAL MANUAL: INSTANT DOSA (KY/SOP/DOSA-01)',
    category: 'South Indian',
    contentEn: `1. DOSA BATTER PREPARATION
S-301 COASTAL CRUST to Water Ratio: 1 Kg S-301 COASTAL CRUST = 1.5 to 1.6 Litres RO Water.
Mixing: In a large, clean vessel, take S-301 COASTAL CRUST. Gradually add RO water while mixing with a whisk.
Zero Lumps Rule: Ensure that there are no lumps in the batter. The batter must be completely smooth.
Resting Period: After preparing the batter, cover it and leave it for 15–20 minutes. This is essential so that the semolina and rice flour absorb the water.
Final Check: After 20 minutes, if the batter appears too thick, add another 50 ml of water. The consistency should be pourable — neither too thin nor too thick.
2. COOKING STEPS
Tawa Temperature: Heat the tawa. To check whether it is ready, sprinkle a little water. If the water immediately dries with a “shhh” sound, the tawa is ready.
Surface Cleaning: Before preparing each dosa, wipe the tawa with a wet cloth to reduce its temperature.
Spreading: Pour one large ladle of batter into the centre. Using a light hand, spread it in circular motions from the centre towards the outside.
Oiling: When the dosa starts to dry slightly, add 1 teaspoon of oil or butter around the edges and in the centre.
Cooking: Cook the dosa on medium heat until it naturally releases from the edges and becomes golden brown underneath.
3. TROUBLESHOOTING
Issue	Cause	Solution
Dosa is sticking	Tawa is too hot	Sprinkle water on the tawa to reduce the temperature
Dosa is not spreading	Batter is too thick	Add 2–3 teaspoons of RO water and check
Dosa is not crispy	Tawa is cold or the dosa was removed too early	Cook for a little longer on medium heat
Dosa is cracking in the centre	Batter is old or was not rested	Rest the batter for 15 minutes and handle the batter carefully while mixing
Colour is not appearing	Heat distribution on the tawa is not proper	Adjust the tawa so that the heat is distributed evenly
4. HELPER & CHEF-LESS KITCHEN ADVICE
First In, First Out (FIFO): Always use the batter that was prepared first.
Portion Control: Keep a fixed-size ladle for one dosa so that every customer receives a dosa of the same size.
Clean Tawa, Better Dosa: After every 5–10 dosas, sprinkle a little salt water on the tawa and clean it. This helps maintain its non-stick property.
No Cornstarch Rule: S-301 COASTAL CRUST does not contain cornstarch, so the dosa will not stick to the tawa as long as the temperature is properly controlled.
Hygiene: Always use a clean and dry spoon to take out the batter.
5. STORAGE INSTRUCTIONS
S-301 COASTAL CRUST: Store in a cool and dry place. After opening the packet, keep it in an airtight container.
Prepared Batter: If any batter remains, store it in the refrigerator. Before using it the next day, mix it thoroughly.

Approved By: Mohd Arif Kamal (KYROZ+ Systems)`,
    contentHi: `1. डोसा का घोल तैयार करने की विधि
S-301 COASTAL CRUST और पानी का अनुपात: 1 किलोग्राम S-301 COASTAL CRUST = 1.5 से 1.6 लीटर RO पानी।
मिक्सिंग: एक बड़े और साफ बर्तन में S-301 COASTAL CRUST लें। RO पानी को धीरे-धीरे डालते हुए व्हिस्क की सहायता से मिलाएँ।
गांठ रहित घोल: सुनिश्चित करें कि घोल में एक भी गांठ न हो। घोल पूरी तरह चिकना और एकसार होना चाहिए।
रेस्टिंग पीरियड: घोल तैयार करने के बाद उसे ढककर 15–20 मिनट के लिए छोड़ दें। यह आवश्यक है ताकि सूजी और चावल का आटा पानी को अच्छी तरह सोख सकें।
अंतिम जाँच: 20 मिनट बाद यदि घोल अधिक गाढ़ा लगे, तो 50 मिली अतिरिक्त पानी मिला सकते हैं। घोल की अंतिम consistency डालने योग्य होनी चाहिए — न बहुत पतली और न बहुत गाढ़ी।
2. डोसा बनाने की विधि
तवे का तापमान: तवा गरम करें। तवा तैयार है या नहीं, यह जाँचने के लिए थोड़ा पानी छिड़कें। यदि पानी तुरंत सूखकर “श्श्श” की आवाज करे, तो तवा तैयार है।
तवे की सफाई: हर डोसा बनाने से पहले तवे को गीले कपड़े से पोंछें ताकि उसका तापमान थोड़ा कम हो जाए।
घोल फैलाना: तवे के बीच में एक बड़ा करछुल घोल डालें। हल्के हाथ से घोल को बीच से बाहर की ओर गोलाकार फैलाएँ।
तेल लगाना: जब डोसा थोड़ा सूखने लगे, तो किनारों और बीच में 1 चम्मच तेल या मक्खन डालें।
पकाना: डोसे को मध्यम आँच पर तब तक पकाएँ जब तक वह किनारों से अपने आप तवे से अलग न होने लगे और नीचे से सुनहरा भूरा न हो जाए।
3. समस्या और समाधान
समस्या	कारण	समाधान
डोसा तवे पर चिपक रहा है	तवा बहुत अधिक गरम है	तवे पर पानी छिड़ककर तापमान कम करें
डोसा फैल नहीं रहा है	घोल बहुत गाढ़ा है	2–3 चम्मच RO पानी मिलाकर जाँच करें
डोसा कुरकुरा नहीं है	तवा ठंडा है या डोसा जल्दी निकाल लिया गया	मध्यम आँच पर थोड़ा अधिक समय तक पकाएँ
डोसा बीच से फट रहा है	घोल पुराना है या उसे रेस्ट नहीं दिया गया	घोल को 15 मिनट रेस्ट दें और मिलाते समय सावधानी रखें
डोसे का रंग नहीं आ रहा है	तवे पर गर्मी का वितरण सही नहीं है	तवे को समायोजित करें ताकि गर्मी समान रूप से वितरित हो
4. हेल्पर एवं बिना-शेफ वाली किचन के लिए सलाह
First In, First Out (FIFO): हमेशा पहले तैयार किए गए घोल का पहले उपयोग करें।
Portion Control: एक डोसे के लिए निश्चित आकार का करछुल रखें ताकि प्रत्येक ग्राहक को समान आकार का डोसा मिले।
साफ तवा, बेहतर डोसा: हर 5–10 डोसे के बाद तवे पर थोड़ा नमक वाला पानी छिड़ककर उसे साफ करें। इससे तवे की नॉन-स्टिक क्षमता बनी रहती है।
कॉर्नस्टार्च का उपयोग न करें: S-301 COASTAL CRUST में कॉर्नस्टार्च नहीं है। इसलिए तापमान सही रखने पर डोसा तवे पर नहीं चिपकेगा।
स्वच्छता: घोल निकालने के लिए हमेशा साफ और सूखे चम्मच का उपयोग करें।
5. भंडारण संबंधी निर्देश
S-301 COASTAL CRUST: इसे ठंडी और सूखी जगह पर रखें। पैकेट खोलने के बाद इसे एयरटाइट कंटेनर में रखें।
तैयार घोल: यदि घोल बच जाए, तो उसे फ्रिज में रखें। अगले दिन उपयोग करने से पहले उसे अच्छी तरह मिलाएँ।

स्वीकृतकर्ता: Mohd Arif Kamal (KYROZ+ Systems)`
  },
  {
    title: 'KYROZ+ OPERATIONAL MANUAL: INSTANT RICE IDLI (KY/SOP/IDL-06)',
    category: 'South Indian',
    contentEn: `1. PRE-COOKING PREPARATION
Water Quality: Always use fresh RO water.
Idli Trays: Lightly grease the idli moulds with oil and keep them ready. This will prevent the idlis from sticking.
CRITICAL RULE: DO NOT ADD SALT while preparing the batter. 100% of the required salt is already included in S-305 STEAM CLOUD.
2. MIXING RATIO

The consistency of the batter is extremely important for rice idli. Follow the measurement chart carefully.

S-305 STEAM CLOUD Powder	RO Water	Approx. Idli Yield
1 Kg	1.2–1.3 Litres	45–50 Idlis
500 Grams	600–650 ml	22–25 Idlis
200 Grams	250 ml	8–10 Idlis
3. MIXING & STEAMING STEPS

1. Mixing:
Take S-305 STEAM CLOUD in a large vessel. Gradually add water while mixing thoroughly. The batter should be thick and should have a thicker consistency than dosa batter.

2. Resting Period — Mandatory:
After preparing the batter, cover it and allow it to rest for 15 minutes.

Reason:
The rice flour and poha powder need sufficient time to absorb the water. This is necessary to achieve a soft and spongy idli.

3. Filling:
Fill the idli moulds with the batter. Do not fill the moulds completely to the top because the idlis will expand during steaming.

4. Steaming:
Boil water in the steamer. Once steam starts forming, place the idli stand inside the steamer.

5. Timing:
Steam the idlis on medium-high heat for 10–12 minutes.

6. Cooling:
After switching off the gas, do not remove the idli stand immediately. Wait for 2 minutes, then remove the stand. Dip the spoon in water before removing the idlis from the moulds.

4. TROUBLESHOOTING
Issue	Cause	Solution
Idli is hard	Too little water was added or the batter was not rested	Rest the batter for 15 minutes and keep the batter slightly softer
Idli has become flat	Too much water was added	Reduce the water by 50–100 ml next time
Idli is sticking	The stand was not greased or the idli was removed while too hot	Grease the stand and remove the idlis only after cooling for 2 minutes
Idli is not white	Water was not clean or the idli was overcooked	Always use RO water and do not steam for more than 12 minutes
5. HELPER ADVICE — CHEF-LESS KITCHEN
Freshness: Prepare only as many idlis as can be consumed within 1–2 hours. Cold idlis can be reheated in the steamer before serving.
Toothpick Test: To check whether the idli is fully cooked, insert a toothpick or knife into it. If it comes out clean, the idli is ready.
Storage: Always keep the S-305 STEAM CLOUD packet airtight so that the effectiveness of the soda is maintained.

Approved By: Mohd Arif Kamal (KYROZ+ Systems)`,
    contentHi: `1. पकाने से पहले की तैयारी
पानी की गुणवत्ता: हमेशा ताजा RO पानी का उपयोग करें।
इडली के सांचे: इडली के सांचों पर हल्का तेल लगाकर पहले से तैयार रखें। इससे इडली सांचे में चिपकेगी नहीं।
महत्वपूर्ण नियम: घोल तैयार करते समय नमक बिल्कुल न डालें। आवश्यक 100% नमक पहले से ही S-305 STEAM CLOUD में शामिल है।
2. मिक्सिंग अनुपात

राइस इडली के लिए घोल का सही गाढ़ापन बहुत महत्वपूर्ण है। नीचे दिए गए माप चार्ट का ध्यानपूर्वक पालन करें।

S-305 STEAM CLOUD पाउडर	RO पानी	लगभग तैयार होने वाली इडली
1 किग्रा	1.2–1.3 लीटर	45–50 इडली
500 ग्राम	600–650 मिली	22–25 इडली
200 ग्राम	250 मिली	8–10 इडली
3. घोल तैयार करने और भाप में पकाने की विधि

1. मिक्सिंग:
एक बड़े बर्तन में S-305 STEAM CLOUD लें। पानी को धीरे-धीरे डालते हुए अच्छी तरह मिलाएँ। घोल गाढ़ा होना चाहिए और इसकी consistency डोसे के घोल से अधिक गाढ़ी होनी चाहिए।

2. रेस्टिंग पीरियड — अनिवार्य:
घोल तैयार करने के बाद उसे ढककर 15 मिनट के लिए छोड़ दें।

कारण:
चावल के आटे और पोहा पाउडर को पानी सोखने के लिए पर्याप्त समय चाहिए। इसी प्रक्रिया से इडली नरम और स्पंजी बनती है।

3. सांचों में भरना:
इडली के सांचों में घोल भरें। सांचों को पूरी तरह ऊपर तक न भरें, क्योंकि भाप में पकने के दौरान इडली फूलती है।

4. भाप में पकाना:
स्टीमर में पानी उबालें। जब भाप बनना शुरू हो जाए, तब इडली स्टैंड को स्टीमर के अंदर रखें।

5. समय:
इडली को मध्यम-तेज आँच पर 10–12 मिनट तक भाप में पकाएँ।

6. ठंडा करना:
गैस बंद करने के तुरंत बाद इडली स्टैंड बाहर न निकालें। 2 मिनट प्रतीक्षा करें, फिर स्टैंड निकालें। इडली को सांचे से निकालने से पहले चम्मच को पानी में भिगो लें।

4. समस्या और समाधान
समस्या	कारण	समाधान
इडली सख्त है	पानी कम डाला गया या घोल को रेस्ट नहीं दिया गया	घोल को 15 मिनट रेस्ट दें और घोल को थोड़ा नरम रखें
इडली बैठ गई है	पानी अधिक हो गया	अगली बार पानी की मात्रा 50–100 मिली कम रखें
इडली चिपक रही है	स्टैंड पर तेल नहीं लगाया गया या इडली बहुत गरम अवस्था में निकाली गई	स्टैंड पर तेल लगाएँ और इडली को 2 मिनट ठंडा होने के बाद ही निकालें
इडली सफेद नहीं है	पानी साफ नहीं था या इडली अधिक पक गई	हमेशा RO पानी का उपयोग करें और 12 मिनट से अधिक भाप में न पकाएँ
5. हेल्पर के लिए सलाह — बिना शेफ वाली किचन
ताजगी: हमेशा उतनी ही इडली बनाएँ जितनी 1–2 घंटे में खपत हो सके। ठंडी इडली को स्टीमर में दोबारा गरम करके परोसा जा सकता है।
टूथपिक टेस्ट: इडली अच्छी तरह पक गई है या नहीं, यह जाँचने के लिए इडली में टूथपिक या चाकू डालें। यदि वह साफ बाहर निकलता है, तो इडली तैयार है।
स्टोरेज: S-305 STEAM CLOUD के पैकेट को हमेशा एयरटाइट बंद करके रखें ताकि उसमें मौजूद सोडा की प्रभावशीलता बनी रहे।

स्वीकृतकर्ता: Mohd Arif Kamal (KYROZ+ Systems)`
  },
  {
    title: 'KYROZ+ OPERATIONAL MANUAL: INSTANT COCONUT CHUTNEY (KY/SOP/CHT-04)',
    category: 'South Indian',
    contentEn: `1. PREPARATION
Water Quality: Always use cold RO water while preparing the chutney. Cold water helps maintain the fresh taste of coconut.
CRITICAL RULE: DO NOT ADD SALT while mixing the chutney or preparing the tempering. 100% of the required salt is already present in S-307 KERALA KERNEL.
2. MIXING RATIO

Follow the measurement chart strictly to maintain consistent quality and taste.

Chutney Quantity	S-307 KERALA KERNEL	Cold RO Water
Approx. 3.5 Kg	1 Kg	2.5 Litres
Approx. 1.7 Kg	500 Grams	1.25 Litres
Approx. 350 Grams	100 Grams	250 ml
3. MIXING STEPS

1. Blending:
Take the required quantity of S-307 KERALA KERNEL powder in a clean vessel according to the measurement chart.

2. Adding Water:
Gradually add cold RO water while continuously mixing with a whisk or spoon.

3. Resting Period — Mandatory:
After mixing, leave the chutney to rest for 10–15 minutes.

Reason:
The desiccated coconut absorbs water and expands during this period, giving the chutney the appearance and texture of freshly prepared coconut chutney.

4. Consistency Check:
After 15 minutes, if the chutney is too thick, add a small amount of water and adjust the consistency.

4. FRESH TEMPERING — THE KYROZ SIGNATURE

After the chutney has rested, fresh tempering must be prepared.

Heat 1–2 teaspoons of oil in a small pan.
Add mustard seeds, 1–2 whole red chillies, and 8–10 fresh curry leaves.
When the mustard seeds begin to splutter, pour the tempering over the prepared chutney and mix lightly.
5. TROUBLESHOOTING
Issue	Cause	Solution
Chutney is too thin	Too much water was added	Add some S-307 KERALA KERNEL powder and allow it to rest for 5 minutes
Taste is bland	Excess water was added	Follow the measurement chart strictly next time
Colour is yellow/dark	Hot water was used or chutney was left uncovered	Always use cold water and refrigerate the chutney after preparation
Texture is dry	Chutney was not given sufficient resting time	Allow it to rest for at least 10 minutes
6. HELPER ADVICE — CHEF-LESS KITCHEN
Small Batches: Do not prepare a large quantity of chutney at one time. Prepare small batches 2–3 times a day to maintain freshness.
Cold Storage: Always refrigerate the chutney after preparation. Coconut can spoil quickly if it is not refrigerated.
Service: During serving, ensure that a small amount of tempering is visible in every portion.

Approved By: Mohd Arif Kamal (KYROZ+ Systems)`,
    contentHi: `1. तैयारी
पानी की गुणवत्ता: चटनी तैयार करने के लिए हमेशा ठंडे RO पानी का उपयोग करें। ठंडा पानी नारियल के ताजे स्वाद को बनाए रखने में मदद करता है।
महत्वपूर्ण नियम: चटनी मिलाते समय या तड़का तैयार करते समय नमक बिल्कुल न डालें। आवश्यक 100% नमक पहले से ही S-307 KERALA KERNEL में मौजूद है।
2. मिक्सिंग अनुपात

चटनी की गुणवत्ता और स्वाद हर बार एक जैसा बनाए रखने के लिए नीचे दिए गए माप चार्ट का सख्ती से पालन करें।

चटनी की मात्रा	S-307 KERALA KERNEL	ठंडा RO पानी
लगभग 3.5 किग्रा	1 किग्रा	2.5 लीटर
लगभग 1.7 किग्रा	500 ग्राम	1.25 लीटर
लगभग 350 ग्राम	100 ग्राम	250 मिली
3. चटनी बनाने की विधि

1. ब्लेंडिंग:
माप चार्ट के अनुसार आवश्यक मात्रा में S-307 KERALA KERNEL पाउडर एक साफ बर्तन में लें।

2. पानी मिलाना:
ठंडा RO पानी धीरे-धीरे डालें और व्हिस्क या चम्मच की सहायता से लगातार मिलाते रहें।

3. रेस्टिंग पीरियड — अनिवार्य:
मिक्स करने के बाद चटनी को 10–15 मिनट के लिए छोड़ दें।

कारण:
इस दौरान सूखा नारियल पानी को सोखकर फूलता है। इससे चटनी का रूप और बनावट ताजे नारियल से बनी चटनी जैसी हो जाती है।

4. गाढ़ापन जाँच:
15 मिनट बाद यदि चटनी बहुत गाढ़ी लगे, तो थोड़ी मात्रा में पानी डालकर इसकी consistency को समायोजित करें।

4. ताजा तड़का — KYROZ की विशेष पहचान

चटनी को रेस्ट देने के बाद ताजा तड़का लगाना आवश्यक है।

एक छोटे पैन में 1–2 चम्मच तेल गरम करें।
इसमें राई, 1–2 साबुत लाल मिर्च और 8–10 ताजे करी पत्ते डालें।
जब राई चटकने लगे, तो तड़के को तैयार चटनी के ऊपर डालें और हल्के हाथ से मिला दें।
5. समस्या और समाधान
समस्या	कारण	समाधान
चटनी बहुत पतली है	पानी अधिक डाल दिया गया	थोड़ा S-307 KERALA KERNEL पाउडर मिलाकर 5 मिनट रेस्ट दें
स्वाद फीका है	पानी बहुत अधिक डाल दिया गया	अगली बार माप चार्ट का सख्ती से पालन करें
रंग पीला/गहरा है	गरम पानी इस्तेमाल किया गया या चटनी खुली छोड़ दी गई	हमेशा ठंडा पानी इस्तेमाल करें और बनाने के बाद चटनी को फ्रिज में रखें
बनावट सूखी है	पर्याप्त रेस्ट नहीं दिया गया	कम से कम 10 मिनट का रेस्ट दें
6. हेल्पर के लिए सलाह — बिना शेफ वाली किचन
छोटे बैच: एक बार में बहुत अधिक चटनी न बनाएँ। ताजगी बनाए रखने के लिए दिन में 2–3 बार थोड़ी-थोड़ी मात्रा में चटनी बनाएँ।
कोल्ड स्टोरेज: चटनी तैयार होने के बाद उसे हमेशा फ्रिज में रखें। फ्रिज के बिना नारियल जल्दी खराब हो सकता है।
सर्विंग: परोसते समय ध्यान रखें कि प्रत्येक पोर्शन में थोड़ा-सा तड़का दिखाई दे।

स्वीकृतकर्ता: Mohd Arif Kamal (KYROZ+ Systems)`
  },
  {
    title: 'KYROZ+ OPERATIONAL MANUAL: INSTANT MEDU VADA (KY/SOP/VADA-07)',
    category: 'South Indian',
    contentEn: `1. PREPARATION
Water Quality: Always use fresh RO water.
Oil: Always use fresh refined oil for frying.
CRITICAL RULE: DO NOT ADD SALT while preparing the batter. 100% of the required salt is already included in S-304 CRUNCH CORE.
2. MIXING RATIO

The Medu Vada batter must be stiffer than dosa and idli batter so that the vada retains its shape.

S-304 CRUNCH CORE Powder	RO Water	Required Consistency
1 Kg	800–900 ml	Batter must be stiff
500 Grams	400–450 ml	Keep the measurement fixed

3. COOKING STEPS

1. Mixing:
Add water to S-304 CRUNCH CORE and prepare a thick batter.

2. Resting Period — Mandatory:
Cover the batter and allow it to rest for 20 minutes. This allows the urad dal flour to absorb the water and become lighter.

3. Whisking / Beating:
Before frying, whisk the batter thoroughly in one direction for 2–3 minutes. This incorporates air into the batter and helps make the vada spongy on the inside.

4. Shaping:
Wet your hands, take a portion of batter, make a hole in the centre, and gently place the shaped vada into the hot oil.

Tip:
The helper may also use a Medu Vada Maker machine.

5. Frying:
Fry on medium heat until the vada becomes golden brown.

4. TROUBLESHOOTING
Issue	Cause	Solution
Vada is absorbing oil	Too much water was added or the oil was not hot enough	Add a little more S-304 CRUNCH CORE and increase the oil temperature
Vada is hard	The batter was not beaten properly	Beat thoroughly for 2–3 minutes to incorporate air
Shape is not forming	Batter is too soft	Refrigerate for 10–15 minutes or add a little more S-304 CRUNCH CORE
Vada is raw inside	Fried at excessively high heat	Always cook slowly on medium heat

5. HELPER ADVICE — CHEF-LESS KITCHEN
Crispiness Tip: If the vada needs to remain crispy for a longer period, add 1 teaspoon of hot oil to the batter while mixing.
Test: Put a small amount of batter into a bowl of water. If the batter floats to the surface, the beating process is adequate.
Service: Serve hot with sambhar and coconut chutney.

Approved By: Mohd Arif Kamal (KYROZ+ Systems)`,
    contentHi: `1. तैयारी
पानी की गुणवत्ता: हमेशा ताजा RO पानी का उपयोग करें।
तेल: तलने के लिए हमेशा ताजा रिफाइंड तेल का उपयोग करें।
महत्वपूर्ण नियम: घोल तैयार करते समय नमक बिल्कुल न डालें। आवश्यक 100% नमक पहले से ही S-304 CRUNCH CORE में शामिल है।
2. मिक्सिंग अनुपात

मेडु वड़ा का घोल डोसा और इडली के घोल की तुलना में अधिक गाढ़ा और सख्त होना चाहिए, ताकि वड़ा अपना आकार बनाए रखे।

S-304 CRUNCH CORE पाउडर	RO पानी	आवश्यक गाढ़ापन
1 किग्रा	800–900 मिली	घोल सख्त होना चाहिए
500 ग्राम	400–450 मिली	माप निश्चित रखें

3. बनाने की विधि

1. मिक्सिंग:
S-304 CRUNCH CORE में पानी मिलाकर गाढ़ा घोल तैयार करें।

2. रेस्टिंग पीरियड — अनिवार्य:
घोल को ढककर 20 मिनट के लिए रखें। इससे उड़द दाल का आटा पानी को अच्छी तरह सोख लेता है और हल्का हो जाता है।

3. फेंटना:
तलने से पहले घोल को एक ही दिशा में 2–3 मिनट तक अच्छी तरह फेंटें। इससे घोल में हवा शामिल होती है और वड़ा अंदर से नरम तथा स्पंजी बनता है।

4. आकार देना:
अपने हाथों को गीला करें, थोड़ा घोल लें, बीच में एक छेद बनाएँ और तैयार वड़े को धीरे से गरम तेल में डालें।

सुझाव:
हेल्पर Medu Vada Maker मशीन का भी उपयोग कर सकता है।

5. तलना:
वड़े को मध्यम आँच पर सुनहरा भूरा होने तक तलें।

4. समस्या और समाधान
समस्या	कारण	समाधान
वड़ा तेल सोख रहा है	पानी अधिक हो गया है या तेल पर्याप्त गरम नहीं है	थोड़ा और S-304 CRUNCH CORE मिलाएँ और तेल का तापमान बढ़ाएँ
वड़ा सख्त है	घोल को ठीक से नहीं फेंटा गया	घोल को 2–3 मिनट अच्छी तरह फेंटें ताकि उसमें पर्याप्त हवा शामिल हो
वड़े का आकार नहीं बन रहा है	घोल बहुत नरम है	घोल को 10–15 मिनट के लिए फ्रिज में रखें या थोड़ा और S-304 CRUNCH CORE मिलाएँ
वड़ा अंदर से कच्चा है	बहुत तेज आँच पर तला गया	हमेशा मध्यम आँच पर धीरे-धीरे पकाएँ

5. हेल्पर के लिए सलाह — बिना शेफ वाली किचन
कुरकुरापन बनाए रखने की टिप: यदि वड़े को अधिक समय तक कुरकुरा रखना है, तो घोल तैयार करते समय उसमें 1 चम्मच गरम तेल मिला दें।
टेस्ट: थोड़ा-सा घोल पानी से भरी कटोरी में डालें। यदि घोल पानी की सतह पर तैरता है, तो समझें कि घोल को पर्याप्त रूप से फेंटा गया है।
सर्विंग: गरमा-गरम वड़ा सांभर और नारियल चटनी के साथ परोसें।

स्वीकृतकर्ता: Mohd Arif Kamal (KYROZ+ Systems)`
  },
  {
    title: 'KYROZ+ OPERATIONAL MANUAL: ONION RAVA DOSA (KY/SOP/RAVA-08)',
    category: 'South Indian',
    contentEn: `1. PRE-COOKING PREPARATION

The “Watery” Batter

Rava dosa batter should not be thick like regular dosa batter. It must be very thin, similar to the consistency of buttermilk or milk.

Fresh Add-ons

Keep the following ingredients prepared separately:

* Finely chopped onion
* Green chilli
* Fresh coriander

CRITICAL RULE

DO NOT ADD SALT while preparing the batter.
100% of the required salt is already included in S-303 RAVA PEARL. 

2. MIXING RATIO

Rava dosa requires a higher quantity of water to create its characteristic net-like texture.

| S-303 RAVA PEARL Powder |     RO Water | Required Consistency |
| ----------------------- | -----------: | -------------------- |
| 1 Kg                    | 2.5–3 Litres | Very thin            |
| 200 Grams               |   500–600 ml | Pouring consistency  |

3. COOKING STEPS — POURING TECHNIQUE

1. Mixing:
Mix S-303 RAVA PEARL with water and allow the batter to rest for 15–20 minutes.

Reason:
The semolina absorbs water during this period, so resting the batter is essential.

2. Tawa Heat:
The tawa must be extremely hot or “smoking hot.” If the tawa is not hot enough, the characteristic net-like texture will not form.

3. Toppings:
Add a small amount of oil to the tawa. Sprinkle finely chopped onion and curry leaves over the surface.

4. Pouring:
Take the batter in a bowl or large spoon. Starting from the edges of the tawa, pour or sprinkle the batter in a flowing motion towards the centre.

Important:
Do not spread the batter like regular dosa batter. The objective is only to fill the empty spaces and create the net-like texture. 

5. Oiling:
Add 1–2 teaspoons of oil or ghee around the edges.

6. Slow Cooking:
Rava dosa requires more cooking time than regular dosa. Cook until it naturally releases from the edges and becomes golden brown.

There is no need to flip the dosa. 

4. TROUBLESHOOTING

| Issue                               | Cause                                             | Solution                                                                |
| ----------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------- |
| Net-like texture is not forming | Tawa is not hot enough or the batter is too thick | Heat the tawa properly and add a little water to the batter             |
| Dosa is breaking                | Batter is too thin                                | Add 1–2 teaspoons of S-303 RAVA PEARL powder to balance the consistency |
| Dosa is soft                    | Removed too early or heat was too low             | Cook for a longer time on medium-high heat until it becomes crispy      |
| Dosa is sticking to the tawa    | Tawa was not clean or insufficient oil was used   | Clean the tawa with salt water and apply oil around the edges           |

5. HELPER ADVICE — CHEF-LESS KITCHEN

Stir Before Every Pour

Semolina and rice flour settle at the bottom of the batter. Therefore, before preparing every dosa, stir the batter thoroughly from the bottom upwards.

Patience Is Key

Rava dosa takes approximately 3–4 minutes to cook. Do not rush the process, otherwise the dosa will not develop the required crispy texture.

Service

Serve the dosa either fully open/unfolded or folded into a triangle so that the characteristic net-like texture is clearly visible to the customer. 

Approved By: Mohd Arif Kamal (KYROZ+ Systems)`,
    contentHi: `1. पकाने से पहले की तैयारी

“पतला” घोल

रवा डोसे का घोल सामान्य डोसे के घोल की तरह गाढ़ा नहीं होना चाहिए। इसकी consistency छाछ या दूध जैसी बहुत पतली होनी चाहिए।

ताजी सामग्री

निम्नलिखित सामग्री को अलग से पहले से तैयार रखें:

* बारीक कटा हुआ प्याज़
* हरी मिर्च
* ताजा हरा धनिया

महत्वपूर्ण नियम

घोल तैयार करते समय नमक बिल्कुल न डालें।
आवश्यक 100% नमक पहले से ही S-303 RAVA PEARL में शामिल है। 

2. मिक्सिंग अनुपात

रवा डोसे की विशेष जालीदार बनावट प्राप्त करने के लिए इसमें पानी की मात्रा अधिक रखी जाती है।

| S-303 RAVA PEARL पाउडर |      RO पानी | आवश्यक गाढ़ापन          |
| ---------------------- | -----------: | ----------------------- |
| 1 किग्रा               |   2.5–3 लीटर | बहुत पतला               |
| 200 ग्राम              | 500–600 मिली | डालने योग्य consistency |

3. डोसा बनाने की विधि — डालने की तकनीक

1. मिक्सिंग:
S-303 RAVA PEARL और पानी को अच्छी तरह मिलाएँ और घोल को 15–20 मिनट के लिए रेस्ट करने दें।

कारण:
इस दौरान सूजी पानी को सोखती है। इसलिए घोल को रेस्ट देना आवश्यक है।

2. तवे का तापमान:
तवा बहुत अधिक गरम होना चाहिए, अर्थात लगभग “स्मोकिंग हॉट”। यदि तवा पर्याप्त गरम नहीं होगा, तो डोसे की विशेष जालीदार बनावट नहीं बनेगी।

3. टॉपिंग:
तवे पर थोड़ा तेल डालें। इसके बाद बारीक कटे प्याज़ और करी पत्ते को तवे पर छिड़कें।

4. घोल डालने की तकनीक:
घोल को एक कटोरी या बड़े चम्मच में लें। तवे के किनारों से शुरू करते हुए घोल को धार के रूप में बीच की ओर छिड़कते हुए डालें।

महत्वपूर्ण:
घोल को सामान्य डोसे की तरह फैलाना नहीं है। केवल खाली जगहों को भरना है ताकि डोसे की जालीदार बनावट तैयार हो सके। 

5. तेल लगाना:
किनारों पर 1–2 चम्मच तेल या घी डालें।

6. धीमी गति से पकाना:
रवा डोसे को सामान्य डोसे की तुलना में अधिक समय लगता है। इसे तब तक पकाएँ जब तक यह किनारों से अपने आप तवे से अलग न होने लगे और सुनहरा भूरा न हो जाए।

इसे पलटने की आवश्यकता नहीं है। 

4. समस्या और समाधान

| समस्या                        | कारण                                     | समाधान                                                           |
| ----------------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| जालीदार बनावट नहीं बन रही | तवा पर्याप्त गरम नहीं है या घोल गाढ़ा है | तवे को अच्छी तरह गरम करें और घोल में थोड़ा पानी मिलाएँ           |
| डोसा टूट रहा है           | घोल बहुत पतला है                         | 1–2 चम्मच S-303 RAVA PEARL पाउडर मिलाकर consistency संतुलित करें |
| डोसा नरम है               | डोसा जल्दी निकाल लिया गया या आँच कम थी   | मध्यम-तेज आँच पर अधिक समय तक पकाएँ ताकि डोसा कुरकुरा हो जाए      |
| डोसा तवे पर चिपक रहा है   | तवा साफ नहीं था या तेल पर्याप्त नहीं था  | तवे को नमक वाले पानी से साफ करें और किनारों पर तेल लगाएँ         |

5. हेल्पर के लिए सलाह — बिना शेफ वाली किचन

हर बार घोल डालने से पहले मिलाएँ

सूजी और चावल का आटा घोल के नीचे बैठ जाता है। इसलिए हर डोसा बनाने से पहले घोल को नीचे से ऊपर की ओर अच्छी तरह मिलाएँ।

धैर्य रखें

रवा डोसे को पकने में लगभग 3–4 मिनट लगते हैं। जल्दबाजी न करें, अन्यथा डोसे में आवश्यक कुरकुरापन नहीं आएगा।

सर्विंग

रवा डोसे को बिना मोड़े या त्रिकोण के आकार में मोड़कर परोसें, ताकि इसकी विशेष जालीदार बनावट ग्राहक को स्पष्ट रूप से दिखाई दे। 

स्वीकृतकर्ता: Mohd Arif Kamal (KYROZ+ Systems)`
  },
  {
    title: 'KYROZ+ OPERATIONAL MANUAL: INSTANT RED (KARA) CHUTNEY (KY/SOP/CHT-05)',
    category: 'South Indian',
    contentEn: `1. PREPARATION

Water Quality

Use lukewarm RO water to prepare this chutney. Lukewarm water helps the onion powder and tomato powder hydrate properly and more quickly.

CRITICAL RULE

DO NOT ADD SALT while preparing the chutney.
100% of the required salt is already present in S-306 TANGY TROPIC. 

2. MIXING RATIO

The helper must follow this measurement chart strictly to maintain the same South Indian taste and consistency every time.

| Chutney Quantity  | S-306 TANGY TROPIC | Lukewarm RO Water |
| ----------------- | -----------------: | ----------------: |
| Approx. 3.5 Kg    |               1 Kg |        2.5 Litres |
| Approx. 1.7 Kg    |          500 Grams |       1.25 Litres |
| Approx. 350 Grams |          100 Grams |            250 ml |

3. MIXING STEPS

1. Blending:
Measure the required quantity of S-306 TANGY TROPIC powder and place it in a clean vessel.

2. Adding Water:
Gradually add lukewarm RO water while continuously whisking until the mixture becomes completely smooth.

3. Resting Period — Mandatory:
After mixing, cover the chutney and allow it to rest for 15 minutes.

Reason:
The tomato powder and garlic flavour need time to settle, while the powder needs time to develop the required body and thickness.

4. Final Consistency:
If the chutney appears too thick, add a small amount of water and adjust the consistency. The chutney should remain slightly thicker than coconut chutney. 

4. FRESH TEMPERING — THE KYROZ SIGNATURE

The urad dal tempering gives the Red Chutney an additional crunch and distinctive finish.

* Heat 2 teaspoons of oil in a small pan.
* Add mustard seeds, a small quantity of split urad dal, and 8–10 fresh curry leaves.
* When the urad dal turns light golden brown and the mustard seeds begin to splutter, pour the tempering over the chutney. 

5. TROUBLESHOOTING

| Issue                          | Cause                                             | Solution                                                         |
| ------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------- |
| Chutney is pale            | Cold water was used or the chutney was not rested | Use lukewarm water next time and allow it to rest for 15 minutes |
| Chutney is too spicy       | Too much S-306 TANGY TROPIC was added             | Add a small amount of sugar or some tomato powder                |
| Chutney is releasing water | The mixture was not mixed properly                | Whisk vigorously for 1–2 minutes                                 |
| Chutney tastes too salty   | Insufficient water was added                      | Add a little lukewarm water and adjust the quantity              |

6. HELPER ADVICE — CHEF-LESS KITCHEN

Taste Profile

The chutney should have a spicy and tangy taste. If a customer prefers less spice, serve a larger portion of coconut chutney with it.

Storage

Although this chutney has a good shelf life, for the best taste and freshness, prepare it fresh every day and store it in the refrigerator.

Presentation

The combination of white urad dal and green curry leaves tempering on the red chutney creates a premium visual presentation. 

Approved By: Mohd Arif Kamal (KYROZ+ Systems)`,
    contentHi: `1. तैयारी

पानी की गुणवत्ता

इस चटनी को तैयार करने के लिए गुनगुने RO पानी का उपयोग करें। गुनगुना पानी प्याज़ पाउडर और टमाटर पाउडर को जल्दी और अच्छी तरह पानी सोखने में मदद करता है।

महत्वपूर्ण नियम

चटनी तैयार करते समय नमक बिल्कुल न डालें।
आवश्यक 100% नमक पहले से ही S-306 TANGY TROPIC में मौजूद है। 

2. मिक्सिंग अनुपात

हर बार एक जैसा दक्षिण भारतीय स्वाद और consistency बनाए रखने के लिए हेल्पर को नीचे दिए गए माप चार्ट का सख्ती से पालन करना चाहिए।

| चटनी की मात्रा  | S-306 TANGY TROPIC | गुनगुना RO पानी |
| --------------- | -----------------: | --------------: |
| लगभग 3.5 किग्रा |           1 किग्रा |        2.5 लीटर |
| लगभग 1.7 किग्रा |          500 ग्राम |       1.25 लीटर |
| लगभग 350 ग्राम  |          100 ग्राम |        250 मिली |

3. चटनी बनाने की विधि

1. ब्लेंडिंग:
आवश्यक मात्रा में S-306 TANGY TROPIC पाउडर को मापकर एक साफ बर्तन में लें।

2. पानी मिलाना:
गुनगुना RO पानी धीरे-धीरे डालते हुए लगातार व्हिस्क करें, जब तक मिश्रण पूरी तरह चिकना और एकसार न हो जाए।

3. रेस्टिंग पीरियड — अनिवार्य:
मिक्स करने के बाद चटनी को ढककर 15 मिनट के लिए छोड़ दें।

कारण:
टमाटर पाउडर और लहसुन के स्वाद को अच्छी तरह सेट होने में समय लगता है। साथ ही, पाउडर को आवश्यक गाढ़ापन और body विकसित करने के लिए भी समय चाहिए।

4. अंतिम consistency:
यदि चटनी बहुत गाढ़ी लगे, तो थोड़ी मात्रा में पानी डालकर consistency समायोजित करें। चटनी की consistency नारियल चटनी से थोड़ी अधिक गाढ़ी होनी चाहिए। 

4. ताजा तड़का — KYROZ की विशेष पहचान

उड़द दाल का तड़का रेड चटनी को अतिरिक्त कुरकुरापन और विशेष स्वाद प्रदान करता है।

* एक छोटे पैन में 2 चम्मच तेल गरम करें।
* इसमें राई, थोड़ी मात्रा में split उड़द दाल और 8–10 ताजे करी पत्ते डालें।
* जब उड़द दाल हल्की सुनहरी भूरी हो जाए और राई चटकने लगे, तो तड़का चटनी के ऊपर डालें। 

5. समस्या और समाधान

| समस्या                        | कारण                                                       | समाधान                                                   |
| ----------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| चटनी का रंग फीका है       | ठंडे पानी का उपयोग किया गया या चटनी को रेस्ट नहीं दिया गया | अगली बार गुनगुने पानी का उपयोग करें और 15 मिनट रेस्ट दें |
| चटनी बहुत तीखी है         | S-306 TANGY TROPIC की मात्रा अधिक हो गई                    | थोड़ी मात्रा में चीनी या टमाटर पाउडर मिलाएँ              |
| चटनी पानी छोड़ रही है     | मिश्रण अच्छी तरह नहीं मिला                                 | 1–2 मिनट तक व्हिस्क से अच्छी तरह फेंटें                  |
| चटनी बहुत नमकीन लग रही है | पानी की मात्रा कम है                                       | थोड़ा गुनगुना पानी मिलाकर कुल मात्रा को समायोजित करें    |

6. हेल्पर के लिए सलाह — बिना शेफ वाली किचन

स्वाद

चटनी का स्वाद तीखा और खट्टा होना चाहिए। यदि ग्राहक कम तीखा पसंद करता है, तो उसके साथ अधिक मात्रा में नारियल चटनी परोसें।

स्टोरेज

हालाँकि इस चटनी की shelf life अच्छी है, लेकिन बेहतर स्वाद और ताजगी के लिए इसे हर दिन ताजा तैयार करें और फ्रिज में रखें।

प्रस्तुति

लाल चटनी के ऊपर सफेद उड़द दाल और हरे करी पत्ते का तड़का इसे देखने में प्रीमियम बनाता है। 

स्वीकृतकर्ता: Mohd Arif Kamal (KYROZ+ Systems)`
  },
  {
    title: 'KYROZ+ OPERATIONAL MANUAL: ALOO MASALA (STUFFING) (KY/SOP/ALU-03)',
    category: 'South Indian',
    contentEn: `1. PRE-COOKING PREPARATION

* Potato Preparation: Boil 1 kg of potatoes, peel them, and keep them ready.
* Mashing: Lightly mash the boiled potatoes by hand.
* CRITICAL RULE: Do not mash the potatoes into a smooth paste. Small pieces must remain so that the stuffing provides a proper texture when eating the dosa.
* NO SALT RULE: DO NOT ADD SALT while boiling the potatoes. All the required salt is already included in KYROZ S-302 YELLOW TEMPER. 

2. QUANTITY CHART

Always follow the specified ratio to maintain consistent taste every time.

| Boiled Potatoes | S-302 YELLOW TEMPER |                 RO Water |     Cooking Oil |
| --------------: | ------------------: | -----------------------: | --------------: |
|            1 Kg |           120 Grams | 150 ml (Approx. 1 glass) | 2–3 Tablespoons |
|       500 Grams |            60 Grams |                    75 ml | 1.5 Tablespoons |
|       250 Grams |            30 Grams |                    40 ml |    1 Tablespoon |

3. COOKING STEPS

1. Heat Oil:
Heat the required quantity of oil in a kadai according to the quantity chart.

2. Sauté S-302 YELLOW TEMPER:
Add KYROZ S-302 YELLOW TEMPER to the hot oil and sauté for only 30–40 seconds.

Important:
Do not allow the masala to burn. The mustard seeds should simply begin to splutter and the dal should turn lightly brown.

3. Add Water:
Immediately add the required RO water. As soon as the water is added, the dehydrated onions and curry leaves will rehydrate and form a thick masala base.

4. Add Potatoes:
Add the lightly mashed boiled potatoes to the kadai. Mix thoroughly so that the masala coats all the potatoes evenly.

5. Finishing:
Cook on low heat for 2 minutes, then switch off the gas.

Optional:
If fresh coriander is available in the kitchen, finely chop it and garnish the stuffing with it. 

4. TROUBLESHOOTING

| Issue                                            | Cause                                                      | Solution                                                                                                          |
| ------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Masala is too dry                            | Not enough water remains in the mixture                    | Add 2–3 teaspoons of hot RO water and soften the masala                                                           |
| Masala tastes too salty                      | The quantity of potatoes was insufficient                  | Mash and add 1–2 more boiled potatoes                                                                             |
| Masala has burned                            | The oil was too hot or the masala was sautéed for too long | Next time, add the masala as soon as the oil is hot and add water immediately                                     |
| Masala is not spreading properly on the dosa | The masala is too firm                                     | The stuffing should be semi-solid; add a little more water and mash it until the required consistency is achieved |

5. HELPER ADVICE — CHEF-LESS KITCHEN

* Freshness: Prepare only as much potato masala as can be consumed within the next 2–3 hours. Old potato masala can negatively affect the taste.
* Storage: Store any leftover masala in an airtight container in the refrigerator.
* Consistency: The stuffing should be soft enough to spread easily over the dosa without tearing it. 

Approved By: Mohd Arif Kamal (KYROZ+ Systems)`,
    contentHi: `1. पकाने से पहले की तैयारी

* आलू की तैयारी: 1 किलोग्राम आलू उबालकर, छीलकर तैयार रखें।
* मैश करना: उबले हुए आलू को हाथ से हल्के-हल्के मैश करें।
* महत्वपूर्ण नियम: आलू को पूरी तरह बारीक पीसकर पेस्ट न बनाएँ। आलू के छोटे-छोटे टुकड़े बने रहने चाहिए, ताकि डोसा खाते समय स्टफिंग की अच्छी बनावट महसूस हो।
* नमक का उपयोग न करें: आलू उबालते समय नमक बिल्कुल न डालें। आवश्यक पूरा नमक KYROZ S-302 YELLOW TEMPER में पहले से शामिल है। 

2. मात्रा चार्ट

हर बार एक जैसा स्वाद बनाए रखने के लिए नीचे दिए गए अनुपात का हमेशा पालन करें।

| उबले हुए आलू | S-302 YELLOW TEMPER |                 RO पानी |   पकाने का तेल |
| -----------: | ------------------: | ----------------------: | -------------: |
|     1 किग्रा |           120 ग्राम | 150 मिली (लगभग 1 गिलास) | 2–3 बड़े चम्मच |
|    500 ग्राम |            60 ग्राम |                 75 मिली | 1.5 बड़े चम्मच |
|    250 ग्राम |            30 ग्राम |                 40 मिली |   1 बड़ा चम्मच |

3. बनाने की विधि

1. तेल गरम करना:
मात्रा चार्ट के अनुसार आवश्यक तेल को कड़ाही में गरम करें।

2. S-302 YELLOW TEMPER भूनना:
गरम तेल में KYROZ S-302 YELLOW TEMPER डालें और केवल 30–40 सेकंड तक भूनें।

महत्वपूर्ण:
मसाला जलना नहीं चाहिए। केवल राई चटकने लगे और दाल हल्की सुनहरी भूरी हो जाए, इतना ही भूनना है।

3. पानी डालना:
तुरंत आवश्यक मात्रा में RO पानी डालें। पानी डालते ही सूखा प्याज़ और करी पत्ता पानी सोखकर फूल जाएगा और एक गाढ़ा मसाला बेस तैयार हो जाएगा।

4. आलू मिलाना:
हल्के मैश किए हुए उबले आलू कड़ाही में डालें। अच्छी तरह मिलाएँ ताकि मसाला सभी आलू पर समान रूप से लग जाए।

5. अंतिम पकाना:
मसाले को 2 मिनट तक धीमी आँच पर पकाएँ और फिर गैस बंद कर दें।

वैकल्पिक:
यदि किचन में ताजा हरा धनिया उपलब्ध हो, तो उसे बारीक काटकर ऊपर से डाल सकते हैं। 

4. समस्या और समाधान

| समस्या                                   | कारण                                               | समाधान                                                                                       |
| ---------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| मसाला बहुत सूखा है                   | मिश्रण में पानी कम रह गया है                       | 2–3 चम्मच गरम RO पानी डालकर मसाले को थोड़ा नरम करें                                          |
| मसाला बहुत नमकीन लग रहा है           | आलू की मात्रा कम थी                                | 1–2 उबले हुए आलू और मैश करके मिला दें                                                        |
| मसाला जल गया है                      | तेल बहुत अधिक गरम था या मसाला अधिक देर तक भुना गया | अगली बार तेल गरम होते ही मसाला डालें और तुरंत पानी डाल दें                                   |
| मसाला डोसे पर ठीक से फैल नहीं रहा है | मसाला बहुत सख्त है                                 | स्टफिंग semi-solid होनी चाहिए। थोड़ा और पानी मिलाकर मैश करें और सही consistency प्राप्त करें |

5. हेल्पर के लिए सलाह — बिना शेफ वाली किचन

* ताजगी: आलू मसाला उतना ही तैयार करें जितना अगले 2–3 घंटे में इस्तेमाल हो सके। पुराना आलू मसाला स्वाद को खराब कर सकता है।
* स्टोरेज: बचा हुआ मसाला एयरटाइट कंटेनर में रखकर फ्रिज में स्टोर करें।
* Consistency: स्टफिंग इतनी नरम होनी चाहिए कि उसे डोसे पर आसानी से फैलाया जा सके और डोसा फटे नहीं। 

स्वीकृतकर्ता: Mohd Arif Kamal (KYROZ+ Systems)`
  },
  {
    title: 'KYROZ+ OPERATIONAL MANUAL: PREMIUM SAMBHAR (KY/SOP/SAM-02)',
    category: 'South Indian',
    contentEn: `1. PRE-COOKING PREPARATION

* Fresh Vegetables: Cut bottle gourd (lauki), drumstick (sahjan), and onion into large pieces.
* Boiling Rule: Boil the vegetables separately in a vessel using RO water.
* CRITICAL RULE: DO NOT ADD SALT while boiling the vegetables. All the required salt is already present in S-308 LENTIL LAVA. 

2. MIXING & QUANTITY CHART

The helper must follow the measurements given below exactly.

| Sambhar Quantity | S-308 LENTIL LAVA |   RO Water | Fresh Boiled Vegetables |
| ---------------- | ----------------: | ---------: | ----------------------: |
| 10 Litres        |              1 Kg |   9 Litres |                  1.5 Kg |
| 5 Litres         |         500 Grams | 4.5 Litres |               750 Grams |
| 1 Litre          |         100 Grams |     900 ml |               150 Grams |

3. COOKING STEPS

1. Heat the Water:
In a large vessel, lightly heat the required quantity of RO water according to the quantity chart.

2. Blend S-308 LENTIL LAVA:
Gradually add KYROZ S-308 LENTIL LAVA to the warm water. Whisk continuously until all lumps have completely disappeared.

3. Add Vegetables:
Add the previously boiled fresh vegetables to the mixture.

4. Simmering:
Allow the sambhar to simmer on medium heat for 10–12 minutes. This allows the lentil powder and spices to blend uniformly.

5. Consistency Check:
If the sambhar is too thick, add a small amount of boiling RO water. Never add cold water. 

4. FRESH TEMPERING — MANDATORY STEP

After the sambhar has finished simmering, fresh tempering must be added.

* Heat 2 teaspoons of oil or ghee in a pan.
* Add mustard seeds, 2–3 whole dried red chillies, and 10–12 fresh curry leaves.
* Once the mustard seeds begin to splutter, pour the tempering into the sambhar and immediately cover the vessel with a lid so that the aroma remains trapped inside. 

5. TROUBLESHOOTING

| Issue                           | Cause                                                          | Solution                                                |
| ------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| Sambhar is too salty        | Too little water was added or salt was added to the vegetables | Add some boiling RO water and a small amount of jaggery |
| Sambhar is not salty enough | Too much water was added                                       | Simmer the sambhar for another 5–7 minutes to reduce it |
| Lumps are present           | S-308 LENTIL LAVA was added to cold water                      | Use a hand blender or strain the mixture                |
| Taste is bland              | The sambhar was not simmered properly                          | Allow it to simmer for at least 10 minutes              |

6. HELPER ADVICE — CHEF-LESS KITCHEN

* Portioning: Maintain a consistent ratio of vegetables and lentil-based sambhar for every customer.
* Hygiene: Always keep the sambhar covered.
* No Extra Salt: Do not keep open salt on the kitchen counter so that nobody accidentally adds extra salt to the sambhar. 

Approved By: Mohd Arif Kamal (KYROZ+ Systems)`,
    contentHi: `1. पकाने से पहले की तैयारी

* ताजी सब्जियों की तैयारी: लौकी, सहजन और प्याज़ को बड़े टुकड़ों में काट लें।
* उबालने की विधि: सब्जियों को अलग बर्तन में RO पानी के साथ उबाल लें।
* महत्वपूर्ण नियम: सब्जियाँ उबालते समय नमक बिल्कुल न डालें। आवश्यक पूरा नमक पहले से ही S-308 LENTIL LAVA में मौजूद है। 

2. मिक्सिंग एवं मात्रा चार्ट

हेल्पर को नीचे दिए गए माप के अनुसार ही सामग्री लेनी चाहिए।

| सांभर की मात्रा | S-308 LENTIL LAVA |  RO पानी | ताजी उबली सब्जियाँ |
| --------------- | ----------------: | -------: | -----------------: |
| 10 लीटर         |          1 किग्रा |   9 लीटर |         1.5 किग्रा |
| 5 लीटर          |         500 ग्राम | 4.5 लीटर |          750 ग्राम |
| 1 लीटर          |         100 ग्राम | 900 मिली |          150 ग्राम |

3. बनाने की विधि

1. पानी गरम करना:
एक बड़े बर्तन में मात्रा चार्ट के अनुसार आवश्यक RO पानी को हल्का गरम करें।

2. S-308 LENTIL LAVA मिलाना:
गर्म पानी में KYROZ S-308 LENTIL LAVA को धीरे-धीरे डालें। व्हिस्क की सहायता से लगातार मिलाते रहें, जब तक सारी गांठें पूरी तरह समाप्त न हो जाएँ।

3. सब्जियाँ मिलाना:
पहले से उबली हुई ताजी सब्जियों को तैयार मिश्रण में डालें।

4. धीमी आँच पर पकाना:
सांभर को मध्यम आँच पर 10–12 मिनट तक उबलने दें। इससे दाल का पाउडर और मसाले अच्छी तरह एकसार हो जाते हैं।

5. गाढ़ापन जाँच:
यदि सांभर बहुत गाढ़ा है, तो थोड़ी मात्रा में उबलता हुआ RO पानी मिलाएँ। ठंडा पानी कभी न डालें। 

4. ताजा तड़का — अनिवार्य चरण

सांभर के अच्छी तरह उबल जाने के बाद उसमें ताजा तड़का लगाना आवश्यक है।

* एक पैन में 2 चम्मच तेल या घी गरम करें।
* इसमें राई, 2–3 साबुत सूखी लाल मिर्च और 10–12 ताजे करी पत्ते डालें।
* जब राई चटकने लगे, तो तड़के को सांभर में डालें और तुरंत बर्तन को ढक्कन से ढक दें, ताकि तड़के की खुशबू सांभर में अच्छी तरह समा जाए। 

5. समस्या और समाधान

| समस्या                   | कारण                                              | समाधान                                                  |
| ------------------------ | ------------------------------------------------- | ------------------------------------------------------- |
| सांभर बहुत नमकीन है  | पानी कम डाला गया या सब्जियों में नमक डाल दिया गया | थोड़ा उबलता हुआ RO पानी और थोड़ी मात्रा में गुड़ मिलाएँ |
| सांभर में नमक कम है  | पानी अधिक हो गया है                               | सांभर को 5–7 मिनट और उबालकर थोड़ा गाढ़ा करें            |
| सांभर में गांठें हैं | S-308 LENTIL LAVA को ठंडे पानी में डाला गया       | हैंड ब्लेंडर का उपयोग करें या मिश्रण को छान लें         |
| स्वाद फीका है        | सांभर को पर्याप्त समय तक नहीं पकाया गया           | इसे कम से कम 10 मिनट तक उबलने दें                       |

6. हेल्पर के लिए सलाह — बिना शेफ वाली किचन

* Portioning: प्रत्येक ग्राहक को सब्जियों और दाल वाले सांभर का समान अनुपात मिले, इसका ध्यान रखें।
* स्वच्छता: सांभर को हमेशा ढककर रखें।
* अतिरिक्त नमक न डालें: किचन काउंटर पर खुला नमक न रखें, ताकि कोई गलती से सांभर में अतिरिक्त नमक न डाल दे। 

स्वीकृतकर्ता: Mohd Arif Kamal (KYROZ+ Systems)`
  },
  {
    title: 'KYROZ+ SOUTH INDIAN KITCHEN PRE-PREP & SETUP',
    category: 'South Indian',
    contentEn: `The Chef-less System

Daily Pre-Preparation Checklist
This checklist must be completed by 9:00 AM. 

STEP 1: HYDRATION STATION

Batch 1 — Batter Preparation

* Prepare the batter for Dosa, Idli, and Vada.
* After preparing the batter, keep it covered.

Batch 2 — Chutney Preparation

* Prepare both chutneys.
* Transfer the prepared chutneys to the refrigerator. 

STEP 2: CUTTING STATION — STANDARD CUTS

* Sambhar Vegetables: Cut bottle gourd and drumstick into 2-inch pieces and boil them.
* Potatoes: Boil 5 kg potatoes, mash them, and store them in the refrigerator.
* Toppings Mix: Keep a ready bowl containing a mixture of onion + tomato + coriander + green chilli. 

STEP 3: TADKA RACK — READY TO USE

Keep the following items refilled and ready in a tray:

1. Yellow/Black Mustard Seeds
2. Whole Dry Red Chillies
3. Fresh Curry Leaves
4. Split Urad Dal — for adding crunch to the tempering 

SECTION 3: STATION-WISE OPERATIONAL CARDS

These cards should be laminated and placed at the relevant kitchen station. 

CARD A: DOSA & UTTAPAM STATION

* Cleaning: Wipe the tawa with a wet cloth after every dosa.
* Heat: When water is sprinkled on the tawa, it should produce a “shhh” sound.
* Rule: Keep the uttapam batter thick and press the toppings gently into the batter. 

CARD B: SAMBHAR & CHUTNEY STATION

* Mixing: Always use a whisk while mixing to prevent lumps.
* Simmering: Allow the sambhar to simmer for at least 10–12 minutes.
* Salt Warning: The KYROZ premix already contains 100% of the required salt. Do not add additional salt. 

CARD C: FRYER & STEAM STATION

* Idli: Grease the moulds with oil and steam the idlis for 12 minutes.
* Vada: Maintain the fryer temperature at 180°C. Beat the batter for 2 minutes before frying. 

SECTION 4: DAILY AUDIT

Owner / Manager Checklist

Use this checklist for daily quality control. 

* [ ] Consistency: Does the chutney and sambhar taste the same as it did yesterday?
* [ ] Temperature: Is the sambhar piping hot when served?
* [ ] Hygiene: Has a carbon layer from the previous day accumulated on the tawa?
* [ ] Waste: How much batter was left at the end of the day? Adjust the next day's preparation/order accordingly.`,
    contentHi: `बिना शेफ वाली किचन प्रणाली

दैनिक प्री-प्रिपरेशन चेकलिस्ट
यह चेकलिस्ट सुबह 9:00 बजे तक पूरी हो जानी चाहिए। 

चरण 1: हाइड्रेशन स्टेशन

बैच 1 — घोल तैयार करना

* डोसा, इडली और वड़ा का घोल तैयार करें।
* घोल तैयार होने के बाद उसे ढककर रखें।

बैच 2 — चटनी तैयार करना

* दोनों चटनियाँ तैयार करें।
* तैयार चटनियों को फ्रिज में रख दें। 

चरण 2: कटिंग स्टेशन — मानक कटिंग

* सांभर की सब्जियाँ: लौकी और सहजन को 2 इंच के टुकड़ों में काटकर उबाल लें।
* आलू: 5 किलोग्राम आलू उबालकर मैश करें और फ्रिज में रखें।
* टॉपिंग मिक्स: एक बाउल में प्याज़ + टमाटर + हरा धनिया + हरी मिर्च का मिश्रण तैयार करके रखें। 

चरण 3: तड़का रैक — उपयोग के लिए तैयार

एक ट्रे में निम्नलिखित सामग्री पर्याप्त मात्रा में भरकर तैयार रखें:

1. पीली/काली राई
2. साबुत सूखी लाल मिर्च
3. ताजे करी पत्ते
4. उड़द दाल — तड़के में कुरकुरापन देने के लिए 

सेक्शन 3: स्टेशन के अनुसार ऑपरेशनल कार्ड

इन कार्डों को लैमिनेट करके संबंधित किचन स्टेशन पर लगाएँ। 

कार्ड A: डोसा एवं उत्तपम स्टेशन

* सफाई: हर डोसा बनाने के बाद तवे को गीले कपड़े से पोंछें।
* तापमान: तवे पर पानी छिड़कने पर “श्श्श” की आवाज आनी चाहिए।
* नियम: उत्तपम का घोल गाढ़ा रखें और टॉपिंग को हल्के हाथ से घोल में दबाएँ। 

कार्ड B: सांभर एवं चटनी स्टेशन

* मिक्सिंग: घोल मिलाते समय हमेशा व्हिस्क का उपयोग करें ताकि गांठें न बनें।
* सिमरिंग: सांभर को कम से कम 10–12 मिनट तक धीमी आँच पर पकने दें।
* नमक संबंधी चेतावनी: KYROZ प्रीमिक्स में आवश्यक 100% नमक पहले से मौजूद है। अलग से नमक बिल्कुल न डालें। 

कार्ड C: फ्रायर एवं स्टीम स्टेशन

* इडली: इडली के सांचों पर तेल लगाएँ और इडली को 12 मिनट तक स्टीम करें।
* वड़ा: फ्रायर का तापमान 180°C रखें। तलने से पहले घोल को 2 मिनट तक फेंटें। 

सेक्शन 4: दैनिक ऑडिट

मालिक / मैनेजर चेकलिस्ट

इस चेकलिस्ट का उपयोग दैनिक गुणवत्ता नियंत्रण के लिए करें। 

* [ ] Consistency: क्या चटनी और सांभर का स्वाद कल जैसा ही है?
* [ ] Temperature: क्या परोसते समय सांभर अच्छी तरह गरम है?
* [ ] Hygiene: क्या तवे पर पिछले दिन की कोई “कार्बन परत” जमा तो नहीं हुई है?
* [ ] Waste: दिन के अंत में कितना घोल बचा? अगले दिन की तैयारी/ऑर्डर की मात्रा उसी के अनुसार समायोजित करें।`
  },
  {
    title: 'KYROZ+ OPERATIONAL MANUAL: MIX-VEG UTTAPAM (KY/SOP/UTP-09)',
    category: 'South Indian',
    contentEn: `1. PRE-COOKING PREPARATION

* Batter: Use KYROZ S-305 STEAM CLOUD for preparing the uttapam batter.
* Vegetable Toppings: Keep a mixture of finely chopped onion, tomato, green chilli, and fresh coriander ready in a bowl.
* CRITICAL RULE: DO NOT ADD SALT to either the batter or the toppings. 100% of the required salt is already included in S-305 STEAM CLOUD. 

2. MIXING RATIO

The uttapam batter should be slightly thinner than idli batter and slightly thicker than dosa batter.

| S-305 STEAM CLOUD Powder |       RO Water | Required Consistency |
| ------------------------ | -------------: | -------------------- |
| 1 Kg                     | 1.4–1.5 Litres | Thick but pourable   |
| 500 Grams                |     700–750 ml | Semi-thick           |

3. COOKING STEPS — THE “PIZZA” TECHNIQUE

1. Mixing & Resting:
Mix S-305 STEAM CLOUD with water and allow the batter to rest for 15 minutes.

2. Tawa Temperature:
The tawa should be medium hot, slightly cooler than the tawa used for dosa.

3. Pouring:
Lightly grease the tawa with oil. Pour one large ladle of batter into the centre. Do not spread it thin like dosa batter. Keep the uttapam relatively thick.

4. Adding Toppings:
Immediately sprinkle the prepared mixed-vegetable toppings over the batter. Press them gently so that the toppings stick to the batter.

5. Oiling:
Add a little oil or butter around the edges and over the toppings.

6. Flipping:
Once the bottom surface becomes golden brown, carefully flip the uttapam. Cook the topping side for approximately 1 minute, allowing the onion and tomato to roast lightly.

7. Final Touch:
Flip it once more and serve hot. 

4. TROUBLESHOOTING

| Issue                               | Cause                                                             | Solution                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Uttapam is raw inside           | Batter was too thick or the heat was too high                     | Add a little water to the batter and cook on low heat                                    |
| Toppings are falling off        | Toppings were not pressed into the batter or the batter had dried | Add the toppings immediately after pouring the batter and press them gently with a ladle |
| Uttapam is not spongy           | Batter was not rested                                             | Never skip the mandatory 15-minute resting period                                        |
| Uttapam is sticking to the tawa | Tawa was too cold or insufficient oil was used                    | Check the tawa temperature and use butter/oil as required                                |

5. HELPER ADVICE — CHEF-LESS KITCHEN

* Colour Check: A golden-brown colour indicates good-quality uttapam. An excessively white uttapam may appear undercooked.
* Uniformity: Use the same fixed-size bowl or ladle for every uttapam so that all uttapams are of a consistent size.
* Serving Combination: The source notes that customers in North India often prefer Red Kara Chutney with uttapam. Therefore, always serve both chutneys. 

Approved By: Mohd Arif Kamal (KYROZ+ Systems)`,
    contentHi: `1. पकाने से पहले की तैयारी

* घोल: उत्तपम का घोल तैयार करने के लिए KYROZ S-305 STEAM CLOUD का उपयोग करें।
* सब्जियों की टॉपिंग: बारीक कटे हुए प्याज़, टमाटर, हरी मिर्च और ताजे हरे धनिए को एक बाउल में मिलाकर पहले से तैयार रखें।
* महत्वपूर्ण नियम: घोल या टॉपिंग में नमक बिल्कुल न डालें। आवश्यक 100% नमक पहले से ही S-305 STEAM CLOUD में शामिल है। 

2. मिक्सिंग अनुपात

उत्तपम का घोल इडली के घोल से थोड़ा पतला और डोसे के घोल से थोड़ा गाढ़ा होना चाहिए।

| S-305 STEAM CLOUD पाउडर |      RO पानी | आवश्यक गाढ़ापन          |
| ----------------------- | -----------: | ----------------------- |
| 1 किग्रा                | 1.4–1.5 लीटर | गाढ़ा लेकिन डालने योग्य |
| 500 ग्राम               | 700–750 मिली | अर्ध-गाढ़ा              |

3. बनाने की विधि — “पिज़्ज़ा” तकनीक

1. मिक्सिंग और रेस्टिंग:
S-305 STEAM CLOUD में पानी मिलाएँ और घोल को 15 मिनट के लिए रेस्ट करने दें।

2. तवे का तापमान:
तवा मध्यम गरम होना चाहिए। इसका तापमान डोसा बनाने वाले तवे से थोड़ा कम होना चाहिए।

3. घोल डालना:
तवे पर हल्का तेल लगाएँ। बीच में एक बड़ा करछुल घोल डालें। इसे डोसे की तरह पतला न फैलाएँ। उत्तपम को अपेक्षाकृत गाढ़ा रखें।

4. टॉपिंग डालना:
घोल डालते ही उसके ऊपर तैयार मिक्स-वेज टॉपिंग छिड़कें। टॉपिंग को हल्के हाथ से दबाएँ ताकि वह घोल से अच्छी तरह चिपक जाए।

5. तेल लगाना:
किनारों और टॉपिंग के ऊपर थोड़ा तेल या मक्खन डालें।

6. पलटना:
जब नीचे की सतह सुनहरी भूरी हो जाए, तो उत्तपम को सावधानी से पलटें। टॉपिंग वाली तरफ लगभग 1 मिनट तक पकाएँ, ताकि प्याज़ और टमाटर हल्के से भुन जाएँ।

7. अंतिम चरण:
उत्तपम को एक बार फिर पलटें और गरमा-गरम परोसें। 

4. समस्या और समाधान

| समस्या                      | कारण                                               | समाधान                                                        |
| --------------------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| उत्तपम अंदर से कच्चा है | घोल बहुत गाढ़ा था या आँच बहुत तेज थी               | घोल में थोड़ा पानी मिलाएँ और धीमी आँच पर पकाएँ                |
| टॉपिंग गिर रही है       | टॉपिंग को घोल में दबाया नहीं गया या घोल सूख गया था | घोल डालते ही टॉपिंग डालें और करछुल से हल्के हाथ से दबाएँ      |
| उत्तपम स्पंजी नहीं है   | घोल को रेस्ट नहीं दिया गया                         | 15 मिनट का रेस्ट बिल्कुल न छोड़ें                             |
| उत्तपम तवे पर चिपक गया  | तवा ठंडा था या तेल कम लगाया गया                    | तवे का तापमान जाँचें और आवश्यकतानुसार तेल/मक्खन का उपयोग करें |

5. हेल्पर के लिए सलाह — बिना शेफ वाली किचन

* रंग की जाँच: उत्तपम का सुनहरा-भूरा रंग उसकी अच्छी गुणवत्ता का संकेत है। बहुत अधिक सफेद उत्तपम अधपका दिखाई दे सकता है।
* एकरूपता: प्रत्येक उत्तपम का आकार समान रखने के लिए एक ही निश्चित आकार के बाउल या करछुल का उपयोग करें।
* सर्विंग कॉम्बिनेशन: स्रोत के अनुसार, उत्तर भारत में ग्राहक अक्सर उत्तपम के साथ Red Kara Chutney पसंद करते हैं। इसलिए हमेशा दोनों चटनियाँ साथ में परोसें। 

स्वीकृतकर्ता: Mohd Arif Kamal (KYROZ+ Systems)`
  },
  {
    title: 'KYROZ+ SOUTH INDIAN DAILY OPERATIONAL CHART',
    category: 'South Indian',
    contentEn: `1. MORNING SETUP & PRE-PREPARATION

Time: 8:00 AM – 10:00 AM

As soon as the helper arrives in the kitchen, these three tasks must be completed first. 

A. BATTER HYDRATION

* Dosa & Idli: Prepare the batter and allow it to rest for 20 minutes.
* Chutneys: Prepare the coconut chutney and red chutney, then transfer them to the refrigerator.
* Medu Vada: Prepare the batter, whisk it properly, and store it in the refrigerator. Cold batter helps the vada retain its shape better. 

B. VEGETABLE CUTTING — STANDARD SIZES

In a chef-less kitchen, vegetables should be cut in one planned preparation rather than repeatedly throughout the day.

* Sambhar: Cut bottle gourd, drumstick, and onion into large 2-inch pieces. Boil them and store them in the refrigerator.
* Aloo Masala: Boil, peel, and mash the potatoes. Keep them ready for use.
* Toppings — Uttapam/Rava Dosa: Prepare a mixed-vegetable bowl containing onion, tomato, green chilli, and coriander. 

C. THE “TADKA” STATION

Prepare a large container or tray and ensure that the following items are always adequately stocked:

* Mustard seeds
* Whole dry red chillies
* Curry leaves
* Oil/Ghee
* Urad dal 

2. DAILY STATION SETUP

A4 DISPLAY FOR THE KITCHEN

Every station should have the following checklist ready for the helper. 

| Station             | Items to Keep Ready                                                      |
| ------------------- | ------------------------------------------------------------------------ |
| Dosa Station    | Batter bowl, oil/butter, water mug, and clean cloth for cooling the tawa |
| Sambhar Station | Prepared sambhar base, boiled vegetables, and tempering pan              |
| Steam Station   | Greased idli stands, Medu Vada mix, and hot fryer oil                    |
| Packing Station | 3-section plates/boxes, chutney bowls, spoons, and napkins               |

3. STANDARD DAILY SCHEDULE

* 10:30 AM: Perform the Salt Check and Consistency Check for all batters and chutneys.
* 11:30 AM: Prepare the first fresh batch of Sambhar and Aloo Masala before the lunch rush.
* 4:00 PM: Prepare fresh Vada batter and refill the batter supply for the evening snack period.
* 9:30 PM — Closing: Transfer any remaining batter to the refrigerator, perform a deep cleaning of the tawa, and check the premix stock for the following day. 

4. OWNER’S QUALITY AUDIT

The effectiveness of the chef-less kitchen can be monitored through these four simple checks. 

1. Sound Test

When water is sprinkled on the tawa, does it produce the characteristic “shhh” sound?

Purpose: Tawa temperature check.

2. Visual Test

Is the sambhar a vibrant red colour and is the chutney white?

Purpose: Oxidation check.

3. Smell Test

Can you smell the aroma of fresh curry leaves and mustard-seed tempering in the kitchen?

Purpose: Freshness check.

4. Waste Check

How much batter was discarded at the end of the day?

Purpose: Portion-control and waste check.`,
    contentHi: `1. सुबह की तैयारी एवं प्री-प्रिपरेशन

समय: सुबह 8:00 बजे – 10:00 बजे

किचन में आते ही हेल्पर को सबसे पहले ये तीन कार्य पूरे करने चाहिए। 

A. घोल को तैयार करना

* डोसा और इडली: घोल तैयार करें और उसे 20 मिनट के लिए रेस्ट करने दें।
* चटनियाँ: नारियल चटनी और रेड चटनी तैयार करके उन्हें फ्रिज में रखें।
* मेडु वड़ा: घोल तैयार करें, उसे अच्छी तरह फेंटें और फ्रिज में रखें। ठंडा घोल वड़े को बेहतर आकार बनाए रखने में मदद करता है। 

B. सब्जियों की कटिंग — मानक आकार

बिना शेफ वाली किचन में सब्जियों की कटिंग बार-बार करने के बजाय एक बार में योजनाबद्ध तरीके से पूरी कर लेनी चाहिए।

* सांभर: लौकी, सहजन और प्याज़ को बड़े 2 इंच के टुकड़ों में काटें। इन्हें उबालकर फ्रिज में रखें।
* आलू मसाला: आलू उबालकर, छीलकर और मैश करके तैयार रखें।
* टॉपिंग — उत्तपम/रवा डोसा: प्याज़, टमाटर, हरी मिर्च और हरे धनिए का मिक्स-वेज बाउल तैयार रखें। 

C. “तड़का” स्टेशन

एक बड़ा डिब्बा या ट्रे तैयार करें और सुनिश्चित करें कि निम्नलिखित सामग्री हमेशा पर्याप्त मात्रा में उपलब्ध रहे:

* राई
* साबुत सूखी लाल मिर्च
* करी पत्ते
* तेल/घी
* उड़द दाल 

2. दैनिक स्टेशन सेटअप

किचन के लिए A4 डिस्प्ले

हेल्पर के लिए प्रत्येक स्टेशन पर नीचे दी गई चेकलिस्ट तैयार रहनी चाहिए। 

| स्टेशन            | तैयार रखने वाली सामग्री                                              |
| ----------------- | -------------------------------------------------------------------- |
| डोसा स्टेशन   | घोल का बाउल, तेल/मक्खन, पानी का मग और तवा ठंडा करने के लिए साफ कपड़ा |
| सांभर स्टेशन  | तैयार सांभर बेस, उबली हुई सब्जियाँ और तड़का लगाने का पैन             |
| स्टीम स्टेशन  | तेल लगे हुए इडली स्टैंड, मेडु वड़ा मिक्स और गरम फ्रायर तेल           |
| पैकिंग स्टेशन | 3-सेक्शन प्लेट/बॉक्स, चटनी की कटोरियाँ, चम्मच और नैपकिन              |

3. दैनिक मानक समय-सारणी

* सुबह 10:30 बजे: सभी घोल और चटनियों का नमक चेक और consistency चेक करें।
* सुबह 11:30 बजे: लंच के समय भीड़ शुरू होने से पहले सांभर और आलू मसाला का पहला ताजा बैच तैयार करें।
* शाम 4:00 बजे: शाम के स्नैक्स के लिए ताजा वड़ा घोल तैयार करें और घोल की सप्लाई को दोबारा भरें।
* रात 9:30 बजे — किचन बंद करते समय: बचे हुए घोल को फ्रिज में रखें, तवे की डीप क्लीनिंग करें और अगले दिन के लिए प्रीमिक्स स्टॉक की जाँच करें। 

4. मालिक की गुणवत्ता जाँच

बिना शेफ वाली किचन की गुणवत्ता को इन चार सरल जाँचों के माध्यम से मॉनिटर किया जा सकता है। 

1. आवाज की जाँच

तवे पर पानी छिड़कने पर क्या “श्श्श” की आवाज आती है?

उद्देश्य: तवे के तापमान की जाँच।

2. दृश्य जाँच

क्या सांभर का रंग चमकदार लाल है और चटनी का रंग सफेद है?

उद्देश्य: ऑक्सीडेशन की जाँच।

3. खुशबू की जाँच

क्या किचन में ताजे करी पत्ते और राई के तड़के की खुशबू आ रही है?

उद्देश्य: ताजगी की जाँच।

4. वेस्टेज जाँच

दिन के अंत में कितना घोल फेंका गया?

उद्देश्य: पोर्शन कंट्रोल और खाद्य अपव्यय की जाँच।`
  },
  {
    title: 'KYROZ+ SOUTH INDIAN DAILY OPERATIONAL CHART (Morning Pre-Opening Setup)',
    category: 'South Indian',
    contentEn: `1. MORNING PRE-OPENING SETUP

Time: 7:00 AM – 9:00 AM

A. Cleaning & Hygiene

* Sweep and mop the entire kitchen, service area, and entrance.
* Clean the dosa tawa, idli steamer, vada fryer, gas stove, and working tables.
* Wash all utensils, ladles, containers, and serving plates.
* Sanitize chopping boards and knives.
* Check the availability and cleanliness of RO water.
* Wash hands before beginning food preparation.
* Wear a clean uniform, apron, hairnet, and gloves.

B. Batter & Premix Preparation

* Prepare S-301 INSTANT DOSA batter according to its SOP.
* Prepare S-302 YELLOW TEMPER potato stuffing according to its SOP.
* Prepare S-303 COCONUT CLOUD chutney according to its SOP.
* Prepare S-304 CRISPY RING vada batter according to its SOP.
* Prepare S-305 STEAM CLOUD idli/uttapam batter according to its SOP.
* Prepare S-306 TANGY TROPIC red chutney according to its SOP.
* Keep all prepared items covered and label them with their preparation time.

C. Vegetable & Garnish Preparation

* Chop onions, tomatoes, green chillies, coriander, and curry leaves.
* Cut the vegetables required for sambhar.
* Boil potatoes for masala preparation.`,
    contentHi: `1. सुबह की किचन शुरू करने की तैयारी

समय: सुबह 7:00 बजे – 9:00 बजे

A. सफाई एवं स्वच्छता

* पूरी किचन, सर्विस एरिया और प्रवेश द्वार को झाड़ू लगाकर और पोछा लगाकर साफ करें।
* डोसा तवा, इडली स्टीमर, वड़ा फ्रायर, गैस स्टोव और काम करने वाली टेबलों को साफ करें।
* सभी बर्तन, करछुल, कंटेनर और सर्विंग प्लेटों को धोएँ।
* चॉपिंग बोर्ड और चाकुओं को सैनिटाइज करें।
* RO पानी की उपलब्धता और उसकी स्वच्छता की जाँच करें।
* भोजन तैयार करना शुरू करने से पहले हाथ अच्छी तरह धोएँ।
* साफ यूनिफॉर्म, एप्रन, हेयरनेट और ग्लव्स पहनें।

B. घोल एवं प्रीमिक्स की तैयारी

* S-301 INSTANT DOSA का घोल उसके SOP के अनुसार तैयार करें।
* S-302 YELLOW TEMPER की आलू स्टफिंग उसके SOP के अनुसार तैयार करें।
* S-303 COCONUT CLOUD की चटनी उसके SOP के अनुसार तैयार करें।
* S-304 CRISPY RING का वड़ा घोल उसके SOP के अनुसार तैयार करें।
* S-305 STEAM CLOUD का इडली/उत्तपम घोल उसके SOP के अनुसार तैयार करें।
* S-306 TANGY TROPIC की रेड चटनी उसके SOP के अनुसार तैयार करें।
* तैयार की गई सभी सामग्री को ढककर रखें और उन पर तैयारी का समय लिखकर लेबल लगाएँ।

C. सब्जियों एवं गार्निश की तैयारी

* प्याज़, टमाटर, हरी मिर्च, हरा धनिया और करी पत्ते काटें।
* सांभर के लिए आवश्यक सब्जियों को काटकर तैयार करें।
* मसाला तैयार करने के लिए आलू उबालें।`
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // We only clear the South Indian category to avoid deleting other global SOPs if any.
    await MasterSop.deleteMany({ category: 'South Indian' }); 
    await MasterSop.insertMany(actualSops);

    console.log(`Successfully seeded ${actualSops.length} ACTUAL Global SOPs for South Indian section.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
