import React, { Component } from "react";

class Navigation extends Component {
  handleSelection = (id) => {
    if (id === 1) {
      console.log("Lämpötila");
    } else if (id === 2) {
      console.log("Salamat");
    }
  };

  render() {
    return (
      <div id="nav">
        <ul className="nav nav-pills nav-fill bg-dark">
          <li className="nav-item">
            <a
              onClick={() => this.handleSelection(1)}
              className="nav-link text-white"
              href="#"
            >
              Lämpötilahistoria
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              Lämpötilakuvaaja
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => this.handleSelection(2)}
              className="nav-link text-white"
              href="#"
            >
              Salamat
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              Lumensyvyys
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Navigation;
