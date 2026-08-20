const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'controllers');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Inject.controller.ts'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const regex = /const\s+userId\s*=\s*['"]test_user_id['"];[\s\S]*?const\s+activeUserId\s*=\s*testUser\s*\?\s*testUser\._id\s*:\s*['"]test_user_id['"];/;
  
  if (regex.test(content)) {
    console.log('Fixing:', file);
    content = content.replace(regex, `let activeUserId = req.body.userId || (req as any).user?.userId;
    if (!activeUserId) {
      const User = require('../models/User').default;
      const user = await User.findOne({ email: 'vijayshankarprajapati29@gmail.com' });
      if (!user) {
        res.status(400).json({ error: 'userId required' });
        return;
      }
      activeUserId = user._id;
    }`);
    fs.writeFileSync(filePath, content);
  }
});
