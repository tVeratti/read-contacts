const fs = require("node:fs");
const jsdom = require("jsdom");

const dataSelect = (selector) => `[data-cy="${selector}"]`;
const CONTACT_SELECTOR = dataSelect("contact-row");
const CONTACT_NAME_SELECTOR = dataSelect("contact-row-display-name");
const CONTACT_PHONE_SELECTOR = dataSelect("contact-row-tel");

const { JSDOM } = jsdom;

fs.readFile("./contacts.html", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dom = new JSDOM(data);

  // Query all titles and phone from given HTML
  const contactElements = query(dom.window.document, CONTACT_SELECTOR);

  const contacts = contactElements.map((el) => {
    // Query the title
    const title = query(el, CONTACT_NAME_SELECTOR)[0].textContent.replace(
      /"/g,
      "&quot;"
    );

    // Query all phones
    const phones = query(el, CONTACT_PHONE_SELECTOR).map((p) =>
      removeFormat(p.textContent.replace("▪ ", ""))
    );

    return { title: removeFormat(title), phones };
  });

  const csv = contacts.reduce((all, contact) => {
    all += `${contact.title}, ${contact.phones.join(", ")}\n`;
    return all;
  }, "Title, Phone\n");

  fs.writeFile("contacts.csv", csv, (err) => {
    if (err) {
      console.error(err);
    }
  });
});

const query = (el, selector) => {
  console.log(selector);
  return [...el.querySelectorAll(selector)];
};

const removeFormat = (text) => text.replace(/(\r\n|\n|\r)/gm, "").trim();
