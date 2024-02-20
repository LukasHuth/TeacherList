const default_config = {
  dev: true,
  table_amount: 2,
  hide_null_teachers: true,
  hide_gone: true,
  hide_no_data: true,
};
const config = {
  dev: true,
  table_amount: findIntGetParameter("table_amount") ?? default_config.table_amount,
  hide_null_teachers: findBoolGetParameter("hide_null_teachers") ?? default_config.hide_null_teachers,
  hide_gone: findBoolGetParameter("hide_gone") ?? default_config.hide_gone,
  hide_no_data: findBoolGetParameter("hide_no_data") ?? default_config.hide_no_data,
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
        const nameColumn = document.createElement('td');
        const roomColoumn = document.createElement('td');
        const room = splited_line[3];
        const teacher = splited_line[0];
        const teacher_status = splited_line[7];
        const index = i%config.table_amount;
        if(shouldBeIgnored(room, teacher, teacher_status)) return;
        nameColumn.textContent = teacher;
        roomColoumn.textContent = room;
        if(room == "-") roomColoumn.setAttribute("style", "background-color:#fbb;");
        row.appendChild(nameColumn);
        row.appendChild(roomColoumn);
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
function shouldBeIgnored(room, teacher, teacher_status) {
  if(teacher.toLowerCase().startsWith('zn')) return true; // intern structs
  if(room == "" && config.hide_null_teachers) return true;
  if(teacher_status == "Gone" && config.hide_gone) return true;
  if(teacher_status == "NoData" && config.hide_no_data) return true;
  return false;
}
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
  if(result != 'false' && result != 'true') return null;
  return result == 'true';
}
function findIntGetParameter(paramaterName) {
  var result = findGetParameter(paramaterName);
  if(result == null) return null;
  if(isNaN(result)) return null;
  return Number(result);
}
