const fs = require('fs');
const path = require('path');

const contentEn = `1. PREPARATION

• Meat: Make deep cuts/slits in 1 kg meat.

• Rice: Soak 1 kg Long Grain Basmati Rice for 30 minutes. For Sella Rice, soak for 1–1.5 hours.

• Fresh Ingredients:

* Ginger-Garlic Paste – 40 g
* Lemon – 2
* Green Chillies – 5–6
* Onions – 2, finely chopped

2. MEAT MARINATION – B-404 A

• In a bowl, mix B-404 A, 40 g Ginger-Garlic Paste, juice of 2 lemons, and 30 ml oil.

• Apply the mixture thoroughly to the meat, ensuring that it reaches inside the cuts.

• Marinate for:

* Chicken – 1 hour
* Mutton – 2 hours

3. STEAMING & STOCK PREPARATION

• In a large vessel, boil 2–3 litres of water.

• Place a steamer/strainer over the vessel.

• Place the marinated meat in the steamer and cover it.

• Cook on low heat until the meat becomes tender.

• Chicken: Approximately 30–45 minutes.

• Mutton: Approximately 1–1.5 hours.

• Check the meat periodically during cooking.

IMPORTANT – STOCK:

The natural juices released from the meat during steaming will collect in the water below.

DO NOT DISCARD THIS LIQUID.

This meat-infused liquid is the STOCK and will be used to cook the rice.

4. RICE COOKING – B-404 B

• In a separate large vessel, heat 150 ml oil.

• Add the onions and cook only until they become soft and light pink. Do not brown or darken the onions.

• Add B-404 B and roast lightly for 10–15 seconds.

• Immediately add the measured meat stock.

• Use approximately double the quantity of liquid/stock compared to the quantity of rice.

• Once the liquid starts boiling, add 5–6 split green chillies and the soaked, drained rice.

• Cook until the liquid is absorbed.

• Cover and give the rice 15 minutes of Dum.

5. FINISHING & PRESENTATION – ROYAL LOOK

A. Meat Fry

• Transfer the steamed meat to a pan.

• Fry with a small amount of oil for approximately 2 minutes.

• The outside should become crispy and orange while the inside remains tender and juicy.

B. Serving

• Place the white rice on the serving plate first.

• Arrange the crispy orange meat on top of the rice.

C. Dhungar

• Place a burning charcoal piece in the centre.

• Add ghee over the charcoal.

• Immediately cover the dish for approximately 5 minutes to infuse a smoky flavour.

D. Sides & Garnishing

Serve with:

• Lal Chutney / Sahawek
• Kachumber Salad
• Roasted Almonds
• Raisins
• Barista / Crispy Fried Onions
• Dried Lemon (Kaala Nimbu), as applicable

6. TROUBLESHOOTING – HELPER TIPS

A. Rice Colour

• If the rice becomes yellowish or dull, reduce the amount of onion roasting in the next batch.

• Allow the stock to cool and use only clear/clean liquid for cooking the rice.

B. Meat is Tough

• If the meat becomes tough after frying, increase the steaming time in the next batch.

• Ensure that the meat is properly tender before frying.

C. Salt Check

• Before adding the rice, taste the cooking liquid.

• The liquid should taste noticeably salty because the rice will absorb and balance the salt during cooking.

7. MANDI DISH PRESENTATION CHECKLIST

Rice:

[ ] Each grain is separate and the rice is visibly white.

Meat:

[ ] Outside is crispy and orange.

[ ] Inside is tender and juicy.

Aroma:

[ ] Smoky charcoal aroma is present.

[ ] Dried Lemon (Kaala Nimbu) aroma is noticeable.

Sides:

[ ] Chutney is spicy, fresh, and properly prepared.

[ ] Salad and garnishes are fresh and neatly presented.

FINAL QUALITY STANDARD

WHITE RICE + CRISPY ORANGE MEAT + SMOKY AROMA + FRESH SIDES = ROYAL INDO-ARABIC WHITE MANDI`;

