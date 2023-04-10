window.onload = function () {
  let wards = fetch('https://opendata.bristol.gov.uk/api/v2/catalog/datasets/wards/records?limit=50&select=name,ward_id')
    .then(response => response.json())
    .then(populateWards)
    .catch(err => console.log(err));
}

function populateWards(wards) {
  let buttons = new DocumentFragment();

  wards.records.sort((a, b) => {
      if (a.record.fields.name > b.record.fields.name){
          return 1;
      } else if (a.record.fields.name < b.record.fields.name){
          return -1;
      } else {
          return 0;
      }
  });
  //   wards.records.sort((a, b) => a.record.fields.name - b.record.fields.name);


  wards.records.forEach(w => {
      const [id, name] = [w.record.fields.ward_id, w.record.fields.name];
      const b = document.createElement("button");
//      const br = document.createElement("br");
      b.textContent = name;
      // b.onclick = displayData(id, name);
      b.addEventListener("click", displayData(id, name));
      buttons.appendChild(b);
//      buttons.appendChild(br);
      buttons.appendChild(document.createElement("br"));
  });


  let nav = document.getElementById("nav");
  nav.textContent = '';
  nav.append(buttons);
}

function displayData(id, name) {

  function buildPopulation(records) {

    // Make heading
    let heading = document.createElement('h2');
    heading.textContent = 'Population';

    // Make table
    let table = document.createElement('table');
    table.setAttribute('id','populationTable');

    // Make table header
    let header = document.createElement('tr');
    header.innerHTML = '<th>Year</th><th>Population</th></tr>';
    table.appendChild(header);

    // Populate table
    records.filter(item => item.record.fields.mid_year > 2015)
    //   records
      .sort((x1, x2) => x1.record.fields.mid_year < x2.record.fields.mid_year ? -1 : 1)
      .forEach(r => {
        let year = document.createElement('td');
        year.textContent = r.record.fields.mid_year;
        let population = document.createElement('td');
        population.textContent = r.record.fields.population_estimate;

        let row = document.createElement('tr');
        row.append(year, population);
        table.appendChild(row);
    });

    let population = new DocumentFragment();
    population.append(heading, table);

    return population;
  }

  function buildBody(records1, records2){
      // Make heading
      let heading = document.createElement('h2');
      heading.textContent = 'Population and Life Expectancy';

      // Make table 1
      let table = document.createElement('table');
      table.setAttribute('id','populationTable');

      // Make table1 header
      let header = document.createElement('tr');
      header.innerHTML = '<th>Year</th><th>Population</th></tr>';
      table.appendChild(header);

      // Populate table
      records1.filter(item => item.record.fields.mid_year > 2015)
          //   records
          .sort((x1, x2) => x1.record.fields.mid_year < x2.record.fields.mid_year ? -1 : 1)
          .forEach(r => {
              let year = document.createElement('td');
              year.textContent = r.record.fields.mid_year;
              let population = document.createElement('td');
              population.textContent = r.record.fields.population_estimate;

              let row = document.createElement('tr');
              row.append(year, population);
              table.appendChild(row);
          });

      let table2 = document.createElement('table');
      table2.setAttribute('id', 'lifeTable');

      let header2 = document.createElement('tr');
      header2.innerHTML = '<th>Year</th><th>Male Life Expectancy</th><th>Female Life Expectancy</th></tr>';
      table2.appendChild(header2);

      records2
          .sort((x1, x2) => eval(x1.fields.year.toString().substring(0, 4)) - eval(x2.fields.year.toString().substring(0, 4)))
          .forEach(item => {
              let year = document.createElement('td');
              year.textContent = item.fields.year;
              let maleLife = document.createElement('td');
              maleLife.textContent = item.fields.male_life_expectancy;

              let femaleLife = document.createElement('td');
              femaleLife .textContent = item.fields.female_life_expectancy;

              let row = document.createElement('tr');
              row.append(year, maleLife, femaleLife);

              table2.appendChild(row);
              }
          )

      let body = new DocumentFragment();
      body.append(heading, table, document.createElement('br'), table2);

      return body;
  }


  return function () {
    let wards = fetch(`https://opendata.bristol.gov.uk/api/v2/catalog/datasets/population-estimates-time-series-ward/records?limit=20&select=mid_year,population_estimate&refine=ward_2016_code:${id}`)
      .then(response => response.json())
      .then(data1 => {
        fetch(`https://opendata.bristol.gov.uk/api/records/1.0/search/?dataset=life-expectancy-in-bristol&q=&sort=-year&facet=ward_name&facet=year&refine.ward_name=${name}`)
            .then(response => response.json())
            .then(data2 => {
                let heading = document.createElement('h1');
                heading.textContent = name;

                // let population = buildPopulation(data1.records);
                let body = buildBody(data1.records, data2.records);

                let dataPane = document.getElementById("dataPane");
                dataPane.textContent = '';
                dataPane.append(heading, body);
            })

      })
      .catch(err => console.log(err));
  }
}