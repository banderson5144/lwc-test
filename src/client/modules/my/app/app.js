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
    tblData = [];
    columns = columns;
    isLoading = false;

    connectedCallback() {
        var HOST = location.origin.replace(/^http/, 'ws')
        var ws = new WebSocket(HOST);

        ws.onmessage = (event) => {
        
            this.tblData = JSON.parse(event.data);
            this.isLoading = false;
        };
    }

    handleClickBar() {
        this.testBool = false;
        this.isLoading = true;

        fetch('/mytest')
        .then(response => response.json())
        .then(data => {
            this.someData = JSON.stringify(data);
        });
    }
}
