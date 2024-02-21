const default_config = {
  dev: true,
  table_amount: 2,
  hide_null_teachers: true,
  hide_gone: true,
  hide_no_data: true,
  only_currently: true,
  update_time: 15*60*1000,
};
const config = {
  dev: findBoolGetParameter("dev") ?? default_config.dev,
  table_amount: findIntGetParameter("table_amount") ?? default_config.table_amount,
  hide_null_teachers: findBoolGetParameter("hide_null_teachers") ?? default_config.hide_null_teachers,
  hide_gone: findBoolGetParameter("hide_gone") ?? default_config.hide_gone,
  hide_no_data: findBoolGetParameter("hide_no_data") ?? default_config.hide_no_data,
  only_currently: findBoolGetParameter("only_currently") ?? default_config.only_currently,
  update_time: findIntGetParameter("update_time") ?? default_config.update_time,
};
var new_update = new Date();
window.onload = () => {
  loadTable();
  setInterval(() => loadTable(), config.update_time);
}
function loadTable() {
  console.log(config);
  const tables = [];
  const tableContainer = document.getElementById('table-container');
  var table_amount = tableContainer.childNodes.length;
  while(table_amount > 0) {
    tableContainer.removeChild(tableContainer.childNodes[table_amount-1]);
    table_amount--;
  }
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
        const teacher = splited_line[0];
        const start = splited_line[1];
        const end = splited_line[2];
        const room = splited_line[3];
        const teacher_status = splited_line[7];
        const index = i%config.table_amount;
        if(shouldBeIgnored(room, teacher, teacher_status, start, end)) return;
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
function shouldBeIgnored(room, teacher, teacher_status, start, end) {
  if(teacher.toLowerCase().startsWith('zn')) return true; // intern structs
  if(room == "" && config.hide_null_teachers) return true;
  if(teacher_status == "Gone" && config.hide_gone) return true;
  if(teacher_status == "NoData" && config.hide_no_data) return true;
  if(((new Date(start) > new Date()) || (new Date(end) < new Date())) && config.only_currently) return true;
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