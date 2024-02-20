const default_config = {
  include_abscent_teacher: true,
  dev: true,
  table_amount: 2,
};
const config = {
  include_abscent_teacher: findBoolGetParameter("include_abscent_teacher") ?? default_config.include_abscent_teacher,
  dev: true,
  table_amount: findIntGetParameter("table_amount") ?? default_config.table_amount,
};
window.onload = () => loadTable();
function loadTable() {
  console.log(config);
  const tables = [];
  const tableContainer = document.getElementById('table-container');
  for(var i = 0; i < config.table_amount; i++) {
    const table = document.createElement('table');
    tableContainer.append(table);
    tables.push(table);
  }
  const url = config.dev ? 'lehrer.txt' : 'https://bigbrother2.lgsit.de/untisdata/lehrer.txt';
  fetch(url).then(response => {
    if(!response.ok) {
      console.error("Could not load the data")
    }
    return response.text();
  }).then(data => {
      var t = "" + data;
      var i = 0;
      t.split("\n").forEach(line => {
        if(line == "") return;
        var splited_line = line.split("|");
        const row = document.createElement('tr');
        const e1 = document.createElement('td');
        const e2 = document.createElement('td');
        const room = splited_line[3];
        const teacher = splited_line[0];
        const index = i%config.table_amount;
        if(teacher.toLowerCase().startsWith('zn')) return;
        if(room == "-" && !config.include_abscent_teacher) return;
        console.log(room, "-", room == "-", !config.include_abscent_teacher, room == "-" && !config.include_abscent_teacher);
        e1.textContent = teacher;
        e2.textContent = room;
        if(room == "-") e2.setAttribute("style", "background-color:#fbb;");
        row.appendChild(e1);
        row.appendChild(e2);
        console.log(tables, index);
        tables[index].appendChild(row);
        i += 1;
      });
      while(i%config.table_amount != 0) {
        // buffer element
        tables[i%config.table_amount].appendChild(document.createElement('tr'));
        i += 1;
      }
    });
};
function findGetParameter(parameterName) {
  var result = null,
  tmp = [];
  location.search
    .substring(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}
function findBoolGetParameter(paramaterName) {
  var result = findGetParameter(paramaterName);
  if(result == null) return null;
  return result == 'true';
}
function findIntGetParameter(paramaterName) {
  var result = findGetParameter(paramaterName);
  if(result == null) return null;
  if(isNaN(result)) return null;
  return Number(result);
}
