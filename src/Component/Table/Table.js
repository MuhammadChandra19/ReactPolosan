import React, { Component } from 'react';

class Table extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }


    }

    render() {

        const TableHeader = this.props.tableHeader.map((dt, index) =>
            <th key={index}>{dt}</th>
        );
        const TableBody = this.props.tableBody.map((dt, index) =>


            <tr key={index}>{
                Object.keys(dt).slice(1).map((keyName) =>
                    <td >{dt[keyName]}</td>
                )
            }


                {/* {
                    Object.keys(dt).slice(1).map((keyName) => { return Array.isArray(dt[keyName]) && dt.button[0].action !== undefined ? (dt.button.map((val, i) => <td key={i}>{val.action}</td>)) : (<td >{dt[keyName]}</td>) })
                } */}
            </tr>
        )
        return (
            <table className="table">
                <thead>
                    <tr>
                        {TableHeader}
                    </tr>
                </thead>
                <tbody>
                    {TableBody}
                </tbody>
            </table>
        )
    }
}
export default Table;