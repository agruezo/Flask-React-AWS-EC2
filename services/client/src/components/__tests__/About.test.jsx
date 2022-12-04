/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, cleanup } from "@testing-library/react";

import About from "../About";

afterEach(cleanup);

it("renders properly", () => {
  const { getByText } = render(<About />);
  expect(
    getByText("Deploying a Flask and React Microservice to AWS EC2")
  ).toHaveClass("title");
});

it("renders", () => {
  const { asFragment } = render(<About />);
  expect(asFragment()).toMatchSnapshot();
});
