import mongoose from 'mongoose';
import RawMaterial from './src/models/RawMaterial';
import PortionMaster from './src/models/PortionMaster';
import SemiFinishedGood from './src/models/SemiFinishedGood';

const run = async () => {
    try {
        await mongoose.connect('mongodb+srv://vijayshankarprajapati29_db_user:3FxmRRA5ReXi2BqV@cluster0.wf2za1x.mongodb.net/?appName=Cluster0');
        const rmMats = await RawMaterial.find({}, '_id code name');
        const sfgMats = await SemiFinishedGood.find({}, '_id code name');
        const p = await PortionMaster.findOne({ code: 'PT_ALOO_GOBHI_MATAR' });
        
        console.log('RM Count:', rmMats.length);
        console.log('SFG Count:', sfgMats.length);
        
        if (!p) {
            console.log('Portion Master not found!');
            await mongoose.disconnect();
            return;
        }
        
        console.log('Portion Master Ingredients:');
        for (const ing of p.ingredients) {
            const matchRM = rmMats.find(rm => rm._id.toString() === ing.sfgId.toString());
            const matchSFG = sfgMats.find(sfg => sfg._id.toString() === ing.sfgId.toString());
            const name = matchRM ? matchRM.name : (matchSFG ? matchSFG.name : 'NOT FOUND IN RM/SFG');
            console.log(ing.sfgId + ' => ' + name);
        }

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
        await mongoose.disconnect();
    }
}
run();
