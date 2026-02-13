// Test the complete cleaning pipeline

const input = `* לימוד תנ"ך ופלגנות*'
* *שאלה:** האם לא כדאי לוותר על המחלוקת על התנ"ך כדי למנוע פלגנות?
* *תשובה:** טיעון דמגוגי ידוע של סתימת הפה וכל ביקורת בשם מניעת פלגנות.

* *תנ"ך בגובה עיניים**
* *שאלה:** האם תנ"ך בגובה עיניים הוא משבעים פנים לתורה?
* *תשובה:** לא. הוא טעות.`;

function cleanContent(content) {
  return content
    // Stage 1: Fix patterns with trailing punctuation
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
    .replace(/^\*\s*\n/gm, '\n')
    // Stage 8: Convert Q&A format to styled divs
    .replace(/^\*\*שאלה:\*\*\s*(.+)$/gm, '<div class="qa-question">**שאלה:** $1</div>')
    .replace(/^\*\*תשובה:\*\*\s*(.+)$/gm, '<div class="qa-answer">**תשובה:** $1</div>')
    .replace(/^ש:\s*(.+)$/gm, '<div class="qa-question">**ש:** $1</div>')
    .replace(/^ת:\s*(.+)$/gm, '<div class="qa-answer">**ת:** $1</div>');
}

console.log('🔍 קלט:');
console.log(input);
console.log('\n\n📝 תוצאה:');
console.log(cleanContent(input));
