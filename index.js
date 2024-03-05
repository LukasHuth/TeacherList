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
  show_start_time: false,
  classes_trim_at: 13,
  convert_moved_room: true,
  hide_cancelled: true,
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
  hide_cancelled: findBoolGetParameter("hide_cancelled") ?? default_config.hide_cancelled,
};
window.onload = () => {
  loadTable();
  setInterval(() => loadTable(), config.update_time);
}
function loadTable() {
  console.log(config);
  const cardContainer = document.getElementById('card-container');
  var card_amount = cardContainer.childNodes.length;
  while(card_amount > 0) {
    cardContainer.removeChild(cardContainer.childNodes[card_amount-1]);
    card_amount--;
  }
  const url = config.dev ? 'lehrer.txt' : 'https://bigbrother2.lgsit.de/untisdata/lehrer.txt';
  fetch(url).then(response => {
    if(!response.ok) {
      console.error("Could not load the data")
    }
    return response.text();
  }).then(data => {
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
      data.split("\n")
        .filter(l => l != "")
        .map(line => line.split("|"))
        .sort(sort_alg)
        .filter(arr => !shouldBeIgnoredFilter(arr))
        .forEach(splited_line => {
          console.log(splited_line);
        if(splited_line == []) return;
        const teacher = splited_line[0];
        const start = splited_line[1];
        const end = splited_line[2];
        const room = getRoomName(splited_line[3]);
        const teacher_status = splited_line[7];
        if(shouldBeIgnored(room, teacher, teacher_status, start, end)) return;
        const name = teacher;
        var class_name = '';
        var start_time = '';
        if(room == "-") roomColoumn.setAttribute("style", "background-color:#fbb;");
        if(config.show_classes) {
          const klassen = splited_line[5];
          const shorted_klassen = (klassen.length < config.classes_trim_at) ? klassen : klassen.slice(0, config.classes_trim_at-3) + "...";
          class_name = shorted_klassen;
        }
        if(config.show_start_time) {
          const startTime = new Date(start);
          start_time = `${startTime.getHours()}:${startTime.getMinutes()}`;
        }
        cardContainer.appendChild(createCard(name, room, class_name, start_time));
      });
    });
};
function shouldBeIgnoredFilter(arr) {
  if(arr == []) return true;
  return shouldBeIgnored(getRoomName(arr[3]), arr[0]+"", arr[7], arr[1], arr[2]);
}
function createCard(name, room, class_name, start_time) {
  const card = document.createElement('div');
  const cardheader = document.createElement('div');
  const header = document.createElement('h4');
  const cardbody = document.createElement('div');
  const ul = document.createElement('div');
  const e1 = document.createElement('li');
  const e2 = document.createElement('li');
  const e3 = document.createElement('li');
  card.classList.add('card');
  cardheader.classList.add('card-header');
  header.textContent = name;
  cardbody.classList.add('card-body');
  ul.classList.add('list-unstyled');
  e1.textContent = room;
  e2.textContent = class_name;
  e3.textContent = start_time;
  ul.appendChild(e1);
  if(class_name !== '') ul.appendChild(e2);
  if(start_time !== '') ul.appendChild(e3);
  cardheader.appendChild(header);
  cardbody.appendChild(ul);
  card.appendChild(cardheader);
  card.appendChild(cardbody);
  return card;
}
function getRoomName(room_name) {
  const room_name_str = room_name + "";
  if(!config.convert_moved_room) return room_name;
  if(!room_name_str.startsWith("+")) return room_name;
  const pos_of_parenthesis = room_name_str.indexOf("(");
  return room_name_str.slice(1, pos_of_parenthesis);
}
function sortByName(e1, e2) {
  return e1[0].localeCompare(e2[0]);
}
function sortByRoom(e1, e2) {
  console.log(e1, e2);
  return e1[3].localeCompare(e2[3]);
}
function shouldBeIgnored(room, teacher, teacher_status, start, end) {
  if(teacher == "") return true;
  if(teacher.toLowerCase().startsWith('zn')) return true; // intern structs
  if(room == "" && config.hide_null_teachers) return true;
  if(teacher_status == "cancelled" && config.hide_cancelled) return true;
  if(teacher_status == "Gone" && config.hide_gone) return true;
  if(teacher_status == "NoData" && config.hide_no_data) return true;
  if(start != "-" && (getTime(start) > now(config.offset_to_next_course))) return true;
  if(start != "-" && ((getTime(start) > now()) || (getTime(end) < now())) && config.only_currently) return true;
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
