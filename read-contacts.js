const fs = require("node:fs");
const jsdom = require("jsdom");

const CONTACT_NAME_SELECTOR = '[data-cy="contact-row-display-name"]';
const CONTACT_PHONE_SELECTOR = '[data-cy="contact-row-tel"]';

const { JSDOM } = jsdom;

fs.readFile("./contacts.html", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dom = new JSDOM(data);

  // Query all titles and phone from given HTML
  const contactTitles = queryText(dom, CONTACT_NAME_SELECTOR);
  const contactPhones = queryText(dom, CONTACT_PHONE_SELECTOR).map((phone) =>
    phone.replace("▪ ", "")
  );

  // Combine titles and phone numbers into single objects within one array.
  // This will make formatting the CSV file next much cleaner.
  const contactsFull = [];
  for (let i = 0; i < contactTitles.length; i++) {
    contactsFull.push({ title: contactTitles[i], phone: contactPhones[i] });
  }

  const csv = contactsFull.reduce((all, contact) => {
    all += `${contact.title}, ${contact.phone}\n`;
    return all;
  }, "Title, Phone\n");

  fs.writeFile("contacts.csv", csv, (err) => {
    if (err) {
      console.error(err);
    }
  });
});

const queryText = (dom, selector) =>
  [...dom.window.document.querySelectorAll(selector)].map(
    (el) => el.innerText || el.textContent
  );
