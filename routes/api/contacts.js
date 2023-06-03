const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts.js");
const Joi = require("joi");

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),
});

router.get("/", async (req, res, next) => {
  const data = await listContacts();
  res.json({
    status: "success",
    code: 200,
    data,
    message: "Contacts listed",
  });
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (contact.length > 0) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

router.post("/", async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  const contactAdded = await addContact(req.body);
  if (contactAdded) {
    res.json({ message: "Contact Added" });
  } else {
    res.status(404).json({ message: "Missing some information" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const removeResult = await removeContact(req.params.contactId);
  if (removeResult) {
    res.json({
      status: "success",
      code: 200,

      message: `Contact deleted`,
    });
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  if (req.body === undefined)
    res.status(400).json({ message: "missing fields" });

  try {
    const updatedContact = await updateContact(req.params.contactId, req.body);

    if (updatedContact) {
      res.json({
        status: "success",
        code: 200,
        updatedContact,
        message: "Contact updated",
      });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
