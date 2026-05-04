import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

const demoSops = [
  {
    title: 'CLASSIC SHAHI PANEER',
    category: 'Dish',
    contentEn: '1. Cut paneer into cubes. 2. Prepare gravy with tomatoes, cashews, and spices. 3. Simmer together for 10 minutes.',
    contentHi: '1. पनीर को क्यूब्स में काटें। 2. टमाटर, काजू और मसालों के साथ ग्रेवी तैयार करें। 3. 10 मिनट तक एक साथ उबालें।'
  },
  {
    title: 'KITCHEN HYGIENE PROTOCOL',
    category: 'Rules',
    contentEn: '1. Wash hands every 30 minutes. 2. Wear hairnets. 3. Sanitize surfaces after every shift.',
    contentHi: '1. हर 30 मिनट में हाथ धोएं। 2. हेयरनेट पहनें। 3. हर शिफ्ट के बाद सतहों को साफ करें।'
  },
  {
    title: 'YELLOW GRAVY BASE',
    category: 'Gravy',
    contentEn: 'Master yellow gravy for mixed veg and dal tadka.',
    contentHi: 'मिक्स्ड वेज और दाल तड़का के लिए मास्टर येलो ग्रेवी।'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    await MasterSop.deleteMany({}); // Clear existing
    await MasterSop.insertMany(demoSops);

    console.log('Successfully seeded 3 Global SOPs.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
