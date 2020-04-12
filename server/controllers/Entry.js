const models = require('../models');

const Entry = models.Entry;

const makeEntry = (req, res) => {
  if (!req.body.name || !req.body.content) {
    return res.status(400).json({ error: 'Both Name and Content are Required' });
  }


  const entryData = {
    name: req.body.name,
    content: req.body.content,
    date: req.body.date,
    owner: req.session.account._id,
  };

  const newEntry = new Entry.EntryModel(entryData);

  const entryPromise = newEntry.save();

  entryPromise.then(() => res.json({ redirect: '/maker' }));

  entryPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Entry already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return entryPromise;
};

const makerPage = (req, res) => {
  Entry.EntryModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), entries: docs });
  });
};

//gets entry and deletes it
const deleteEntry = (request, response) => {
  const req = request;
  const res = response;

  return Entry.EntryModel.deleteOne({ _id: req.body._id }, (err, entry) => {
    if (err) return res.status(500).send(err);

    const jsonRes = {
      message: 'Entry successfully deleted',
      id: entry._id,
      redirect: '/maker',
    };

    return res.status(200).send(jsonRes);
  });
};

//gets entry and makes it editeble
const updateEntry = (request, response) => {
  const req = request;
  const res = response;

  return Entry.EntryModel.updateOne({ _id: req.body._id },
    { name: req.body.name, content: req.body.content, date: req.body.date, },
    (err, entry) => {
      if (err) return res.status(500).send(err);

      const jsonRes = {
        message: 'Entry successfully updated',
        id: entry._id,
        redirect: '/maker',
      };

      return res.status(200).send(jsonRes);
    });
};

const getEntries = (request, response) => {
  const req = request;
  const res = response;

  return Entry.EntryModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ entries: docs });
  });
};

module.exports.getEntries = getEntries;
module.exports.makerPage = makerPage;
module.exports.make = makeEntry;
module.exports.deleteEntry = deleteEntry;
module.exports.updateEntry = updateEntry;
