export function domEntry(
  elementId: string = "app",
  elementType: string = "div"
) {
  let domEntry = document.getElementById(elementId);
  if (!domEntry) {
    domEntry = document.createElement(elementType);
    domEntry.setAttribute("id", elementId);
    document.body.insertBefore(domEntry, document.body.firstChild);
  }

  return domEntry;
}
