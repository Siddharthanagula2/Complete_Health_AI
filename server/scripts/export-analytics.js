#!/usr/bin/env node

/**
 * Manual analytics export script
 * Run with: npm run export-analytics
 */

const analyticsService = require('../services/analyticsService');
require('dotenv').config();

async function runExport() {
  try {
    console.log('🚀 Starting manual analytics export...\n');
    
    // Export yesterday's data
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const result = await analyticsService.exportDailyData(yesterday);
    
    console.log('\n✅ Export completed successfully!');
    console.log('📊 Export summary:');
    console.log(`   Date: ${result.exportDate.toDateString()}`);
    console.log(`   File: ${result.fileName}`);
    console.log('   Record counts:');
    
    Object.entries(result.recordCounts).forEach(([collection, count]) => {
      console.log(`     ${collection}: ${count} records`);
    });
    
    console.log('\n📈 Running sample analytics queries...');
    
    // Run some sample analytics
    try {
      const nutritionTrends = await analyticsService.getPopulationHealthTrends('7d');
      console.log(`   Nutrition trends (7 days): ${nutritionTrends.length} data points`);
      
      const exerciseTrends = await analyticsService.getExerciseTrends('7d');
      console.log(`   Exercise trends (7 days): ${exerciseTrends.length} data points`);
      
      const sleepTrends = await analyticsService.getSleepQualityTrends('7d');
      console.log(`   Sleep trends (7 days): ${sleepTrends.length} data points`);
      
    } catch (analyticsError) {
      console.log('   ⚠️  Analytics queries skipped (no data yet)');
    }
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

// Run export if called directly
if (require.main === module) {
  runExport();
}

module.exports = runExport;