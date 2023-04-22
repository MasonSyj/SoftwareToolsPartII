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
        } else if (a.record.fields.name == b.record.fields.name){
            return 0;
        } else{
            return -1;
        }
    })

    wards.records.forEach(ward => {
        const [name, id] = [ward.record.fields.name, ward.record.fields.ward_id]
        const b = document.createElement("button")
        b.textContent = name;
//        b.onclick = displayData(id, name)
        b.addEventListener("click",displayData(id, name))
        buttons.append(b)
        buttons.append(document.createElement("br"))
    });


    let nav = document.getElementById("nav");
    nav.textContent = '';
    nav.append(buttons);
}

function displayData(id, name) {

    function buildLife(records) {
        let heading = document.createElement('h2')
        heading.textContent = 'Life Expecancy'

        let table = document.createElement('table')
        table.setAttribute('id', 'lifeTable')

        let header = document.createElement('tr')
        header.innerHTML = '<th>Time Period</th><th>Male</th><th>Female</th></tr>'
        table.appendChild(header)

        records = records.sort((a, b) => {
            if (parseInt(a.record.fields.year.slice(0, 5)) - parseInt(b.record.fields.year.slice(0, 5)) > 0){
                return 1;
            } else {
                return -1;
            }
        })

        records.forEach(record => {
            let year = document.createElement('td')
            year.textContent = record.record.fields.year

            let male = document.createElement('td')
            male.textContent = record.record.fields.male_life_expectancy

            let female = document.createElement('td')
            female.textContent = record.record.fields.female_life_expectancy

            let item = document.createElement('tr')
            item.append(year, male, female)
            table.append(item)
        })

        let division = new DocumentFragment()
        division.append(heading, table)

        return division

    }

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

        records = records.filter(record => record.record.fields.mid_year > 2015)

        // use of map, a silly way but to show the theory of map
        // map can't be used here because it only revise the content but not remove element
        //const filter = records.map(record => {if (record.record.fields.mid_year > 2015)}).filter(record => record !== undefined)

        // Populate table
        records.sort((x1, x2) => x1.record.fields.mid_year < x2.record.fields.mid_year ? -1 : 1)
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

    return function () {
        // use of the temporal literals
        // https://opendata.bristol.gov.uk/api/v2/catalog/datasets/life-expectancy-in-bristol/records?ward_code="E05010902"
        /*
        let wards = fetch(`https://opendata.bristol.gov.uk/api/v2/catalog/datasets/population-estimates-time-series-ward/records?limit=20&select=mid_year,population_estimate&refine=ward_2016_code:${id}`)
            .then(response => response.json())
            .then(data => {
                fetch(`https://opendata.bristol.gov.uk/api/v2/catalog/datasets/life-expectancy-in-bristol/records?ward_code:${id}`)
                    .then(response => response.json())
                    .then(life => {
                        let dataPane = document.getElementById("dataPane");
                        dataPane.textContent = '';

                        let heading = document.createElement('h1');
                        heading.textContent = name;
                        dataPane.append(heading)

                        let population = buildPopulation(data.records);
                        dataPane.append(population);

                        let lifeHeading = document.createElement('h1')
                        heading.textContent = name;
                        dataPane.append(lifeHeading)

                        let lifeExpectancy = buildLife(life.records)
                        dataPane.append(lifeExpectancy)

                    })

            })
            .catch(err => console.log(err));
        */

        Promise.all([fetch(`https://opendata.bristol.gov.uk/api/v2/catalog/datasets/population-estimates-time-series-ward/records?limit=20&select=mid_year,population_estimate&refine=ward_2016_code:${id}`)
            , fetch(`https://opendata.bristol.gov.uk/api/v2/catalog/datasets/life-expectancy-in-bristol/records?ward_code:${id}`)])
            .then(([response1, response2]) => Promise.all([response1.json(), response2.json()]))
            .then(([data, life]) => {
                let dataPane = document.getElementById("dataPane");
                dataPane.textContent = '';

                let heading = document.createElement('h1');
                heading.textContent = name;
                dataPane.append(heading)

                let population = buildPopulation(data.records);
                dataPane.append(population);

                let lifeHeading = document.createElement('h1')
                heading.textContent = name;
                dataPane.append(lifeHeading)

                let lifeExpectancy = buildLife(life.records)
                dataPane.append(lifeExpectancy)
            });
    }
/*
    Promise.all([fetch('first-URL'), fetch('second-URL')])
        .then([response1, response2] => Promise.all([response1.json(), response2.json()]))
.then([data1, data2] => {
        // ... here you can use both data1 and data2 ...
    });


    Promise.all([fetch('first-URL'), fetch('second-URL')])
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then([data1, data2] => {
        // ... here you can use both data1 and data2 ...
    });
*/
}