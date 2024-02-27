const sortTypes = {
  ByName: 'ByName',
  ByRoom: 'ByRoom',
};
const default_config = {
  dev: true,
  table_amount: 2,
  hide_null_teachers: true,
  hide_gone: true,
  hide_no_data: true,
  only_currently: true,
  update_time: 15*60*1000,
  offset_to_next_course: 30*60*1000,
  sort_type: sortTypes.ByName,
  show_classes: true,
  show_start_time: true,
  classes_trim_at: 13,
  convert_moved_room: true,
};
const config = {
  dev: findBoolGetParameter("dev") ?? default_config.dev,
  table_amount: findIntGetParameter("table_amount") ?? default_config.table_amount,
  hide_null_teachers: findBoolGetParameter("hide_null_teachers") ?? default_config.hide_null_teachers,
  hide_gone: findBoolGetParameter("hide_gone") ?? default_config.hide_gone,
  hide_no_data: findBoolGetParameter("hide_no_data") ?? default_config.hide_no_data,
  only_currently: findBoolGetParameter("only_currently") ?? default_config.only_currently,
  update_time: findIntGetParameter("update_time") ?? default_config.update_time,
  offset_to_next_course: findIntGetParameter("offset_to_next_course") ?? default_config.offset_to_next_course,
  sort_type: findEnumGetParameter("sort_type") ?? default_config.sort_type,
  show_classes: findIntGetParameter("show_classes") ?? default_config.show_classes,
  show_start_time: findBoolGetParameter("show_start_time") ?? default_config.show_start_time,
  classes_trim_at: findIntGetParameter("classes_trim_at") ?? default_config.classes_trim_at,
  convert_moved_room: findBoolGetParameter("convert_moved_room") ?? default_config.convert_moved_room,
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
      var sort_alg;
      switch(config.sort_type) {
        case sortTypes.ByName:
          sort_alg = sortByName;
          break;
        case sortTypes.ByRoom:
          sort_alg = sortByRoom;
          break;
        default:
          sort_alg = sortByName;
          break;
      }
      tableContainer.classList.add(`e${getColumnAmount()}`);
      t.split("\n").filter(l => l != "").map(line => line.split("|")).sort(sort_alg).forEach(splited_line => {
        if(splited_line == []) return;
        const row = document.createElement('tr');
        const nameColumn = document.createElement('td');
        const roomColoumn = document.createElement('td');
        const teacher = splited_line[0];
        const start = splited_line[1];
        const end = splited_line[2];
        const room = getRoomName(splited_line[3]);
        const teacher_status = splited_line[7];
        const index = i%config.table_amount;
        if(shouldBeIgnored(room, teacher, teacher_status, start, end)) return;
        nameColumn.textContent = teacher;
        roomColoumn.textContent = room;
        if(room == "-") roomColoumn.setAttribute("style", "background-color:#fbb;");
        row.appendChild(nameColumn);
        row.appendChild(roomColoumn);
        if(config.show_classes) {
          const klasseColoumn = document.createElement('td');
          const klassen = splited_line[5];
          const shorted_klassen = (klassen.length < config.classes_trim_at) ? klassen : klassen.slice(0, config.classes_trim_at-3) + "...";
          klasseColoumn.textContent = shorted_klassen;
          row.appendChild(klasseColoumn);
        }
        if(config.show_start_time) {
          const startTimeColumn = document.createElement('td');
          const startTime = new Date(start);
          startTimeColumn.textContent = `${startTime.getHours()}:${startTime.getMinutes()}`;
          row.appendChild(startTimeColumn);
        }
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
function getRoomName(room_name) {
  const room_name_str = room_name + "";
  if(!config.convert_moved_room) return room_name;
  if(!room_name_str.startsWith("+")) return room_name;
  const pos_of_parenthesis = room_name_str.indexOf("(");
  return room_name_str.slice(1, pos_of_parenthesis);
}
function getColumnAmount() {
  var amount = 2;
  if(config.show_start_time) amount++;
  if(config.show_classes) amount++;
  return amount;
}
function sortByName(e1, e2) {
  return e1[0].localeCompare(e2[0]);
}
function sortByRoom(e1, e2) {
  console.log(e1, e2);
  return e1[3].localeCompare(e2[3]);
}
function shouldBeIgnored(room, teacher, teacher_status, start, end) {
  console.log("start test");
  if(teacher.toLowerCase().startsWith('zn')) return true; // intern structs
  if(room == "" && config.hide_null_teachers) return true;
  if(teacher_status == "Gone" && config.hide_gone) {
    console.log("gone")
    return true;
  }
  if(teacher_status == "NoData" && config.hide_no_data) {
    console.log("NoData");
    return true;
  }
  if(start != "-" && (getTime(start) > now(config.offset_to_next_course))) {
    console.log("time")
    return true;
  }
  if(start != "-" && ((getTime(start) > now()) || (getTime(end) < now())) && config.only_currently) {
    console.log("now")
    return true;
  }
  return false;
}
function getTime(timeStr) {
  return new Date(timeStr) + (60 * 60 * 1000);
}
function now(offset) {
  return new Date() + offset;
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
function findEnumGetParameter(paramaterName) {
  var result = findGetParameter(paramaterName);
  if(result == null) return null;
  if(!sortTypes.hasOwnProperty(result)) return null;
  return result;
}
