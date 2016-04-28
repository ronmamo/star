import React from "react";
import { render } from "react-dom";

const register = (id, Comp) => render(<Comp />, document.getElementById(id));
export default register;
