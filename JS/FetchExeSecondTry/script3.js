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

    function createElementText(tag, text) {
        let elem = document.createElement(tag);
        elem.textContent = text;
        return elem;
    }

    function createElementWith(tag, xs) {
        let elem = document.createElement(tag);
        for (const x of xs) {
            elem.appendChild(x);
        }
        return elem;
    }
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

        // if there are {}, it must have a return
        const arr = records.map((record) => {
            return createElementWith('tr', [
                createElementText('td', record.record.fields.year),
                createElementText('td', record.record.fields.male_life_expectancy),
                createElementText('td', record.record.fields.female_life_expectancy)
            ])
        })

        for (const element of arr){
            table.append(element)
        }

        let division = new DocumentFragment()
        division.append(heading, table)
        return division

    }

    function buildPopulation(records) {

        // Make heading
        let heading = document.createElement('h2');
        heading.textContent = 'Population';

        let table = document.createElement('table');
        table.setAttribute('id','populationTable');

        let header = document.createElement('tr');
        header.innerHTML = '<th>Year</th><th>Population</th></tr>';

        table.append(header)

        const arr = records.sort((x1, x2) => x1.record.fields.mid_year < x2.record.fields.mid_year ? -1 : 1)
                .map(r =>
                    createElementWith('tr', [
                        createElementText('td', r.record.fields.mid_year),
                        createElementText('td', r.record.fields.population_estimate)
                    ])
                )

        for (const element of arr){
            table.append(element)
        }

        let population = new DocumentFragment();
        population.append(heading, table);
        return population;
    }

    return function () {
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

}