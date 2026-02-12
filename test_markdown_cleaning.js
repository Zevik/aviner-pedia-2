// Test the markdown cleaning logic

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
  }
];

function cleanMarkdown(content) {
  return content
    .replace(/\*([^*\n]+)\*['|"]/g, '**$1**')
    .replace(/^\* \*([^*\n]+):\*\*/gm, '**$1:**')
    .replace(/^\* \*\s*$/gm, '')
    .replace(/\*([^*\n]+):\*/g, '**$1:**')
    .replace(/^\*\s*\n/gm, '\n');
}

console.log('🧪 בדיקת ניקוי Markdown:\n');

testCases.forEach(test => {
  const result = cleanMarkdown(test.input);
  const passed = result === test.expected;
  
  console.log(`${passed ? '✅' : '❌'} ${test.name}`);
  console.log(`   קלט:    "${test.input}"`);
  console.log(`   תוצאה:  "${result}"`);
  console.log(`   צפוי:   "${test.expected}"`);
  if (!passed) {
    console.log(`   ⚠️  לא תואם!`);
  }
  console.log('');
});
