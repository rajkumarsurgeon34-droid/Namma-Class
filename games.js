// Namma Class — the three games change with the class picked at the top of the page.
// Loaded after app.js; replaces the Class 1-only games with class-aware ones.
(function () {
  const $ = (s) => document.querySelector(s);
  const cls = () => Number($('#classSelect').value) || 1;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- 1. Number game: one question generator per class ---------- */
  const NUMBER = {
    1: { title: 'Number Pop!', desc: 'Count the stars and pick the right number.',
         make: () => { const n = rnd(1, 9); return { q: '⭐ '.repeat(n) + '<br>How many stars?', a: n }; } },
    2: { title: 'Add & Take Away', desc: 'Add and subtract numbers up to 100.',
         make: () => { if (Math.random() < .5) { const a = rnd(10, 60), b = rnd(5, 39); return { q: `${a} + ${b} = ?`, a: a + b }; }
                       const a = rnd(30, 99), b = rnd(5, a - 10); return { q: `${a} − ${b} = ?`, a: a - b }; } },
    3: { title: 'Times Tables', desc: 'Practise the 2 to 10 times tables.',
         make: () => { const a = rnd(2, 10), b = rnd(2, 10); return { q: `${a} × ${b} = ?`, a: a * b }; } },
    4: { title: 'Share Equally', desc: 'Division facts — share things into equal groups.',
         make: () => { const b = rnd(2, 10), c = rnd(2, 12); return { q: `${b * c} ÷ ${b} = ?`, a: c }; } },
    5: { title: 'Big Multiply', desc: 'Multiply a 2-digit number by a 1-digit number.',
         make: () => { const a = rnd(12, 99), b = rnd(2, 9); return { q: `${a} × ${b} = ?`, a: a * b }; } },
    6: { title: 'Integer Island', desc: 'Add positive and negative numbers.',
         make: () => { const a = rnd(-15, 15), b = rnd(-15, 15); const s = b < 0 ? `${a} + (${b})` : `${a} + ${b}`; return { q: `${s} = ?`, a: a + b }; } },
    7: { title: 'Percent Power', desc: 'Find a percentage of a number.',
         make: () => { const p = [10, 20, 25, 50, 75][rnd(0, 4)], n = rnd(1, 20) * 20; return { q: `${p}% of ${n} = ?`, a: n * p / 100 }; } },
    8: { title: 'Square Roots', desc: 'Find the square root of a perfect square.',
         make: () => { const n = rnd(11, 30); return { q: `√${n * n} = ?`, a: n }; } },
    9: { title: 'Solve for x', desc: 'Solve simple linear equations.',
         make: () => { const a = rnd(2, 9), x = rnd(1, 12), b = rnd(1, 20); return { q: `${a}x + ${b} = ${a * x + b}<br>x = ?`, a: x }; } },
    10: { title: 'AP Explorer', desc: 'Find the nth term of an arithmetic progression.',
          make: () => { const a = rnd(1, 15), d = rnd(2, 9), n = rnd(5, 20); return { q: `a = ${a}, d = ${d}<br>t<sub>${n}</sub> = ?`, a: a + (n - 1) * d }; } },
    11: { title: 'Log Lab', desc: 'Evaluate logarithms.',
          make: () => { const base = [2, 3, 5, 10][rnd(0, 3)], k = rnd(2, base === 2 ? 8 : 4); return { q: `log<sub>${base}</sub> ${Math.pow(base, k)} = ?`, a: k }; } },
    12: { title: 'Derivative Dash', desc: 'Differentiate and evaluate at a point.',
          make: () => { const a = rnd(1, 5), n = rnd(2, 4), x = rnd(1, 3); return { q: `f(x) = ${a === 1 ? '' : a}x<sup>${n}</sup><br>f′(${x}) = ?`, a: a * n * Math.pow(x, n - 1) }; } }
  };
  function options(ans) {
    const set = new Set([ans]);
    const spread = Math.max(2, Math.round(Math.abs(ans) * 0.15));
    while (set.size < 3) { const d = ans + rnd(-spread, spread); if (d !== ans && (ans < 0 || d >= 0)) set.add(d); }
    return shuffle([...set]);
  }
  function numberGame() {
    const g = NUMBER[cls()] || NUMBER[1]; const box = $('#numberGame'); let round = 0, score = 0; const total = 5;
    function ask() {
      if (round === total) { box.innerHTML = `<div class="game-question">🏆 ${score}/${total}</div><button class="secondary" id="startNumberGame">▶ Play again</button>`; $('#startNumberGame').onclick = numberGame; return; }
      const { q, a } = g.make();
      box.innerHTML = `<p class="eyebrow">ROUND ${round + 1} OF ${total}</p><div class="game-question">${q}</div><div class="quiz-options">${options(a).map((x) => `<button data-num="${x}">${x}</button>`).join('')}</div><p id="ngFeedback"></p>`;
      box.querySelectorAll('[data-num]').forEach((b) => b.onclick = () => {
        box.querySelectorAll('[data-num]').forEach((x) => x.disabled = true);
        const ok = Number(b.dataset.num) === a; if (ok) score++;
        $('#ngFeedback').textContent = ok ? '🎉 Correct!' : `😊 Good try! It is ${a}.`;
        round++; setTimeout(ask, ok ? 700 : 1400);
      });
    }
    ask();
  }

  /* ---------- 2. Match the pairs: match each card with its partner ---------- */
  const PAIRS = {
    1: { title: 'Match the Pairs', desc: 'Find two matching pictures.', pairs: [['🐱', '🐱'], ['🐶', '🐶'], ['🍎', '🍎'], ['⭐', '⭐'], ['🌼', '🌼'], ['🐟', '🐟']] },
    2: { title: 'குறில் – நெடில்', desc: 'Match each short letter with its long letter.', pairs: [['அ', 'ஆ'], ['இ', 'ஈ'], ['உ', 'ஊ'], ['எ', 'ஏ'], ['ஒ', 'ஓ']] },
    3: { title: 'Table Match', desc: 'Match each sum with its answer.', pairs: [['3 × 4', '12'], ['5 × 2', '10'], ['6 × 3', '18'], ['7 × 2', '14'], ['4 × 4', '16'], ['9 × 3', '27']] },
    4: { title: 'Animals & Young Ones', desc: 'Match each animal with its young one.', pairs: [['Cow', 'Calf'], ['Dog', 'Puppy'], ['Cat', 'Kitten'], ['Hen', 'Chick'], ['Horse', 'Foal'], ['Sheep', 'Lamb']] },
    5: { title: 'Shapes & Sides', desc: 'Match each shape with its number of sides.', pairs: [['Triangle', '3 sides'], ['Square', '4 sides'], ['Pentagon', '5 sides'], ['Hexagon', '6 sides'], ['Octagon', '8 sides']] },
    6: { title: 'Fraction Match', desc: 'Match each fraction with its decimal.', pairs: [['1/2', '0.5'], ['1/4', '0.25'], ['3/4', '0.75'], ['1/5', '0.2'], ['1/10', '0.1'], ['2/5', '0.4']] },
    7: { title: 'SI Units', desc: 'Match each quantity with its SI unit.', pairs: [['Length', 'metre'], ['Mass', 'kilogram'], ['Time', 'second'], ['Temperature', 'kelvin'], ['Electric current', 'ampere']] },
    8: { title: 'Element Symbols', desc: 'Match each element with its symbol.', pairs: [['Sodium', 'Na'], ['Iron', 'Fe'], ['Gold', 'Au'], ['Potassium', 'K'], ['Silver', 'Ag'], ['Copper', 'Cu']] },
    9: { title: 'Formula Match', desc: 'Match each compound with its formula.', pairs: [['Water', 'H₂O'], ['Common salt', 'NaCl'], ['Carbon dioxide', 'CO₂'], ['Ammonia', 'NH₃'], ['Methane', 'CH₄']] },
    10: { title: 'Cell Parts', desc: 'Match each cell part with its job.', pairs: [['Mitochondria', 'Releases energy'], ['Ribosome', 'Makes proteins'], ['Chloroplast', 'Photosynthesis'], ['Nucleus', 'Controls the cell'], ['Lysosome', 'Breaks down waste']] },
    11: { title: 'Dimensions', desc: 'Match each quantity with its dimensional formula.', pairs: [['Velocity', '[LT⁻¹]'], ['Acceleration', '[LT⁻²]'], ['Force', '[MLT⁻²]'], ['Work', '[ML²T⁻²]'], ['Momentum', '[MLT⁻¹]']] },
    12: { title: 'Derivative Match', desc: 'Match each function with its derivative.', pairs: [['sin x', 'cos x'], ['cos x', '−sin x'], ['x²', '2x'], ['ln x', '1/x'], ['x³', '3x²'], ['tan x', 'sec²x']] }
  };
  function memoryGame() {
    const g = PAIRS[cls()] || PAIRS[1]; const box = $('#memoryGame');
    const chosen = shuffle(g.pairs).slice(0, 4);
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
        setTimeout(() => { prev.textContent = '❔'; b.textContent = '❔'; lock = false; }, 900);
      }
    });
  }

  /* ---------- 3. Sort game: put each item in the right group ---------- */
  const SORT = {
    1: { title: 'Nature Sort', desc: 'Choose living and non-living things.', a: '🌱 Living', b: '🪨 Non-living', ask: 'Is it living?',
         items: [['🌳 Tree', 1], ['🪨 Stone', 0], ['🐦 Bird', 1], ['🪑 Chair', 0], ['🌼 Flower', 1], ['⚽ Ball', 0]] },
    2: { title: 'Food Sort', desc: 'Does this food come from a plant or an animal?', a: '🌱 Plant', b: '🐄 Animal', ask: 'Where does it come from?',
         items: [['🍚 Rice', 1], ['🥛 Milk', 0], ['🍌 Banana', 1], ['🥚 Egg', 0], ['🥕 Carrot', 1], ['🍯 Honey', 0]] },
    3: { title: 'Home or Wild?', desc: 'Sort domestic and wild animals.', a: '🏠 Domestic', b: '🌲 Wild', ask: 'Domestic or wild?',
         items: [['🐄 Cow', 1], ['🐅 Tiger', 0], ['🐕 Dog', 1], ['🦁 Lion', 0], ['🐐 Goat', 1], ['🦌 Deer', 0], ['🐓 Hen', 1], ['🐻 Bear', 0]] },
    4: { title: 'Solid or Liquid?', desc: 'Sort things by their state.', a: '🧊 Solid', b: '💧 Liquid', ask: 'Solid or liquid?',
         items: [['🪨 Stone', 1], ['🥛 Milk', 0], ['🧊 Ice', 1], ['💧 Water', 0], ['🫗 Oil', 0], ['🪵 Wood', 1]] },
    5: { title: 'Energy Sort', desc: 'Is this energy source renewable?', a: '♻️ Renewable', b: '⛽ Non-renewable', ask: 'Renewable or not?',
         items: [['☀️ Sunlight', 1], ['💨 Wind', 1], ['⛏️ Coal', 0], ['⛽ Petrol', 0], ['🌊 Flowing water', 1], ['🔥 Natural gas', 0]] },
    6: { title: 'Conductor or Insulator?', desc: 'Does electricity pass through it?', a: '⚡ Conductor', b: '🛡️ Insulator', ask: 'Conductor or insulator?',
         items: [['Copper wire', 1], ['Iron nail', 1], ['Rubber', 0], ['Plastic', 0], ['Dry wood', 0], ['Aluminium foil', 1]] },
    7: { title: 'Acid or Base?', desc: 'Sort common substances.', a: '🍋 Acid', b: '🧼 Base', ask: 'Acid or base?',
         items: [['Lemon juice', 1], ['Vinegar', 1], ['Soap solution', 0], ['Baking soda', 0], ['Curd', 1], ['Lime water', 0]] },
    8: { title: 'Metal or Non-metal?', desc: 'Sort the elements.', a: '🔩 Metal', b: '💨 Non-metal', ask: 'Metal or non-metal?',
         items: [['Iron', 1], ['Copper', 1], ['Sulphur', 0], ['Carbon', 0], ['Aluminium', 1], ['Oxygen', 0]] },
    9: { title: 'Physical or Chemical?', desc: 'Sort the changes.', a: '🔄 Physical', b: '⚗️ Chemical', ask: 'Physical or chemical change?',
         items: [['Melting ice', 1], ['Burning paper', 0], ['Rusting iron', 0], ['Dissolving sugar', 1], ['Cooking an egg', 0], ['Tearing paper', 1]] },
    10: { title: 'Backbone or Not?', desc: 'Sort vertebrates and invertebrates.', a: '🦴 Vertebrate', b: '🪱 Invertebrate', ask: 'Does it have a backbone?',
          items: [['🐟 Fish', 1], ['🐸 Frog', 1], ['🪱 Earthworm', 0], ['🦋 Butterfly', 0], ['🐍 Snake', 1], ['🐙 Octopus', 0]] },
    11: { title: 'Scalar or Vector?', desc: 'Sort physical quantities.', a: '📏 Scalar', b: '➡️ Vector', ask: 'Scalar or vector?',
          items: [['Mass', 1], ['Speed', 1], ['Velocity', 0], ['Force', 0], ['Temperature', 1], ['Displacement', 0]] },
    12: { title: 'Ionic or Covalent?', desc: 'Sort compounds by bond type.', a: '⚡ Ionic', b: '🔗 Covalent', ask: 'Ionic or covalent?',
          items: [['NaCl', 1], ['KCl', 1], ['MgO', 1], ['H₂O', 0], ['CH₄', 0], ['CO₂', 0]] }
  };
  function sortGame() {
    const g = SORT[cls()] || SORT[1]; const box = $('#natureGame');
    const items = shuffle(g.items).slice(0, 6); let i = 0, score = 0;
    function ask() {
      if (i === items.length) { box.innerHTML = `<div class="game-question">🏆 ${score}/${items.length}</div><button id="startNatureGame" class="secondary">▶ Play again</button>`; $('#startNatureGame').onclick = sortGame; return; }
      const [name, isA] = items[i];
      box.innerHTML = `<div class="game-question">${esc(name)}<br><small>${esc(g.ask)}</small></div><div class="quiz-options"><button data-group="1">${g.a}</button><button data-group="0">${g.b}</button></div><p id="natureFeedback"></p>`;
      box.querySelectorAll('[data-group]').forEach((b) => b.onclick = () => {
        box.querySelectorAll('[data-group]').forEach((x) => x.disabled = true);
        const ok = Number(b.dataset.group) === isA; if (ok) score++;
        $('#natureFeedback').textContent = ok ? '🎉 Correct!' : `😊 Good try! It is ${(isA ? g.a : g.b).replace(/^\S+\s/, '')}.`;
        i++; setTimeout(ask, ok ? 700 : 1400);
      });
    }
    ask();
  }

  /* ---------- Wire up and refresh when the class changes ---------- */
  const cards = document.querySelectorAll('.game-card');
  function setup() {
    const c = cls();
    [[NUMBER, 0, 'numberGame', 'startNumberGame', numberGame], [PAIRS, 1, 'memoryGame', 'startMemoryGame', memoryGame], [SORT, 2, 'natureGame', 'startNatureGame', sortGame]]
      .forEach(([data, idx, boxId, btnId, fn]) => {
        const g = data[c] || data[1]; const card = cards[idx]; if (!card) return;
        card.querySelector('h3').textContent = g.title;
        card.querySelector('p').textContent = g.desc;
        document.getElementById(boxId).innerHTML = `<button class="secondary" id="${btnId}">▶ Play now</button>`;
        document.getElementById(btnId).onclick = fn;
      });
    const h = document.querySelector('.games h2'); if (h) h.textContent = `🎮 Class ${c} learning games`;
  }
  $('#classSelect').addEventListener('change', setup);
  setup();
})();
