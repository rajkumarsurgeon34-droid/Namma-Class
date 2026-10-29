// Namma Class — textbook shelf. Book list lives in books.json (class → medium → term → subject → file ids).
(function () {
  const TERM_NAMES = { '1': 'Term 1', '2': 'Term 2', '3': 'Term 3', F: 'Full year', V1: 'Volume 1', V2: 'Volume 2' };
  const MEDIUM_NAMES = { ta: 'தமிழ் Tamil', en: 'English' };
  const TA = { Tamil: 'தமிழ்', English: 'ஆங்கிலம்', Mathematics: 'கணிதம்', Science: 'அறிவியல்',
    'Social Science': 'சமூக அறிவியல்', 'Environmental Science': 'சூழ்நிலையியல்', 'Physical Education': 'உடற்கல்வி',
    Physics: 'இயற்பியல்', Chemistry: 'வேதியியல்', Botany: 'தாவரவியல்', Zoology: 'விலங்கியல்', History: 'வரலாறு',
    Geography: 'புவியியல்', Economics: 'பொருளியல்', Commerce: 'வணிகவியல்', Accountancy: 'கணக்குப்பதிவியல்',
    'Computer Science': 'கணினி அறிவியல்', 'Computer Applications': 'கணினி பயன்பாடுகள்' };
  const ICONS = { Tamil: ['அ', '#ff8b4a'], English: ['Aa', '#7665d8'], Mathematics: ['123', '#3eaa85'],
    'Environmental Science': ['🌱', '#3eaa85'], Science: ['🔬', '#4a9bd8'], 'Social Science': ['🌍', '#e0a030'],
    Physics: ['⚛', '#4a9bd8'], Chemistry: ['⚗', '#d8604a'], 'Physical Education': ['🏃', '#e0a030'] };

  const $ = (id) => document.getElementById(id);
  const store = {
    get(k) { try { return localStorage.getItem('nc-books-' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('nc-books-' + k, v); } catch (e) { /* private mode */ } }
  };
  const drive = {
    view: (id) => 'https://drive.google.com/file/d/' + id + '/preview',
    download: (id) => 'https://drive.google.com/uc?export=download&id=' + id
  };

  let DATA = null;
  const state = { cls: null, med: null, term: null };

  function chips(el, options, current, onPick) {
    el.innerHTML = '';
    options.forEach(([value, label]) => {
      const b = document.createElement('button');
      b.className = 'chip'; b.type = 'button'; b.textContent = label;
      b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', String(value === current));
      b.addEventListener('click', () => onPick(value));
      el.appendChild(b);
    });
  }

  function render() {
    const classes = DATA.classes;
    if (!classes[state.cls]) state.cls = Object.keys(classes)[0];
    const meds = classes[state.cls];
    if (!meds[state.med]) state.med = meds.ta ? 'ta' : Object.keys(meds)[0];
    const terms = meds[state.med];
    if (!terms[state.term]) state.term = Object.keys(terms)[0];
    store.set('class', state.cls); store.set('medium', state.med); store.set('term', state.term);

    chips($('classChips'), Object.keys(classes).map((c) => [c, c]), state.cls, (v) => { state.cls = v; render(); });
    chips($('mediumChips'), Object.keys(meds).map((m) => [m, MEDIUM_NAMES[m] || m]), state.med, (v) => { state.med = v; render(); });
    chips($('termChips'), Object.keys(terms).map((t) => [t, TERM_NAMES[t] || t]), state.term, (v) => { state.term = v; render(); });

    const grid = $('bookGrid'); grid.innerHTML = '';
    const books = terms[state.term];
    Object.keys(books).forEach((subject) => grid.appendChild(card(subject, books[subject])));
    if (!Object.keys(books).length) grid.innerHTML = '<p class="empty">No books listed here yet.</p>';
  }

  function card(subject, files) {
    const [icon, colour] = ICONS[subject] || [subject.slice(0, 2), '#ff914f'];
    const title = state.med === 'ta' && TA[subject] ? TA[subject] : subject;
    const sub = 'Class ' + state.cls + ' • ' + (TERM_NAMES[state.term] || state.term) + (title !== subject ? ' • ' + subject : '');
    const el = document.createElement('article');
    el.className = 'book';
    el.innerHTML = '<div class="book-head"><span class="book-icon"></span><div><h3></h3><small></small></div></div><div class="book-actions"></div>';
    const ic = el.querySelector('.book-icon'); ic.textContent = icon; ic.style.setProperty('--c', colour);
    el.querySelector('h3').textContent = title;
    el.querySelector('small').textContent = sub;
    const actions = el.querySelector('.book-actions');
    if (files.pdf) {
      const read = document.createElement('button');
      read.className = 'primary'; read.type = 'button'; read.textContent = '📖 Read';
      read.addEventListener('click', () => openReader(title + ' — Class ' + state.cls, files.pdf));
      actions.appendChild(read);
      actions.appendChild(link('⬇ PDF', drive.download(files.pdf)));
    }
    if (files.epub) actions.appendChild(link('⬇ EPUB', drive.download(files.epub)));
    if (files.web) actions.appendChild(link('🌐 Online', files.web));
    return el;
  }

  function link(text, href) {
    const a = document.createElement('a');
    a.className = 'secondary'; a.textContent = text; a.href = href; a.target = '_blank'; a.rel = 'noopener';
    return a;
  }

  function openReader(title, id) {
    $('readerTitle').textContent = title;
    $('readerDownload').href = drive.download(id);
    $('readerFrame').src = drive.view(id);
    $('reader').hidden = false;
    history.pushState({ reader: true }, '');
  }
  function closeReader() {
    $('reader').hidden = true;
    $('readerFrame').src = 'about:blank';
  }
  $('closeReader').addEventListener('click', () => { if (history.state && history.state.reader) history.back(); else closeReader(); });
  // Phone back button closes the book instead of leaving the page.
  window.addEventListener('popstate', () => { if (!$('reader').hidden) closeReader(); });

  const params = new URLSearchParams(location.search);
  state.cls = params.get('class') || store.get('class') || '1';
  state.med = params.get('medium') || store.get('medium') || 'ta';
  state.term = store.get('term') || '1';

  fetch('books.json')
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((d) => { DATA = d; $('yearLabel').textContent = d.year; render(); })
    .catch(() => { $('bookGrid').innerHTML = '<p class="empty">Could not load the book list. Check your internet and try again.</p>'; });
})();
