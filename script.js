const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQv.../pub?output=csv'; // Replace with your CSV export link

let questions = [];

async function fetchCSV() {
  const res = await fetch(sheetURL);
  const text = await res.text();
  const rows = text.split('\n').map(row => row.split(','));
  const headers = rows[0];
  questions = rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = row[i]?.trim());
    return obj;
  });
  populateFilters();
  renderResults();
}

function populateFilters() {
  const subjects = [...new Set(questions.map(q => q.Subject))];
  const years = [...new Set(questions.map(q => q.Year))];

  subjects.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    document.getElementById('subjectFilter').appendChild(opt);
  });

  years.forEach(year => {
    const opt = document.createElement('option');
    opt.value = year;
    opt.textContent = year;
    document.getElementById('yearFilter').appendChild(opt);
  });
}

function renderResults() {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = '';
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const subject = document.getElementById('subjectFilter').value;
  const year = document.getElementById('yearFilter').value;

  const filtered = questions.filter(q => {
    return (!keyword || q.Question.toLowerCase().includes(keyword)) &&
           (!subject || q.Subject === subject) &&
           (!year || q.Year === year);
  });

  filtered.forEach(q => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `<strong>Subject:</strong> ${q.Subject}<br/>
                      <strong>Year:</strong> ${q.Year}<br/>
                      <strong>Question:</strong> ${q.Question}<br/>
                      <strong>Answer:</strong> ${q.Answer}`;
    container.appendChild(card);
  });
}

document.getElementById('searchInput').addEventListener('input', renderResults);
document.getElementById('subjectFilter').addEventListener('change', renderResults);
document.getElementById('yearFilter').addEventListener('change', renderResults);

fetchCSV();