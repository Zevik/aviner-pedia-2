// Test improved markdown cleaning logic

const testCases = [
  {
    name: 'רשומה 13901 - שאלה',
    input: '* שאלה:*\' איני יודע אם הרב מודע',
    expected: '**שאלה:** איני יודע אם הרב מודע'
  },
  {
    name: 'רשומה 13901 - מרדכי',
    input: '* *מרדכי**',
    expected: '**מרדכי**'
  },
  {
    name: 'רשומה 13752 - כותרת',
    input: '* תפילה נגד גזירה הגיוס*\'',
    expected: '**תפילה נגד גזירה הגיוס**'
  },
  {
    name: 'רשומה 13752 - שאלה/תשובה',
    input: '* *שאלה:** בבית כנסת',
    expected: '**שאלה:** בבית כנסת'
  },
  {
    name: 'רשומה 13752 - תשובה',
    input: '* *תשובה:** התפלל',
    expected: '**תשובה:** התפלל'
  },
  {
    name: 'רשומה 13752 - לימוד מגויים',
    input: '* *לימוד מגויים**',
    expected: '**לימוד מגויים**'
  },
  {
    name: 'רשומה 13752 - כל האומר',
    input: '* כל האומר דוד חטא*',
    expected: '**כל האומר דוד חטא**'
  }
];

function cleanMarkdown(content) {
  return content
    // Stage 1: Fix patterns with trailing punctuation
    // * text*' -> **text**
    // * text*| -> **text**
    .replace(/\* ([^*\n]+)\*['|"]/g, '**$1**')
    
    // Stage 2: Fix * *text:** -> **text:**
    .replace(/\* \*([^*]+):\*\*/g, '**$1:**')
    
    // Stage 3: Fix * *text** (at end or before space/newline) -> **text**
    .replace(/\* \*([^*]+)\*\*(?=\s|$)/g, '**$1**')
    
    // Stage 4: Fix * text:* -> **text:**
    .replace(/\* ([^*\n]+):\*/g, '**$1:**')
    
    // Stage 5: Fix * text* (standalone) -> **text**
    .replace(/\* ([^*\n]+)\*(?=\s|$)/g, '**$1**')
    
    // Stage 6: Remove standalone * * lines
    .replace(/^\* \*\s*$/gm, '')
    
    // Stage 7: Remove orphaned asterisks
    .replace(/^\*\s*\n/gm, '\n');
}

console.log('🧪 בדיקת ניקוי Markdown (גרסה 2):\n');

let passed = 0;
let failed = 0;

testCases.forEach(test => {
  const result = cleanMarkdown(test.input);
  const isPass = result === test.expected;
  
  if (isPass) passed++;
  else failed++;
  
  console.log(`${isPass ? '✅' : '❌'} ${test.name}`);
  console.log(`   קלט:    "${test.input}"`);
  console.log(`   תוצאה:  "${result}"`);
  console.log(`   צפוי:   "${test.expected}"`);
  if (!isPass) {
    console.log(`   ⚠️  לא תואם!`);
  }
  console.log('');
});

console.log(`\n📊 סיכום: ${passed}/${testCases.length} עברו`);
