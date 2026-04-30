require('dotenv').config({ path: './backend/.env' });
const { sequelize } = require('../config/sequelize');
const SystemSetting = require('../modules/system/system.model');


async function seed() {
  try {
    console.log("⏳ Syncing database...");
    await sequelize.sync();
    
    console.log("⏳ Seeding system settings...");
    await SystemSetting.bulkCreate([
      { key: 'SYSTEM_NAME', value: 'Auto ERP Global', group: 'GENERAL', description: 'Display name of the system' },
      { key: 'MAINTENANCE_MODE', value: 'false', group: 'GENERAL', description: 'Enable/Disable maintenance mode' },
      { key: 'MAX_PRODUCTION_CAPACITY', value: '500', group: 'PRODUCTION', description: 'Monthly production limit' },
      { key: 'ADMIN_EMAIL', value: 'admin@autoerp.com', group: 'GENERAL', description: 'Primary contact email' }
    ], { ignoreDuplicates: true });

    console.log('✅ System settings seeded successfully');
    process.exit(0);
  } catch (e) {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  }
}

seed();
