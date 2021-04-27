import { LightningElement, track } from 'lwc';

const columns = [
    { label: 'SF Object', fieldName: 'sfObj' },
    { label: 'OB Object', fieldName: 'obObj' },
    { label: 'Delta', fieldName: 'delta', cellAttributes: {
        class: {
            fieldName: 'cellCss'
        }
    }}
];

export default class App extends LightningElement
{
    testBool = true;
    someData = 'barry';
    tblData = [];

    /*tblData = [
        {
            "name": "Malinda Schmidt",
            "email": "Rogers.Rodriguez40@yahoo.com",
            "website": "https://taylor.info",
            "amount": "196.42",
            "phone": "(612) 600-3488 x30867",
            "closeAt": "2021-10-29T16:53:48.394Z",
            "id": "30d8bfba-65c8-4f71-a24b-774aec87b29f"
        },
        {
            "name": "Eugenia Russel",
            "email": "Cullen_Dach@hotmail.com",
            "website": "http://molly.name",
            "amount": "737.08",
            "phone": "(182) 959-9272 x3929",
            "closeAt": "2022-03-28T01:36:28.111Z",
            "id": "bf521fee-b467-4fcc-9142-e70705ca5b3e"
        },
        {
            "name": "Carlie Nikolaus",
            "email": "Terrill.Oberbrunner@gmail.com",
            "website": "http://minerva.net",
            "amount": "632.27",
            "phone": "(225) 651-0565 x88305",
            "closeAt": "2021-12-10T13:48:25.760Z",
            "id": "758ae04c-eb8e-42a3-8016-7421d4085213"
        },
        {
            "name": "Earnestine Schiller",
            "email": "Ezequiel54@hotmail.com",
            "website": "http://odie.net",
            "amount": "46.57",
            "phone": "599-871-4206 x305",
            "closeAt": "2021-12-24T08:01:14.904Z",
            "id": "68893cbb-d488-48bb-a66d-cdbac563c2fd"
        }
    ];*/
    columns = columns;

    connectedCallback() {
        var HOST = location.origin.replace(/^http/, 'ws')
        var ws = new WebSocket(HOST);

        ws.onmessage = function (event) {
            console.log(typeof(event));
            console.log(event);
            console.log(event.data);
        };
    }

    handleClick() {
        this.testBool = false;
        console.log(this.someData);
        fetch('/mytest')
        .then(response => response.json())
        .then(data => {this.tblData = data});
    }

    handleClickBar() {
        this.testBool = false;
        console.log(this.someData);
        fetch('/mytest')
        .then(response => response.json())
        .then(data => {
            console.log(typeof(data));
            console.log(data);
            this.someData = JSON.stringify(data);
        });
    }
}
