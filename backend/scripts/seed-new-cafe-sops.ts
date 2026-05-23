import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import User from '../src/models/User';
import { syncMasterSopsForUser } from '../src/services/sop.service';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

const newSops = [
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

async function run() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    for (const sop of newSops) {
      await MasterSop.findOneAndUpdate(
        { title: sop.title },
        { $set: sop },
        { upsert: true, new: true }
      );
      console.log(`Upserted MasterSop: ${sop.title}`);
    }

    const users = await User.find({});
    console.log(`Syncing sops for ${users.length} user(s)...`);
    for (const user of users) {
      await syncMasterSopsForUser(user._id);
    }
    console.log('SOP Sync completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

run();