const contentHi = `1. तैयारी

• मीट: 1 किलो मीट पर गहरे चीरे लगाएं।

• चावल: 1 किलो लॉन्ग ग्रेन बासमती चावल को 30 मिनट तक भिगोएं। सैला चावल के लिए 1–1.5 घंटे तक भिगोएं।

• ताज़ी सामग्री:

* अदरक-लहसुन पेस्ट – 40 ग्राम
* नींबू – 2
* हरी मिर्च – 5–6
* प्याज़ – 2, बारीक कटे हुए

2. मीट मैरिनेशन – B-404 A

• एक बर्तन में B-404 A, 40 ग्राम अदरक-लहसुन पेस्ट, 2 नींबू का रस और 30 मिलीलीटर तेल मिलाएं।

• तैयार मिश्रण को मीट पर अच्छी तरह लगाएं और सुनिश्चित करें कि मसाला कटे हुए हिस्सों के अंदर तक पहुंचे।

• मैरिनेट करने का समय:

* चिकन – 1 घंटा
* मटन – 2 घंटे

3. स्टीमिंग और स्टॉक तैयार करना

• एक बड़े भगोने में 2–3 लीटर पानी उबालें।

• भगोने के ऊपर स्टीमर/छलनी रखें।

• मैरिनेट किए हुए मीट को स्टीमर में रखें और ढक दें।

• मीट को धीमी आंच पर तब तक पकाएं जब तक वह नरम न हो जाए।

• चिकन: लगभग 30–45 मिनट।

• मटन: लगभग 1–1.5 घंटे।

• खाना पकने के दौरान मीट को बीच-बीच में चेक करते रहें।

महत्वपूर्ण – स्टॉक:

स्टीमिंग के दौरान मीट से निकलने वाला प्राकृतिक जूस नीचे रखे पानी में जमा होगा।

इस लिक्विड को बिल्कुल न फेंकें।

यह मीट-इन्फ्यूज्ड स्टॉक है, जिसका उपयोग चावल पकाने के लिए किया जाएगा।

4. चावल पकाना – B-404 B

• एक अलग बड़े भगोने में 150 मिलीलीटर तेल गर्म करें।

• प्याज़ डालें और केवल तब तक पकाएं जब तक वे नरम और हल्के गुलाबी न हो जाएं। प्याज़ को भूरा या गहरा नहीं करना है।

• इसमें B-404 B डालकर 10–15 सेकंड हल्का भूनें।

• तुरंत मापकर रखा हुआ मीट स्टॉक डालें।

• चावल की मात्रा से लगभग दोगुनी मात्रा में लिक्विड/स्टॉक इस्तेमाल करें।

• जब लिक्विड उबलने लगे, तब 5–6 चीरी हुई हरी मिर्च और भीगे हुए, छाने हुए चावल डालें।

• चावल को तब तक पकाएं जब तक लिक्विड पूरी तरह सोख न जाए।

• बर्तन को ढककर 15 मिनट दम दें।

5. फिनिशिंग और प्रेजेंटेशन – रॉयल लुक

A. मीट फ्राई

• स्टीम किए हुए मीट को पैन में डालें।

• थोड़े तेल के साथ लगभग 2 मिनट फ्राई करें।

• मीट बाहर से क्रिस्पी और ऑरेंज होना चाहिए, जबकि अंदर से नरम और जूसी रहना चाहिए।

B. सर्विंग

• सर्विंग प्लेट में सबसे पहले व्हाइट राइस रखें।

• चावल के ऊपर क्रिस्पी ऑरेंज मीट रखें।

C. धुंगर

• बीच में जलता हुआ कोयला रखें।

• कोयले के ऊपर घी डालें।

• तुरंत डिश को लगभग 5 मिनट के लिए ढक दें ताकि उसमें स्मोकी फ्लेवर आ जाए।

D. साइड्स और गार्निशिंग

इसके साथ सर्व करें:

• लाल चटनी / सहावेक
• कचुंबर सलाद
• भुने हुए बादाम
• किशमिश
• बरिस्ता / क्रिस्पी फ्राइड प्याज़
• सूखा नींबू (काला नींबू), आवश्यकतानुसार

6. समस्या समाधान – हेल्पर टिप्स

A. चावल का रंग

• अगर चावल पीले या मैले दिखाई दें, तो अगली बार प्याज़ को कम भूनें।

• स्टॉक को ठंडा करके केवल साफ लिक्विड का इस्तेमाल करें।

B. मीट सख्त है

• अगर फ्राई करने के बाद मीट सख्त लगे, तो अगली बार स्टीमिंग का समय थोड़ा बढ़ाएं।

• फ्राई करने से पहले सुनिश्चित करें कि मीट अच्छी तरह नरम हो चुका हो।

C. नमक की जांच

• चावल डालने से पहले पानी/स्टॉक का स्वाद चखें।

• लिक्विड का स्वाद उचित रूप से तेज नमकीन होना चाहिए, क्योंकि चावल पकते समय नमक को सोख लेगा।

7. मंडी डिश प्रेजेंटेशन चेकलिस्ट

चावल:

[ ] चावल का प्रत्येक दाना अलग है और चावल सफेद दिखाई दे रहा है।

मीट:

[ ] बाहर से क्रिस्पी और ऑरेंज है।

[ ] अंदर से नरम और जूसी है।

खुशबू:

[ ] कोयले की स्मोकी खुशबू आ रही है।

[ ] सूखे नींबू (काला नींबू) की खुशबू महसूस हो रही है।

साइड्स:

[ ] चटनी तीखी, ताज़ा और अच्छी तरह तैयार है।

[ ] सलाद और गार्निशिंग ताज़ी एवं साफ-सुथरे तरीके से प्रस्तुत की गई है।

अंतिम गुणवत्ता मानक

सफेद चावल + क्रिस्पी ऑरेंज मीट + स्मोकी खुशबू + ताज़ी साइड्स = रॉयल इंडो-अरेबिक व्हाइट मंडी`;

const newSop = {
  title: 'INDO-ARABIC WHITE MANDI',
  category: 'Mandi',
  contentEn,
  contentHi
};

const str = ',\n  ' + JSON.stringify(newSop, null, 2).replace(/\n/g, '\n  ') + '\n];';

const filePath = path.resolve(__dirname, 'scripts/seed-master-sops.ts');
let fileContent = fs.readFileSync(filePath, 'utf8');

if (!fileContent.includes('INDO-ARABIC WHITE MANDI')) {
  fileContent = fileContent.replace(/\n\];/, str);
  fs.writeFileSync(filePath, fileContent);
  console.log('Injected new SOP into seed-master-sops.ts');
} else {
  console.log('SOP already exists in the file.');
}
