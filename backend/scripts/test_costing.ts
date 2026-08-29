import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { getDishCosting } from '../src/controllers/costing.controller';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        
        const req = { params: { dishId: '6a92694897c4a85ee270314c' } } as any;
        const res = { 
            json: (data: any) => console.log(JSON.stringify(data, null, 2)), 
            status: (s: any) => ({ json: (d: any) => console.log('Err:', s, d) }) 
        } as any;
        
        await getDishCosting(req, res);
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
