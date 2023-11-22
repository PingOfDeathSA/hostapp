var hours_worked = document.getElementById("hours-worked-input");
var hourly_rate_input = document.getElementById("hourly-rate-input");
var basic_salary_input = document.getElementById("basic-salary-input");

function updateBasicSalary() {
  var hourly_rate = parseFloat(hourly_rate_input.textContent);
  var basic_salary = hours_worked.value * hourly_rate;
  basic_salary_input.value = basic_salary.toFixed(2);
}

hours_worked.addEventListener("input", updateBasicSalary);
function exportTableToExcel(tableId) {
  var wb = XLSX.utils.table_to_book(document.getElementById(tableId), {sheet:"Sheet JS"});
  var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'table.xlsx');
}
function downloadExcel() {
  var table = document.getElementsByTagName('table')[0];
  var rows = table.getElementsByTagName('tr');
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll('td, th');
    for (var j = 0; j < cols.length; j++) 
      row.push(cols[j].innerText);
    csv.push(row.join(','));
  }
  var csvFile = new Blob([csv.join('\n')], {type: 'text/csv'});
  var downloadLink = document.createElement('a');
  downloadLink.download = 'table.csv';
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

$(document).ready(function() {
  $('.employee-no-input').prop('disabled', true);
});