function searchTable() {
    // Declare variables for search input, table, and table rows
    var input, table, rows, td, i, txtValue;
    input = document.getElementById("searchInput"); // Replace "searchInput" with the ID of your search input field
    table = document.getElementById("dataTable"); // Replace "dataTable" with the ID of your table
    rows = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those that don't match the search query
    for (i = 0; i < rows.length; i++) {
      td = rows[i].getElementsByTagName("td")[1]; // Replace "1" with the index of the column you want to search in (e.g. 0 for Profile Picture, 1 for Address, 2 for Gender, etc.)
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(input.value.toUpperCase()) > -1) {
          rows[i].style.display = "";
        } else {
          rows[i].style.display = "none";
        }
      }
    }
  }

  console.log(searchTable())