// Namma Class — the three games change with the CLASS picked at the top and the SUBJECT card tapped.
// Loaded after app.js. Subjects: Tamil, English, Mathematics, Science (EVS for Classes 1–2).
(function () {
  const $ = (s) => document.querySelector(s);
  const cls = () => Number($('#classSelect').value) || 1;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let subject = 'Mathematics';
  const subjectKey = () => (subject === 'Environmental Science' || subject === 'Science' ? 'Science' : subject);
  const SUBJECT_NAME = { Tamil: 'Tamil', English: 'English', Mathematics: 'Maths', Science: 'Science' };

  /* ======================= MATHS number questions (one generator per class) ======================= */
  const NUMBER = {
    1: { t: 'Number Pop!', d: 'Count the stars and pick the right number.',
         make: () => { const n = rnd(1, 9); return { q: '⭐ '.repeat(n) + '<br>How many stars?', a: n }; } },
    2: { t: 'Add & Take Away', d: 'Add and subtract numbers up to 100.',
         make: () => { if (Math.random() < .5) { const a = rnd(10, 60), b = rnd(5, 39); return { q: `${a} + ${b} = ?`, a: a + b }; }
                       const a = rnd(30, 99), b = rnd(5, a - 10); return { q: `${a} − ${b} = ?`, a: a - b }; } },
    3: { t: 'Times Tables', d: 'Practise the 2 to 10 times tables.',
         make: () => { const a = rnd(2, 10), b = rnd(2, 10); return { q: `${a} × ${b} = ?`, a: a * b }; } },
    4: { t: 'Share Equally', d: 'Division facts — share into equal groups.',
         make: () => { const b = rnd(2, 10), c = rnd(2, 12); return { q: `${b * c} ÷ ${b} = ?`, a: c }; } },
    5: { t: 'Big Multiply', d: 'Multiply a 2-digit number by a 1-digit number.',
         make: () => { const a = rnd(12, 99), b = rnd(2, 9); return { q: `${a} × ${b} = ?`, a: a * b }; } },
    6: { t: 'Integer Island', d: 'Add positive and negative numbers.',
         make: () => { const a = rnd(-15, 15), b = rnd(-15, 15); const s = b < 0 ? `${a} + (${b})` : `${a} + ${b}`; return { q: `${s} = ?`, a: a + b }; } },
    7: { t: 'Percent Power', d: 'Find a percentage of a number.',
         make: () => { const p = [10, 20, 25, 50, 75][rnd(0, 4)], n = rnd(1, 20) * 20; return { q: `${p}% of ${n} = ?`, a: n * p / 100 }; } },
    8: { t: 'Square Roots', d: 'Find the square root of a perfect square.',
         make: () => { const n = rnd(11, 30); return { q: `√${n * n} = ?`, a: n }; } },
    9: { t: 'Solve for x', d: 'Solve simple linear equations.',
         make: () => { const a = rnd(2, 9), x = rnd(1, 12), b = rnd(1, 20); return { q: `${a}x + ${b} = ${a * x + b}<br>x = ?`, a: x }; } },
    10: { t: 'AP Explorer', d: 'Find the nth term of an arithmetic progression.',
          make: () => { const a = rnd(1, 15), d = rnd(2, 9), n = rnd(5, 20); return { q: `a = ${a}, d = ${d}<br>t<sub>${n}</sub> = ?`, a: a + (n - 1) * d }; } },
    11: { t: 'Log Lab', d: 'Evaluate logarithms.',
          make: () => { const base = [2, 3, 5, 10][rnd(0, 3)], k = rnd(2, base === 2 ? 8 : 4); return { q: `log<sub>${base}</sub> ${Math.pow(base, k)} = ?`, a: k }; } },
    12: { t: 'Derivative Dash', d: 'Differentiate and evaluate at a point.',
          make: () => { const a = rnd(1, 5), n = rnd(2, 4), x = rnd(1, 3); return { q: `f(x) = ${a === 1 ? '' : a}x<sup>${n}</sup><br>f′(${x}) = ?`, a: a * n * Math.pow(x, n - 1) }; } }
  };

  /* ======================= Pairs (memory game + quick quiz) and sorts, by subject → class ======================= */
  // pairs: { t, d, p: [[left, right], ...] }   sort: { t, d, a, b, ask, items: [[name, 1 = group a / 0 = group b], ...] }
  const DATA = {
   Mathematics: {
    1: { pairs: { t: 'Number & Dots', d: 'Match each number with its dots.', p: [['1', '●'], ['2', '● ●'], ['3', '● ● ●'], ['4', '● ● ● ●'], ['5', '● ● ● ● ●']] },
         sort: { t: 'Small or Big?', d: 'Is the number less than 5 or more than 5?', a: 'Less than 5', b: 'More than 5', ask: 'Less or more than 5?', items: [['2', 1], ['7', 0], ['1', 1], ['9', 0], ['3', 1], ['8', 0]] } },
    2: { pairs: { t: 'Sum Match', d: 'Match each sum with its answer.', p: [['3 + 4', '7'], ['10 + 5', '15'], ['9 − 3', '6'], ['20 + 20', '40'], ['12 − 2', '10']] },
         sort: { t: 'Even or Odd?', d: 'Sort the numbers.', a: 'Even', b: 'Odd', ask: 'Even or odd?', items: [['4', 1], ['7', 0], ['10', 1], ['13', 0], ['16', 1], ['21', 0]] } },
    3: { pairs: { t: 'Table Match', d: 'Match each sum with its answer.', p: [['3 × 4', '12'], ['5 × 2', '10'], ['6 × 3', '18'], ['7 × 2', '14'], ['4 × 4', '16'], ['9 × 3', '27']] },
         sort: { t: 'Even or Odd?', d: 'Sort the bigger numbers.', a: 'Even', b: 'Odd', ask: 'Even or odd?', items: [['24', 1], ['35', 0], ['48', 1], ['51', 0], ['62', 1], ['77', 0]] } },
    4: { pairs: { t: 'Division Match', d: 'Match each division with its answer.', p: [['24 ÷ 4', '6'], ['35 ÷ 5', '7'], ['18 ÷ 2', '9'], ['32 ÷ 8', '4'], ['30 ÷ 10', '3']] },
         sort: { t: 'Multiple of 3?', d: 'Is the number in the 3 times table?', a: 'Multiple of 3', b: 'Not a multiple', ask: 'Multiple of 3?', items: [['12', 1], ['14', 0], ['18', 1], ['20', 0], ['27', 1], ['31', 0]] } },
    5: { pairs: { t: 'Shapes & Sides', d: 'Match each shape with its number of sides.', p: [['Triangle', '3 sides'], ['Square', '4 sides'], ['Pentagon', '5 sides'], ['Hexagon', '6 sides'], ['Octagon', '8 sides']] },
         sort: { t: 'Prime or Composite?', d: 'Sort the numbers.', a: 'Prime', b: 'Composite', ask: 'Prime or composite?', items: [['2', 1], ['7', 1], ['9', 0], ['11', 1], ['15', 0], ['21', 0]] } },
    6: { pairs: { t: 'Fraction Match', d: 'Match each fraction with its decimal.', p: [['1/2', '0.5'], ['1/4', '0.25'], ['3/4', '0.75'], ['1/5', '0.2'], ['1/10', '0.1'], ['2/5', '0.4']] },
         sort: { t: 'Divisible by 4?', d: 'Sort the numbers.', a: 'Divisible by 4', b: 'Not divisible', ask: 'Divisible by 4?', items: [['16', 1], ['18', 0], ['24', 1], ['30', 0], ['36', 1], ['42', 0]] } },
    7: { pairs: { t: 'Percent ↔ Fraction', d: 'Match each percentage with its fraction.', p: [['50%', '1/2'], ['25%', '1/4'], ['75%', '3/4'], ['10%', '1/10'], ['20%', '1/5']] },
         sort: { t: 'Acute or Obtuse?', d: 'Sort the angles.', a: 'Acute (< 90°)', b: 'Obtuse (> 90°)', ask: 'Acute or obtuse?', items: [['30°', 1], ['95°', 0], ['60°', 1], ['120°', 0], ['45°', 1], ['150°', 0]] } },
    8: { pairs: { t: 'Square Match', d: 'Match each square with its value.', p: [['11²', '121'], ['12²', '144'], ['13²', '169'], ['14²', '196'], ['15²', '225']] },
         sort: { t: 'Perfect Square?', d: 'Sort the numbers.', a: 'Perfect square', b: 'Not a square', ask: 'Perfect square?', items: [['49', 1], ['50', 0], ['81', 1], ['90', 0], ['121', 1], ['125', 0]] } },
    9: { pairs: { t: 'Identity Match', d: 'Match each expression with its expansion.', p: [['(a + b)²', 'a² + 2ab + b²'], ['(a − b)²', 'a² − 2ab + b²'], ['a² − b²', '(a + b)(a − b)'], ['(a + b)³', 'a³ + 3a²b + 3ab² + b³']] },
         sort: { t: 'Rational or Irrational?', d: 'Sort the numbers.', a: 'Rational', b: 'Irrational', ask: 'Rational or irrational?', items: [['3/4', 1], ['√2', 0], ['0.5', 1], ['π', 0], ['√9', 1], ['√5', 0]] } },
    10: { pairs: { t: 'Trig Values', d: 'Match each ratio with its value.', p: [['sin 30°', '1/2'], ['cos 30°', '√3/2'], ['tan 45°', '1'], ['tan 60°', '√3'], ['sin 45°', '1/√2'], ['cos 90°', '0']] },
          sort: { t: 'AP or Not?', d: 'Is it an arithmetic progression?', a: 'AP', b: 'Not an AP', ask: 'Is it an AP?', items: [['2, 5, 8, 11', 1], ['1, 4, 9, 16', 0], ['10, 7, 4, 1', 1], ['1, 2, 4, 8', 0], ['3, 3, 3, 3', 1], ['1, 3, 6, 10', 0]] } },
    11: { pairs: { t: 'Log Rules', d: 'Match each log with its rule.', p: [['log (ab)', 'log a + log b'], ['log (a/b)', 'log a − log b'], ['log aⁿ', 'n log a'], ['logₐ a', '1'], ['log 1', '0']] },
          sort: { t: 'Even or Odd Function?', d: 'Sort the functions.', a: 'Even', b: 'Odd', ask: 'Even or odd function?', items: [['x²', 1], ['x³', 0], ['cos x', 1], ['sin x', 0], ['|x|', 1], ['x⁵', 0]] } },
    12: { pairs: { t: 'Derivative Match', d: 'Match each function with its derivative.', p: [['sin x', 'cos x'], ['cos x', '−sin x'], ['x²', '2x'], ['ln x', '1/x'], ['x³', '3x²'], ['tan x', 'sec²x']] },
          sort: { t: 'Increasing on ℝ?', d: 'Is the function increasing for all real x?', a: 'Increasing', b: 'Not increasing', ask: 'Increasing everywhere?', items: [['eˣ', 1], ['x²', 0], ['x³', 1], ['−x', 0], ['2x + 1', 1], ['cos x', 0]] } }
   },
   Tamil: {
    1: { pairs: { t: 'எழுத்தும் சொல்லும்', d: 'எழுத்தை அதில் தொடங்கும் சொல்லுடன் பொருத்துக.', p: [['அ', 'அணில் 🐿️'], ['ஆ', 'ஆடு 🐐'], ['இ', 'இலை 🍃'], ['ஈ', 'ஈ 🪰'], ['உ', 'உப்பு 🧂'], ['ஊ', 'ஊஞ்சல்']] },
         sort: { t: 'உயிரா? மெய்யா?', d: 'உயிர் எழுத்தா, மெய் எழுத்தா?', a: 'உயிர்', b: 'மெய்', ask: 'உயிர் எழுத்தா, மெய் எழுத்தா?', items: [['அ', 1], ['க்', 0], ['இ', 1], ['ம்', 0], ['ஊ', 1], ['ப்', 0]] } },
    2: { pairs: { t: 'குறில் – நெடில்', d: 'குறிலை அதன் நெடிலுடன் பொருத்துக.', p: [['அ', 'ஆ'], ['இ', 'ஈ'], ['உ', 'ஊ'], ['எ', 'ஏ'], ['ஒ', 'ஓ']] },
         sort: { t: 'குறிலா? நெடிலா?', d: 'எழுத்துகளை வகைப்படுத்துக.', a: 'குறில்', b: 'நெடில்', ask: 'குறிலா, நெடிலா?', items: [['அ', 1], ['ஆ', 0], ['இ', 1], ['ஈ', 0], ['உ', 1], ['ஊ', 0], ['எ', 1], ['ஏ', 0]] } },
    3: { pairs: { t: 'தமிழ் – ஆங்கிலம்', d: 'தமிழ்ச் சொல்லை ஆங்கிலச் சொல்லுடன் பொருத்துக.', p: [['பூனை', 'cat'], ['நாய்', 'dog'], ['பசு', 'cow'], ['மரம்', 'tree'], ['வீடு', 'house'], ['பழம்', 'fruit']] },
         sort: { t: 'வல்லினமா? மெல்லினமா?', d: 'மெய் எழுத்துகளை வகைப்படுத்துக.', a: 'வல்லினம்', b: 'மெல்லினம்', ask: 'வல்லினமா, மெல்லினமா?', items: [['க்', 1], ['ங்', 0], ['ச்', 1], ['ஞ்', 0], ['ட்', 1], ['ண்', 0]] } },
    4: { pairs: { t: 'எதிர்ச்சொற்கள்', d: 'சொல்லை அதன் எதிர்ச்சொல்லுடன் பொருத்துக.', p: [['பெரிய', 'சிறிய'], ['இரவு', 'பகல்'], ['மேலே', 'கீழே'], ['இன்பம்', 'துன்பம்'], ['வெற்றி', 'தோல்வி']] },
         sort: { t: 'மெல்லினமா? இடையினமா?', d: 'மெய் எழுத்துகளை வகைப்படுத்துக.', a: 'மெல்லினம்', b: 'இடையினம்', ask: 'மெல்லினமா, இடையினமா?', items: [['ம்', 1], ['ய்', 0], ['ன்', 1], ['ர்', 0], ['ண்', 1], ['ல்', 0]] } },
    5: { pairs: { t: 'ஒருமை – பன்மை', d: 'ஒருமையை அதன் பன்மையுடன் பொருத்துக.', p: [['மரம்', 'மரங்கள்'], ['பூ', 'பூக்கள்'], ['மாடு', 'மாடுகள்'], ['புத்தகம்', 'புத்தகங்கள்'], ['கல்', 'கற்கள்'], ['பறவை', 'பறவைகள்']] },
         sort: { t: 'ஒருமையா? பன்மையா?', d: 'சொற்களை வகைப்படுத்துக.', a: 'ஒருமை', b: 'பன்மை', ask: 'ஒருமையா, பன்மையா?', items: [['நாய்', 1], ['பூக்கள்', 0], ['மரம்', 1], ['கற்கள்', 0], ['பறவை', 1], ['வீடுகள்', 0]] } },
    6: { pairs: { t: 'ஒருபொருள் பல சொல்', d: 'ஒரே பொருள் தரும் சொற்களைப் பொருத்துக.', p: [['சூரியன்', 'ஞாயிறு'], ['நிலவு', 'திங்கள்'], ['கடல்', 'ஆழி'], ['வீடு', 'இல்லம்'], ['தண்ணீர்', 'நீர்'], ['மலர்', 'பூ']] },
         sort: { t: 'பெயரா? வினையா?', d: 'பெயர்ச்சொல்லா, வினைச்சொல்லா?', a: 'பெயர்ச்சொல்', b: 'வினைச்சொல்', ask: 'பெயர்ச்சொல்லா, வினைச்சொல்லா?', items: [['மரம்', 1], ['படித்தான்', 0], ['பள்ளி', 1], ['எழுதினாள்', 0], ['கண்', 1], ['பாடினார்கள்', 0]] } },
    7: { pairs: { t: 'ஐம்பால்', d: 'சொல்லை அதன் பாலுடன் பொருத்துக.', p: [['அவன்', 'ஆண்பால்'], ['அவள்', 'பெண்பால்'], ['அவர்கள்', 'பலர்பால்'], ['அது', 'ஒன்றன்பால்'], ['அவை', 'பலவின்பால்']] },
         sort: { t: 'உயர்திணையா? அஃறிணையா?', d: 'சொற்களை வகைப்படுத்துக.', a: 'உயர்திணை', b: 'அஃறிணை', ask: 'உயர்திணையா, அஃறிணையா?', items: [['மனிதன்', 1], ['மாடு', 0], ['ஆசிரியர்', 1], ['மரம்', 0], ['மாணவி', 1], ['கல்', 0]] } },
    8: { pairs: { t: 'தமிழ் எண்கள்', d: 'தமிழ் எண்ணை அதன் மதிப்புடன் பொருத்துக.', p: [['௧', '1'], ['௨', '2'], ['௩', '3'], ['௪', '4'], ['௫', '5'], ['௰', '10']] },
         sort: { t: 'எந்தக் காலம்?', d: 'இறந்தகாலமா, எதிர்காலமா?', a: 'இறந்தகாலம்', b: 'எதிர்காலம்', ask: 'எந்தக் காலம்?', items: [['படித்தான்', 1], ['வருவான்', 0], ['சென்றாள்', 1], ['பாடுவார்', 0], ['எழுதினேன்', 1], ['ஓடுவோம்', 0]] } },
    9: { pairs: { t: 'நூலும் ஆசிரியரும்', d: 'நூலை அதன் ஆசிரியருடன் பொருத்துக.', p: [['சிலப்பதிகாரம்', 'இளங்கோவடிகள்'], ['மணிமேகலை', 'சீத்தலைச் சாத்தனார்'], ['திருக்குறள்', 'திருவள்ளுவர்'], ['கம்பராமாயணம்', 'கம்பர்'], ['பெரியபுராணம்', 'சேக்கிழார்']] },
         sort: { t: 'பெருங்காப்பியமா? சிறுகாப்பியமா?', d: 'ஐம்பெருங்காப்பியமா, ஐஞ்சிறுகாப்பியமா?', a: 'ஐம்பெருங்காப்பியம்', b: 'ஐஞ்சிறுகாப்பியம்', ask: 'எந்த வகை?', items: [['சிலப்பதிகாரம்', 1], ['நீலகேசி', 0], ['சீவக சிந்தாமணி', 1], ['யசோதர காவியம்', 0], ['வளையாபதி', 1], ['சூளாமணி', 0], ['குண்டலகேசி', 1], ['நாககுமார காவியம்', 0]] } },
    10: { pairs: { t: 'ஐந்திணை – நிலம்', d: 'திணையை அதன் நிலத்துடன் பொருத்துக.', p: [['குறிஞ்சி', 'மலை'], ['முல்லை', 'காடு'], ['மருதம்', 'வயல்'], ['நெய்தல்', 'கடல்'], ['பாலை', 'வறண்ட நிலம்']] },
          sort: { t: 'எட்டுத்தொகையா? பத்துப்பாட்டா?', d: 'சங்க நூல்களை வகைப்படுத்துக.', a: 'எட்டுத்தொகை', b: 'பத்துப்பாட்டு', ask: 'எந்தத் தொகுப்பு?', items: [['நற்றிணை', 1], ['திருமுருகாற்றுப்படை', 0], ['குறுந்தொகை', 1], ['மதுரைக்காஞ்சி', 0], ['புறநானூறு', 1], ['நெடுநல்வாடை', 0], ['அகநானூறு', 1], ['பட்டினப்பாலை', 0]] } },
    11: { pairs: { t: 'படைப்பும் படைப்பாளரும்', d: 'நூலை அதன் ஆசிரியருடன் பொருத்துக.', p: [['குயில் பாட்டு', 'பாரதியார்'], ['குடும்ப விளக்கு', 'பாரதிதாசன்'], ['பொன்னியின் செல்வன்', 'கல்கி'], ['என் சரித்திரம்', 'உ.வே.சா.'], ['சில நேரங்களில் சில மனிதர்கள்', 'ஜெயகாந்தன்']] },
          sort: { t: 'கீழ்க்கணக்கா? எட்டுத்தொகையா?', d: 'நூல்களை வகைப்படுத்துக.', a: 'பதினெண்கீழ்க்கணக்கு', b: 'எட்டுத்தொகை', ask: 'எந்தத் தொகுப்பு?', items: [['திருக்குறள்', 1], ['கலித்தொகை', 0], ['நாலடியார்', 1], ['பரிபாடல்', 0], ['இனியவை நாற்பது', 1], ['ஐங்குறுநூறு', 0]] } },
    12: { pairs: { t: 'திணையும் தெய்வமும்', d: 'திணையை அதன் தெய்வத்துடன் பொருத்துக.', p: [['குறிஞ்சி', 'முருகன்'], ['முல்லை', 'திருமால்'], ['மருதம்', 'இந்திரன்'], ['நெய்தல்', 'வருணன்'], ['பாலை', 'கொற்றவை']] },
          sort: { t: 'அகமா? புறமா?', d: 'சங்க நூல்களை வகைப்படுத்துக.', a: 'அகம்', b: 'புறம்', ask: 'அகமா, புறமா?', items: [['அகநானூறு', 1], ['புறநானூறு', 0], ['குறுந்தொகை', 1], ['பதிற்றுப்பத்து', 0], ['நற்றிணை', 1], ['ஐங்குறுநூறு', 1]] } }
   },
   English: {
    1: { pairs: { t: 'Big & Small Letters', d: 'Match each capital letter with its small letter.', p: [['A', 'a'], ['B', 'b'], ['D', 'd'], ['G', 'g'], ['M', 'm'], ['R', 'r']] },
         sort: { t: 'Vowel or Consonant?', d: 'Sort the letters.', a: 'Vowel', b: 'Consonant', ask: 'Vowel or consonant?', items: [['a', 1], ['b', 0], ['e', 1], ['t', 0], ['o', 1], ['m', 0]] } },
    2: { pairs: { t: 'Opposites', d: 'Match each word with its opposite.', p: [['big', 'small'], ['hot', 'cold'], ['up', 'down'], ['happy', 'sad'], ['open', 'close']] },
         sort: { t: 'Naming or Action?', d: 'Is it a naming word or an action word?', a: 'Naming word', b: 'Action word', ask: 'Naming or action word?', items: [['table', 1], ['run', 0], ['apple', 1], ['jump', 0], ['school', 1], ['eat', 0]] } },
    3: { pairs: { t: 'One & Many', d: 'Match each word with its plural.', p: [['child', 'children'], ['man', 'men'], ['tooth', 'teeth'], ['mouse', 'mice'], ['foot', 'feet']] },
         sort: { t: 'A or An?', d: 'Which article goes before the word?', a: 'a', b: 'an', ask: 'a or an?', items: [['dog', 1], ['apple', 0], ['ball', 1], ['egg', 0], ['cat', 1], ['owl', 0]] } },
    4: { pairs: { t: 'Now & Then', d: 'Match each verb with its past tense.', p: [['go', 'went'], ['eat', 'ate'], ['run', 'ran'], ['see', 'saw'], ['write', 'wrote']] },
         sort: { t: 'Noun or Adjective?', d: 'Sort the words.', a: 'Noun', b: 'Adjective', ask: 'Noun or adjective?', items: [['river', 1], ['happy', 0], ['teacher', 1], ['tall', 0], ['city', 1], ['blue', 0]] } },
    5: { pairs: { t: 'Same Meaning', d: 'Match each word with its synonym.', p: [['big', 'large'], ['quick', 'fast'], ['begin', 'start'], ['happy', 'glad'], ['shut', 'close']] },
         sort: { t: 'Present or Past?', d: 'Sort the sentences by tense.', a: 'Present', b: 'Past', ask: 'Present or past tense?', items: [['She sings.', 1], ['He played.', 0], ['I eat rice.', 1], ['They ran.', 0], ['It rains.', 1], ['We walked.', 0]] } },
    6: { pairs: { t: 'Antonyms', d: 'Match each word with its opposite.', p: [['ancient', 'modern'], ['accept', 'reject'], ['brave', 'cowardly'], ['expand', 'contract'], ['generous', 'selfish']] },
         sort: { t: 'Countable or Not?', d: 'Sort the nouns.', a: 'Countable', b: 'Uncountable', ask: 'Countable or uncountable?', items: [['apple', 1], ['water', 0], ['chair', 1], ['milk', 0], ['book', 1], ['sugar', 0]] } },
    7: { pairs: { t: 'Past Participles', d: 'Match each verb with its past participle.', p: [['go', 'gone'], ['write', 'written'], ['eat', 'eaten'], ['see', 'seen'], ['take', 'taken']] },
         sort: { t: 'Preposition or Conjunction?', d: 'Sort the words.', a: 'Preposition', b: 'Conjunction', ask: 'Preposition or conjunction?', items: [['in', 1], ['and', 0], ['on', 1], ['but', 0], ['under', 1], ['because', 0]] } },
    8: { pairs: { t: 'Synonyms', d: 'Match words with the same meaning.', p: [['abundant', 'plentiful'], ['rapid', 'swift'], ['wealthy', 'rich'], ['conceal', 'hide'], ['ancient', 'old']] },
         sort: { t: 'Active or Passive?', d: 'Sort the sentences by voice.', a: 'Active', b: 'Passive', ask: 'Active or passive voice?', items: [['The cat chased the rat.', 1], ['The rat was chased by the cat.', 0], ['She wrote a letter.', 1], ['A letter was written by her.', 0], ['They built a house.', 1], ['The house was built in 1990.', 0]] } },
    9: { pairs: { t: 'One-Word Substitutes', d: 'Match each phrase with one word.', p: [['one who writes poems', 'poet'], ['unable to read or write', 'illiterate'], ['story of one’s own life', 'autobiography'], ['place where birds are kept', 'aviary'], ['fear of water', 'hydrophobia']] },
         sort: { t: 'Simple or Compound?', d: 'Sort the sentences.', a: 'Simple', b: 'Compound', ask: 'Simple or compound sentence?', items: [['I ran.', 1], ['I ran and he walked.', 0], ['She sings well.', 1], ['It rained, but we played.', 0], ['The dog barked.', 1], ['He was tired, so he slept.', 0]] } },
    10: { pairs: { t: 'Figures of Speech', d: 'Match each example with its figure of speech.', p: [['as brave as a lion', 'simile'], ['Time is money.', 'metaphor'], ['The wind whispered.', 'personification'], ['She sells sea shells.', 'alliteration'], ['I have told you a million times!', 'hyperbole']] },
          sort: { t: 'Phrase or Clause?', d: 'Does it have a subject and a verb?', a: 'Phrase', b: 'Clause', ask: 'Phrase or clause?', items: [['in the morning', 1], ['when she arrived', 0], ['under the tree', 1], ['because he was ill', 0], ['on the table', 1], ['if it rains', 0]] } },
    11: { pairs: { t: 'Abbreviations', d: 'Match each abbreviation with its meaning.', p: [['e.g.', 'for example'], ['i.e.', 'that is'], ['etc.', 'and so on'], ['viz.', 'namely'], ['N.B.', 'note well']] },
          sort: { t: 'Formal or Informal?', d: 'Sort the expressions.', a: 'Formal', b: 'Informal', ask: 'Formal or informal?', items: [['Kindly find attached', 1], ['gonna', 0], ['I am writing to inform you', 1], ['What’s up?', 0], ['Yours faithfully', 1], ['See ya!', 0]] } },
    12: { pairs: { t: 'Idioms', d: 'Match each idiom with its meaning.', p: [['break the ice', 'start a conversation'], ['a piece of cake', 'very easy'], ['hit the books', 'study hard'], ['under the weather', 'feeling ill'], ['once in a blue moon', 'very rarely']] },
          sort: { t: 'Ability or Obligation?', d: 'What does the modal show?', a: 'Ability', b: 'Obligation', ask: 'Ability or obligation?', items: [['can', 1], ['must', 0], ['could', 1], ['have to', 0], ['be able to', 1], ['need to', 0]] } }
   },
   Science: {
    1: { pairs: { t: 'Match the Pictures', d: 'Find two matching pictures.', p: [['🐱', '🐱'], ['🐶', '🐶'], ['🍎', '🍎'], ['⭐', '⭐'], ['🌼', '🌼'], ['🐟', '🐟']] },
         sort: { t: 'Living or Non-living?', d: 'Sort the things.', a: '🌱 Living', b: '🪨 Non-living', ask: 'Is it living?', items: [['🌳 Tree', 1], ['🪨 Stone', 0], ['🐦 Bird', 1], ['🪑 Chair', 0], ['🌼 Flower', 1], ['⚽ Ball', 0]] } },
    2: { pairs: { t: 'Animal Homes', d: 'Match each animal with its home.', p: [['🐦 Bird', 'Nest'], ['🐝 Bee', 'Hive'], ['🦁 Lion', 'Den'], ['🕷️ Spider', 'Web'], ['🐎 Horse', 'Stable']] },
         sort: { t: 'Plant or Animal Food?', d: 'Where does the food come from?', a: '🌱 Plant', b: '🐄 Animal', ask: 'Plant or animal?', items: [['🍚 Rice', 1], ['🥛 Milk', 0], ['🍌 Banana', 1], ['🥚 Egg', 0], ['🥕 Carrot', 1], ['🍯 Honey', 0]] } },
    3: { pairs: { t: 'Sense Organs', d: 'Match each sense organ with its sense.', p: [['👁️ Eye', 'see'], ['👂 Ear', 'hear'], ['👃 Nose', 'smell'], ['👅 Tongue', 'taste'], ['✋ Skin', 'touch']] },
         sort: { t: 'Domestic or Wild?', d: 'Sort the animals.', a: '🏠 Domestic', b: '🌲 Wild', ask: 'Domestic or wild?', items: [['🐄 Cow', 1], ['🐅 Tiger', 0], ['🐕 Dog', 1], ['🦁 Lion', 0], ['🐐 Goat', 1], ['🦌 Deer', 0], ['🐓 Hen', 1], ['🐻 Bear', 0]] } },
    4: { pairs: { t: 'Animals & Young Ones', d: 'Match each animal with its young one.', p: [['Cow', 'Calf'], ['Dog', 'Puppy'], ['Cat', 'Kitten'], ['Hen', 'Chick'], ['Horse', 'Foal'], ['Sheep', 'Lamb']] },
         sort: { t: 'Solid or Liquid?', d: 'Sort things by their state.', a: '🧊 Solid', b: '💧 Liquid', ask: 'Solid or liquid?', items: [['🪨 Stone', 1], ['🥛 Milk', 0], ['🧊 Ice', 1], ['💧 Water', 0], ['🫗 Oil', 0], ['🪵 Wood', 1]] } },
    5: { pairs: { t: 'Space Match', d: 'Match each object in space with what it is.', p: [['Sun', 'a star'], ['Moon', 'Earth’s natural satellite'], ['Mars', 'the red planet'], ['Jupiter', 'the largest planet'], ['Mercury', 'nearest planet to the Sun']] },
         sort: { t: 'Renewable or Not?', d: 'Is the energy source renewable?', a: '♻️ Renewable', b: '⛽ Non-renewable', ask: 'Renewable or not?', items: [['☀️ Sunlight', 1], ['💨 Wind', 1], ['⛏️ Coal', 0], ['⛽ Petrol', 0], ['🌊 Flowing water', 1], ['🔥 Natural gas', 0]] } },
    6: { pairs: { t: 'Nutrient & Deficiency', d: 'Match each nutrient with the disease its lack causes.', p: [['Vitamin A', 'Night blindness'], ['Vitamin C', 'Scurvy'], ['Vitamin D', 'Rickets'], ['Vitamin B1', 'Beriberi'], ['Iodine', 'Goitre']] },
         sort: { t: 'Conductor or Insulator?', d: 'Does electricity pass through it?', a: '⚡ Conductor', b: '🛡️ Insulator', ask: 'Conductor or insulator?', items: [['Copper wire', 1], ['Iron nail', 1], ['Rubber', 0], ['Plastic', 0], ['Dry wood', 0], ['Aluminium foil', 1]] } },
    7: { pairs: { t: 'SI Units', d: 'Match each quantity with its SI unit.', p: [['Length', 'metre'], ['Mass', 'kilogram'], ['Time', 'second'], ['Temperature', 'kelvin'], ['Electric current', 'ampere']] },
         sort: { t: 'Acid or Base?', d: 'Sort common substances.', a: '🍋 Acid', b: '🧼 Base', ask: 'Acid or base?', items: [['Lemon juice', 1], ['Vinegar', 1], ['Soap solution', 0], ['Baking soda', 0], ['Curd', 1], ['Lime water', 0]] } },
    8: { pairs: { t: 'Element Symbols', d: 'Match each element with its symbol.', p: [['Sodium', 'Na'], ['Iron', 'Fe'], ['Gold', 'Au'], ['Potassium', 'K'], ['Silver', 'Ag'], ['Copper', 'Cu']] },
         sort: { t: 'Metal or Non-metal?', d: 'Sort the elements.', a: '🔩 Metal', b: '💨 Non-metal', ask: 'Metal or non-metal?', items: [['Iron', 1], ['Copper', 1], ['Sulphur', 0], ['Carbon', 0], ['Aluminium', 1], ['Oxygen', 0]] } },
    9: { pairs: { t: 'Formula Match', d: 'Match each compound with its formula.', p: [['Water', 'H₂O'], ['Common salt', 'NaCl'], ['Carbon dioxide', 'CO₂'], ['Ammonia', 'NH₃'], ['Methane', 'CH₄']] },
         sort: { t: 'Physical or Chemical?', d: 'Sort the changes.', a: '🔄 Physical', b: '⚗️ Chemical', ask: 'Physical or chemical change?', items: [['Melting ice', 1], ['Burning paper', 0], ['Rusting iron', 0], ['Dissolving sugar', 1], ['Cooking an egg', 0], ['Tearing paper', 1]] } },
    10: { pairs: { t: 'Cell Parts', d: 'Match each cell part with its job.', p: [['Mitochondria', 'Releases energy'], ['Ribosome', 'Makes proteins'], ['Chloroplast', 'Photosynthesis'], ['Nucleus', 'Controls the cell'], ['Lysosome', 'Breaks down waste']] },
          sort: { t: 'Backbone or Not?', d: 'Sort vertebrates and invertebrates.', a: '🦴 Vertebrate', b: '🪱 Invertebrate', ask: 'Does it have a backbone?', items: [['🐟 Fish', 1], ['🐸 Frog', 1], ['🪱 Earthworm', 0], ['🦋 Butterfly', 0], ['🐍 Snake', 1], ['🐙 Octopus', 0]] } },
    11: { pairs: { t: 'Dimensions', d: 'Match each quantity with its dimensional formula.', p: [['Velocity', '[LT⁻¹]'], ['Acceleration', '[LT⁻²]'], ['Force', '[MLT⁻²]'], ['Work', '[ML²T⁻²]'], ['Momentum', '[MLT⁻¹]']] },
          sort: { t: 'Scalar or Vector?', d: 'Sort physical quantities.', a: '📏 Scalar', b: '➡️ Vector', ask: 'Scalar or vector?', items: [['Mass', 1], ['Speed', 1], ['Velocity', 0], ['Force', 0], ['Temperature', 1], ['Displacement', 0]] } },
    12: { pairs: { t: 'Scientists', d: 'Match each scientist with their work.', p: [['Mendel', 'Laws of inheritance'], ['Darwin', 'Natural selection'], ['Watson & Crick', 'DNA double helix'], ['Fleming', 'Penicillin'], ['Bohr', 'Model of the atom']] },
          sort: { t: 'Ionic or Covalent?', d: 'Sort compounds by bond type.', a: '⚡ Ionic', b: '🔗 Covalent', ask: 'Ionic or covalent?', items: [['NaCl', 1], ['KCl', 1], ['MgO', 1], ['H₂O', 0], ['CH₄', 0], ['CO₂', 0]] } }
   }
  };
  const set = () => { const s = DATA[subjectKey()] || DATA.Mathematics; return s[cls()] || s[1]; };

  /* ======================= Game 1: Maths → number game; other subjects → quick quiz ======================= */
  function numOptions(ans) {
    const s = new Set([ans]); const spread = Math.max(2, Math.round(Math.abs(ans) * 0.15));
    while (s.size < 3) { const d = ans + rnd(-spread, spread); if (d !== ans && (ans < 0 || d >= 0)) s.add(d); }
    return shuffle([...s]);
  }
  function quizRound() {
    // Quick quiz from the subject's pairs: show one side, choose the matching other side.
    const p = set().pairs.p; const [l, r] = p[rnd(0, p.length - 1)]; const flip = Math.random() < .5;
    const q = flip ? r : l, a = flip ? l : r;
    const others = shuffle(p.map((x) => (flip ? x[0] : x[1])).filter((x) => x !== a)).slice(0, 2);
    return { q: esc(q) + '<br><small>goes with…</small>', a, opts: shuffle([a, ...others]) };
  }
  function firstGame() {
    const box = $('#numberGame'); const maths = subjectKey() === 'Mathematics'; const g = NUMBER[cls()] || NUMBER[1];
    let round = 0, score = 0; const total = 5;
    function ask() {
      if (round === total) { box.innerHTML = `<div class="game-question">🏆 ${score}/${total}</div><button class="secondary" id="startNumberGame">▶ Play again</button>`; $('#startNumberGame').onclick = firstGame; return; }
      let q, a, opts;
      if (maths) { ({ q, a } = g.make()); opts = numOptions(a); } else { ({ q, a, opts } = quizRound()); }
      box.innerHTML = `<p class="eyebrow">ROUND ${round + 1} OF ${total}</p><div class="game-question">${q}</div><div class="quiz-options">${opts.map((x, i) => `<button data-i="${i}">${esc(x)}</button>`).join('')}</div><p id="ngFeedback"></p>`;
      box.querySelectorAll('[data-i]').forEach((b) => b.onclick = () => {
        box.querySelectorAll('[data-i]').forEach((x) => x.disabled = true);
        const ok = String(opts[Number(b.dataset.i)]) === String(a); if (ok) score++;
        $('#ngFeedback').textContent = ok ? '🎉 Correct!' : `😊 Good try! It is ${a}.`;
        round++; setTimeout(ask, ok ? 700 : 1500);
      });
    }
    ask();
  }

  /* ======================= Game 2: match the pairs ======================= */
  function memoryGame() {
    const g = set().pairs; const box = $('#memoryGame');
    const chosen = shuffle(g.p).slice(0, 4);
    const cards = shuffle(chosen.flatMap((p, i) => [{ id: i, text: p[0] }, { id: i, text: p[1] }]));
    let first = null, lock = false, found = 0, tries = 0;
    box.innerHTML = '<div class="quiz-options match-grid">' + cards.map((c, i) => `<button data-card="${i}" data-pair="${c.id}" data-text="${esc(c.text)}">❔</button>`).join('') + '</div><p id="mgFeedback">Tap two cards that go together.</p>';
    box.querySelectorAll('[data-card]').forEach((b) => b.onclick = () => {
      if (lock || b.disabled || b === first) return;
      b.textContent = b.dataset.text;
      if (!first) { first = b; return; }
      tries++;
      if (first.dataset.pair === b.dataset.pair) {
        first.disabled = b.disabled = true; first.classList.add('matched'); b.classList.add('matched'); first = null; found++;
        if (found === chosen.length) { $('#mgFeedback').innerHTML = `🏆 All pairs found in ${tries} tries! <button class="secondary" id="startMemoryGame">▶ Play again</button>`; $('#startMemoryGame').onclick = memoryGame; }
      } else {
        lock = true; const prev = first; first = null;
        setTimeout(() => { prev.textContent = '❔'; b.textContent = '❔'; lock = false; }, 1000);
      }
    });
  }

  /* ======================= Game 3: sort into two groups ======================= */
  function sortGame() {
    const g = set().sort; const box = $('#natureGame');
    const items = shuffle(g.items).slice(0, 6); let i = 0, score = 0;
    function ask() {
      if (i === items.length) { box.innerHTML = `<div class="game-question">🏆 ${score}/${items.length}</div><button id="startNatureGame" class="secondary">▶ Play again</button>`; $('#startNatureGame').onclick = sortGame; return; }
      const [name, isA] = items[i];
      box.innerHTML = `<div class="game-question">${esc(name)}<br><small>${esc(g.ask)}</small></div><div class="quiz-options"><button data-group="1">${esc(g.a)}</button><button data-group="0">${esc(g.b)}</button></div><p id="natureFeedback"></p>`;
      box.querySelectorAll('[data-group]').forEach((b) => b.onclick = () => {
        box.querySelectorAll('[data-group]').forEach((x) => x.disabled = true);
        const ok = Number(b.dataset.group) === isA; if (ok) score++;
        $('#natureFeedback').textContent = ok ? '🎉 Correct!' : `😊 Good try! It is: ${isA ? g.a : g.b}`;
        i++; setTimeout(ask, ok ? 700 : 1500);
      });
    }
    ask();
  }

  /* ======================= Wire up; refresh when class or subject changes ======================= */
  const ICON = { Tamil: ['அ', '🔤', '🗂️'], English: ['🔤', '🧠', '🗂️'], Mathematics: ['🔢', '🧠', '🗂️'], Science: ['🔬', '🧠', '🌿'] };
  const cards = document.querySelectorAll('.game-card');
  function setup() {
    const c = cls(), key = subjectKey(), s = set();
    const first = key === 'Mathematics' ? { t: (NUMBER[c] || NUMBER[1]).t, d: (NUMBER[c] || NUMBER[1]).d }
                                        : { t: `${SUBJECT_NAME[key]} Quick Quiz`, d: 'Pick the answer that goes with the word.' };
    [[first, 0, 'numberGame', 'startNumberGame', firstGame], [s.pairs, 1, 'memoryGame', 'startMemoryGame', memoryGame], [s.sort, 2, 'natureGame', 'startNatureGame', sortGame]]
      .forEach(([g, idx, boxId, btnId, fn]) => {
        const card = cards[idx]; if (!card) return;
        card.querySelector('h3').textContent = g.t;
        card.querySelector('p').textContent = g.d;
        const ic = card.querySelector('.game-icon'); if (ic) ic.textContent = ICON[key][idx];
        document.getElementById(boxId).innerHTML = `<button class="secondary" id="${btnId}">▶ Play now</button>`;
        document.getElementById(btnId).onclick = fn;
      });
    const h = document.querySelector('.games h2'); if (h) h.textContent = `🎮 Class ${c} · ${SUBJECT_NAME[key]} games`;
  }
  $('#classSelect').addEventListener('change', setup);
  document.querySelectorAll('.subject-card').forEach((b) => b.addEventListener('click', () => { subject = b.dataset.subject; setup(); }));
  window.NC_GAMES = { data: DATA, setSubject: (s) => { subject = s; setup(); } };
  setup();
})();
