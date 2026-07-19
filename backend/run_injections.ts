import mongoose from 'mongoose';
import { injectFastFood } from './src/controllers/fastFoodInject.controller';
import { injectMoreFastFood } from './src/controllers/moreFastFoodInject.controller';
import { injectChicken } from './src/controllers/chickenInject.controller';
import { injectMoreChicken } from './src/controllers/moreChickenInject.controller';
import { debugInjectMuttonDishes } from './src/controllers/muttonInject.controller';

const MONGO_URI = "mongodb+srv://vijayshankarprajapati29_db_user:3FxmRRA5ReXi2BqV@cluster0.wf2za1x.mongodb.net/?appName=Cluster0";

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected!");
        
        // Mock req, res
        const req = {} as any;
        const res = {
            status: (code: number) => ({
                json: (data: any) => console.log(data)
            })
        } as any;
        
        console.log("Injecting Fast Food...");
        await injectFastFood(req, res);
        
        console.log("Injecting More Fast Food...");
        await injectMoreFastFood(req, res);
        
        console.log("Injecting Chicken...");
        await injectChicken(req, res);
        
        console.log("Injecting More Chicken...");
        await injectMoreChicken(req, res);
        
        console.log("Injecting Mutton...");
        await debugInjectMuttonDishes(req, res);
        
        console.log("Done!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
