import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

const HAKKA_SOP = {
  title: "Hakka Noodles, Fried Rice & White Garlic Style",
  category: "chinese",
  contentEn: `ENGLISH VERSION

Standard Operating Procedure (SOP)

Category: Chinese / Main Course

1. COVERED DISHES
* Veg Hakka Noodles
* Chicken Hakka Noodles
* Paneer Hakka Noodles
* Veg Fried Rice
* Chicken Fried Rice
* Paneer Fried Rice
* White Sauce Chinese Dishes / White Garlic Style

2. MORNING PREPARATION

| Preparation | Method | Important Rule |
| ----------- | ------ | -------------- |
| **Noodles** | Boil noodles until 80–90% cooked. Drain immediately. Wash with cold water. Apply a little oil and toss. | This prevents sticking and keeps noodles separate during wok tossing. |
| **Rice** | Cook rice until grains are separate. Cool completely. Store in trays. | Never use hot rice. Hot rice becomes sticky in the wok. |
| **White Base** | Keep ready: Chopped garlic, White pepper, Spring onion, Kyroz N-Core Powder, Garlic oil | |

3. HAKKA NOODLES COOKING (PER PORTION)

| Ingredient | Quantity |
| ---------- | -------: |
| **Oil** | 1 tbsp |
| **Chopped Garlic** | 1 tsp |
| **Julienne Vegetables** (Cabbage, Carrot, Capsicum, Spring Onion) | As required |
| **Boiled Noodles** | 180–200 g |
| **Kyroz N-Core Powder** | 1 tsp |
| **Garlic Oil** | 1 tsp |

**Cooking Steps**

1. Heat the wok on very high flame.
2. Add oil and chopped garlic. Toss for **5–10 seconds only**.
3. Add vegetables and toss on high flame for **15–20 seconds**.
4. Add noodles.
5. Add **Kyroz N-Core Powder** and **Garlic Oil**.
6. Toss rapidly and serve immediately.

4. FRIED RICE COOKING (PER PORTION)

| Ingredient | Quantity |
| ---------- | -------: |
| **Cooked Cold Rice** | 180–200 g |
| **Chopped Garlic** | 1 tsp |
| **Mixed Vegetables** | As required |
| **Kyroz N-Core Powder** | 1 tsp |
| **Garlic Oil** | 1 tsp |

**Cooking Steps**

Follow the same wok toss method as noodles: High flame, quick toss, and no overcooking.

5. WHITE GARLIC / WHITE CHINESE DISH SOP

| Ingredient | Quantity |
| ---------- | -------: |
| **Oil** | As required |
| **Chopped Garlic** | As required |
| **White Pepper** | A pinch |
| **Water** | As required |
| **Cornflour Slurry** | As required |
| **Fried Protein** (Paneer / Chicken / Mushroom) | As required |
| **Spring Onion** | For garnish |
| **Kyroz N-Core Powder** | As required |

**Cooking Steps**

1. Heat oil.
2. Add chopped garlic. Lightly cook (**do NOT brown**).
3. Add water and **Kyroz N-Core Powder**.
4. Add a little white pepper.
5. Add cornflour slurry to make a glossy white sauce.
6. Add fried protein and toss lightly.
7. Finish with spring onion.

6. TROUBLESHOOTING

| Problem | Reason | Solution |
| ------- | ------ | -------- |
| **Noodles are sticky** | Overboiled or no oil applied | Boil only 80–90% and always coat with oil |
| **Rice is mushy** | Fresh hot rice was used | Use cold, separated rice |
| **White dish turning brown** | Garlic browned or soy sauce contamination | Keep garlic light and avoid soy sauce |
| **Flavor is bland** | Less N-Core Powder used | Add an extra pinch |

7. KITCHEN GOLDEN RULE

**Chinese wok cooking = FAST cooking**

**Rules:**
* Very high flame
* Fast tossing
* No waiting

**Reason:**
This preserves the crunch, smoky wok aroma, and restaurant texture.`,
  contentHi: 'Not provided'
};

async function seedSop() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingSop = await MasterSop.findOne({ title: HAKKA_SOP.title });
    if (existingSop) {
      existingSop.contentEn = HAKKA_SOP.contentEn;
      existingSop.category = HAKKA_SOP.category;
      await existingSop.save();
      console.log('Updated: ' + HAKKA_SOP.title);
    } else {
      const newSop = new MasterSop(HAKKA_SOP);
      await newSop.save();
      console.log('Inserted: ' + HAKKA_SOP.title);
    }

  } catch (error) {
    console.error('Error seeding SOP:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedSop();
