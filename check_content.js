const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkContent() {
  // בדיקה 1: שו"ת סמס - עולם קטן (יש תוכן)
  console.log('\n📱 שו"ת סמס - עולם קטן:');
  const { data: sms, error: smsError } = await supabase
    .from('content_items')
    .select('id, title, sub_category, content')
    .eq('main_category', 'שו"ת סמס - עולם קטן')
    .limit(3);
  
  if (smsError) console.error('Error:', smsError);
  else {
    console.log(`סה"כ רשומות: ${sms?.length || 0}`);
    sms?.forEach(item => {
      console.log(`\nID: ${item.id}`);
      console.log(`כותרת: ${item.title}`);
      console.log(`תת-קטגוריה: ${item.sub_category}`);
      console.log(`תוכן: ${item.content?.substring(0, 100)}...`);
    });
  }

  // בדיקה 2: שו"ת לפי נושא (ריק?)
  console.log('\n\n📚 שו"ת לפי נושא:');
  const { data: byTopic, error: topicError } = await supabase
    .from('content_items')
    .select('id, title, sub_category, content, link')
    .eq('main_category', 'שו"ת לפי נושא')
    .limit(5);
  
  if (topicError) console.error('Error:', topicError);
  else {
    console.log(`סה"כ רשומות: ${byTopic?.length || 0}`);
    byTopic?.forEach(item => {
      console.log(`\nID: ${item.id}`);
      console.log(`כותרת: ${item.title}`);
      console.log(`תת-קטגוריה: ${item.sub_category}`);
      console.log(`תוכן: ${item.content || 'אין תוכן!'}`);
      console.log(`לינק: ${item.link || 'אין לינק'}`);
    });
  }

  // בדיקה 3: הרשומה הספציפית 14385
  console.log('\n\n🔍 רשומה מספר 14385:');
  const { data: specific, error: specificError } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', 14385)
    .single();
  
  if (specificError) console.error('Error:', specificError);
  else {
    console.log('כל השדות:');
    Object.entries(specific).forEach(([key, value]) => {
      console.log(`  ${key}: ${value || '(ריק)'}`);
    });
  }
}

checkContent().catch(console.error);
