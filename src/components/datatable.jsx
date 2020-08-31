import React, { Component } from "react";

class Datatable extends Component {
  render() {
    return (
      <div id="datatable" className="center">
        <table>
          <caption id="caption">Sään ääriarvot</caption>
          <tbody>
            <tr>
              <th>Aikaväli</th>
              <th>Korkein lämpötila (°C)</th>
              <th>Alhaisin lämpötila (°C)</th>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td id="last-day">Eilinen</td>
              <td id="last-day-hot"></td>
              <td id="last-day-cold"></td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td id="last-7-days">Edeltävä viikko</td>
              <td id="last-7-days-hot"></td>
              <td id="last-7-days-cold"></td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td id="last-30-days">Edeltävä kuukausi</td>
              <td id="last-30-days-hot"></td>
              <td id="last-30-days-cold"></td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td id="last-365-days">Edeltävä vuosi</td>
              <td id="last-365-days-hot"></td>
              <td id="last-365-days-cold"></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Datatable;
