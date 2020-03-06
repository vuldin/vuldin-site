import { domEntry } from "./domEntry";

describe("starting with no element", () => {
  let result;

  beforeAll(() => {
    result = domEntry();
  });

  afterAll(() => {
    document.body.innerHTML = "";
  });

  test("adds new div to window", () => {
    expect(document.body.childElementCount).toBe(1);
    expect(document.getElementById("app")).toBeInstanceOf(HTMLElement);
  });

  test("returns a pointer to the div", () => {
    expect(result).toBe(document.body.firstChild);
  });
});

describe("starting with an element", () => {
  let div;
  let result;

  beforeAll(() => {
    div = document.createElement("div");
    div.setAttribute("id", "app");
    div.setAttribute("data-test", "test");
    document.body.insertBefore(div, document.body.firstChild);

    result = domEntry();
  });

  test("reuses existing #app div", () => {
    expect(document.body.childElementCount).toBe(1);
    expect(result.dataset.test).toBe("test");
  });

  test("returns a pointer to the div", () => {
    expect(div).toBe(result);
    expect(result).toBe(document.body.firstChild);
  });
});
