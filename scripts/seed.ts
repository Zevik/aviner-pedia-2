/**
 * CSV Data Seeding Script for Avinerpedia
 *
 * This script reads the full_database.csv file and populates
 * the Supabase database with sanitized content.
 *
 * Usage: npm run seed
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please create a .env.local file with:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CSVRow {
  'מזהה': string;
  'כותרת': string;
  'קטגוריה ראשית (אתר)': string;
  'קטגוריה משנית (אתר)': string;
  'Video ID': string;
  'תאריך': string;
  'תקציר': string;
  'תגיות מקור': string;
  'תוכן נקי (MD)': string;
}

/**
 * Sanitize a string value by removing leading single quotes
 * that were added to prevent Excel formatting issues
 */
function sanitize(value: string | undefined | null): string | null {
  if (!value) return null;

  // Remove leading single quote if present
  const cleaned = value.trim().replace(/^'/, '');

  // Return null for empty strings
  return cleaned === '' ? null : cleaned;
}

/**
 * Parse date string to ISO format
 */
function parseDate(dateStr: string | null): string | null {
  if (!dateStr) return null;

  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
}

/**
 * Map CSV row to database record
 */
function mapRowToRecord(row: CSVRow) {
  const original_id = sanitize(row['מזהה']);
  const title = sanitize(row['כותרת']);
  const main_category = sanitize(row['קטגוריה ראשית (אתר)']);
  const sub_category = sanitize(row['קטגוריה משנית (אתר)']);
  const video_id = sanitize(row['Video ID']);
  const publish_date = parseDate(sanitize(row['תאריך']));
  const summary = sanitize(row['תקציר']);
  const original_tags = sanitize(row['תגיות מקור']);
  const content_md = sanitize(row['תוכן נקי (MD)']);

  // Validate required fields
  if (!title || !main_category) {
    return null;
  }

  return {
    original_id: original_id ? parseInt(original_id, 10) : null,
    title,
    main_category,
    sub_category,
    video_id,
    publish_date,
    summary,
    original_tags,
    content_md,
  };
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  // Read CSV file
  const csvPath = path.join(process.cwd(), '..', 'full_database.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at: ${csvPath}`);
    console.error('Please ensure full_database.csv is in the parent directory.');
    process.exit(1);
  }

  console.log(`📂 Reading CSV from: ${csvPath}`);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV
  console.log('📊 Parsing CSV data...');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as CSVRow[];

  console.log(`✅ Parsed ${records.length} rows\n`);

  // Map and filter records
  console.log('🔄 Mapping and sanitizing data...');
  const mappedRecords = records
    .map(mapRowToRecord)
    .filter(Boolean);

  console.log(`✅ Prepared ${mappedRecords.length} valid records\n`);

  // Insert in batches
  const BATCH_SIZE = 100;
  let inserted = 0;
  let errors = 0;

  console.log('💾 Inserting records into database...');
  console.log(`   Batch size: ${BATCH_SIZE}\n`);

  for (let i = 0; i < mappedRecords.length; i += BATCH_SIZE) {
    const batch = mappedRecords.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(mappedRecords.length / BATCH_SIZE);

    process.stdout.write(`   Processing batch ${batchNumber}/${totalBatches}...`);

    const { data, error } = await supabase
      .from('content_items')
      .insert(batch)
      .select();

    if (error) {
      console.error(`\n   ❌ Error in batch ${batchNumber}:`, error.message);
      errors += batch.length;
    } else {
      inserted += data?.length || 0;
      console.log(` ✓ (${inserted} total)`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n🎉 Seeding completed!');
  console.log(`   ✅ Successfully inserted: ${inserted}`);
  console.log(`   ❌ Failed: ${errors}`);
  console.log(`   📊 Total processed: ${mappedRecords.length}\n`);
}

// Run the seeding script
seedDatabase()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
