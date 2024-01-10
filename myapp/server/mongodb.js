const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 8000;

// MongoDB URI and Client
const uri = "your_mongodb_uri";
const client = new MongoClient(uri);

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

// Middleware to ensure MongoDB is connected
async function ensureMongoDBConnection(req, res, next) {
    if (!client.topology || !client.topology.isConnected()) {
        try {
            await connectToMongo();
        } catch (error) {
            return res.status(500).json({ message: 'Failed to connect to MongoDB', error: error.message });
        }
    }
    next();
}

app.use(cors());
app.use(bodyParser.json());
app.use(ensureMongoDBConnection);

// Registration Route
app.post('/register', async (req, res) => {
    const userData = req.body;
    const usersCollection = client.db('your_database_name').collection('your_collection_name');

    try {
        const existingUser = await usersCollection.findOne({ username: userData.username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const result = await usersCollection.insertOne(userData);
        const userID = result.insertedId;

        res.status(201).json({ message: 'User registered successfully', userID });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const usersCollection = client.db('your_database_name').collection('your_collection_name');

    try {
        const user = await usersCollection.findOne({ username, password });
        if (user) {
            const userID = user._id;
            res.status(200).json({ message: 'Login successful', userID });
        } else {
            res.status(401).json({ message: 'Login failed. Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Team Members Routes

// Add Team Member
app.post('/api/team-members', async (req, res) => {
    const teamMemberData = req.body;
    const teamMembersCollection = client.db('your_database_name').collection('teamMembers');

    try {
        const result = await teamMembersCollection.insertOne(teamMemberData);
        const teamMemberID = result.insertedId;
        res.status(201).json({ message: 'Team member added successfully', teamMemberID });
    } catch (error) {
        console.error('Add team member error:', error);
        res.status(500).json({ message: 'Failed to add team member' });
    }
});

// Get All Team Members
app.get('/api/team-members', async (req, res) => {
    const { userID } = req.query;
    const teamMembersCollection = client.db('your_database_name').collection('teamMembers');
    try {
        let query = {};
        if (userID) {
            query.userID = userID; // Directly use the string
        }
        const teamMembers = await teamMembersCollection.find(query).toArray();
        res.status(200).json(teamMembers);
    } catch (error) {
        console.error('Get team members error:', error);
        res.status(500).json({ message: 'Failed to get team members' });
    }
});

// Get Single Team Member
app.get('/api/team-members/:id', async (req, res) => {
    const { id } = req.params;
    const teamMembersCollection = client.db('your_database_name').collection('teamMembers');

    try {
        const teamMember = await teamMembersCollection.findOne({ _id: new ObjectId(id) });
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(teamMember);
    } catch (error) {
        console.error('Get team member error:', error);
        res.status(500).json({ message: 'Failed to get team member' });
    }
});

// Update Team Member
app.put('/api/team-members/:id', async (req, res) => {
    const { id } = req.params;
    let updateData = req.body;

    if (updateData._id) {
        delete updateData._id;
    }

    try {
        // Step 1: Find the document
        const document = await client
            .db('your_database_name')
            .collection('teamMembers')
            .findOne({ _id: new ObjectId(id) });

        if (!document) {
            console.log("No team member found with the ID:", id);
            return res.status(404).json({ message: 'No team member found with this ID' });
        }

        // Step 2: Update the document
        const updateResult = await client
            .db('your_database_name')
            .collection('teamMembers')
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );

        if (updateResult.matchedCount === 0) {
            console.log("Failed to update the team member with ID:", id);
            return res.status(404).json({ message: 'Failed to update team member' });
        }

        console.log("Team member updated successfully:", id);
        res.status(200).json({ message: 'Team member updated successfully', updatedData: updateData });
    } catch (error) {
        console.error('Error updating team member:', error);
        res.status(500).json({ message: 'Failed to update team member' });
    }
});

// Delete Team Member
app.delete('/api/team-members/:id', async (req, res) => {
    const { id } = req.params;
    const teamMembersCollection = client.db('your_database_name').collection('teamMembers');

    try {
        const result = await teamMembersCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No team member found with this ID' });
        }

        res.status(200).json({ message: 'Team member deleted successfully' });
    } catch (error) {
        console.error('Delete team member error:', error);
        res.status(500).json({ message: 'Failed to delete team member' });
    }
});

app.get('/api/contacts', async (req, res) => {
    const { userID } = req.query;
    const contactsCollection = client.db('your_database_name').collection('contacts');

    try {
        let query = {};
        if (userID) {
            query.userID = userID; // Directly use the string
        }
        const contacts = await contactsCollection.find(query).toArray();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ message: 'Failed to get contacts' });
    }
});
app.get('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const contactsCollection = client.db('your_database_name').collection('contacts');

    try {
        const contact = await contactsCollection.findOne({ _id: new ObjectId(id) });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({ message: 'Failed to get contact' });
    }
});



// Add Contact
app.post('/api/contacts', async (req, res) => {
    const contactData = req.body;
    const contactsCollection = client.db('your_database_name').collection('contacts');

    try {
        // Insert new contact directly without auto-incrementing registrarId
        const result = await contactsCollection.insertOne(contactData);
        const contactID = result.insertedId
        res.status(201).json({ message: 'Contact added successfully', contactID });
    } catch (error) {
        console.error('Add contact error:', error);
        res.status(500).json({ message: 'Failed to add contact' });
    }
});



// Update Contact
app.put('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const contactsCollection = client.db('your_database_name').collection('contacts');

    try {
        const result = await contactsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No contact found with this ID' });
        }

        res.status(200).json({ message: 'Contact updated successfully' });
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({ message: 'Failed to update contact' });
    }
});

// Delete Contact
app.delete('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const contactsCollection = client.db('your_database_name').collection('contacts');

    try {
        const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No contact found with this ID' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ message: 'Failed to delete contact' });
    }
});

app.get('/api/invoices', async (req, res) => {
    const { userID } = req.query;
    const invoicesCollection = client.db('your_database_name').collection('invoices');

    try {
        let query = {};
        if (userID) {
            query.userID = userID; // Directly use the string
        }
        const invoices = await invoicesCollection.find(query).toArray();
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({ message: 'Failed to get invoices' });
    }
});
app.get('/api/invoices/:id', async (req, res) => {
    const { id } = req.params;
    const invoicesCollection = client.db('your_database_name').collection('invoices');

    try {
        const invoice = await invoicesCollection.findOne({ _id: new ObjectId(id) });
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({ message: 'Failed to get invoice' });
    }
});


// Add Invoice
app.post('/api/invoices', async (req, res) => {
    const invoiceData = req.body;
    const invoiceCollection = client.db('your_database_name').collection('invoices');

    try {
        const result = await invoiceCollection.insertOne(invoiceData);
        const invoiceID = result.insertedId;
        res.status(201).json({ message: 'Invoice added successfully', invoiceID });
    } catch (error) {
        console.error('Add invoice error:', error);
        res.status(500).json({ message: 'Failed to add invoice' });
    }
});

// Update Invoice
app.put('/api/invoices/:id', async (req, res) => {
    const { id } = req.params;
    let updateData = req.body;

    if (updateData._id) {
        delete updateData._id;
    }

    try {
        // Step 1: Find the document
        const document = await client
            .db('your_database_name')
            .collection('invoices')
            .findOne({ _id: new ObjectId(id) });

        if (!document) {
            console.log("No invoices found with the ID:", id);
            return res.status(404).json({ message: 'No invoices found with this ID' });
        }

        // Step 2: Update the document
        const updateResult = await client
            .db('your_database_name')
            .collection('invoices')
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );

        if (updateResult.matchedCount === 0) {
            console.log("Failed to update the Invoice with ID:", id);
            return res.status(404).json({ message: 'Failed to update Invoice' });
        }

        console.log("Invoice updated successfully:", id);
        res.status(200).json({ message: 'Invoice updated successfully', updatedData: updateData });
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ message: 'Failed to update invoice' });
    }
});

// Delete Invoice
app.delete('/api/invoices/:id', async (req, res) => {
    const { id } = req.params;
    const invoiceCollection = client.db('your_database_name').collection('invoices');

    try {
        const result = await invoiceCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No invoice found with this ID' });
        }

        res.status(200).json({ message: 'Invoice  deleted successfully' });
    } catch (error) {
        console.error('Delete invoice error:', error);
        res.status(500).json({ message: 'Failed to delete invoice' });
    }
});
app.get('/api/events', async (req, res) => {
    const { userID } = req.query;
    try {
      const eventsCollection = client.db('your_database_name').collection('events');
      const events = await eventsCollection.find({ userID }).toArray();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
    }
  });
  
  // Endpoint to add a new event
  app.post('/api/events', async (req, res) => {
    const eventData = req.body;
    try {
      const eventsCollection = client.db('your_database_name').collection('events');
      await eventsCollection.insertOne(eventData);
      res.status(201).json({ message: 'Event added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding event', error });
    }
  });
  
  // Endpoint to update an event
  app.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const eventsCollection = client.db('your_database_name').collection('events');
      const result = await eventsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'No event found with this ID' });
      }
  
      res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating event', error });
    }
  });
  
  // Endpoint to delete an event
  app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const eventsCollection = client.db('your_database_name').collection('events');
      const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No event found with this ID' });
      }
  
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting event', error });
    }
  });

  //Project Endpoints
  app.post('/api/projects', async (req, res) => {
    const { userID, projectName, deadline } = req.body;
    const projectsCollection = client.db('your_database_name').collection('projects');

    try {
        // Check if a project is already in progress
        const inProgressProject = await projectsCollection.findOne({ userID, isCompleted: false });
        if (inProgressProject) {
            return res.status(400).json({ message: 'A project is already in progress.' });
        }

        // Add new project
        const result = await projectsCollection.insertOne({ userID, projectName, deadline });
        res.status(201).json({ message: 'Project added successfully', projectID: result.insertedId });
    } catch (error) {
        console.error('Add project error:', error);
        res.status(500).json({ message: 'Failed to add project' });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const projectsCollection = client.db('your_database_name').collection('projects');

    try {
        const result = await projectsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No project found with this ID' });
        }

        res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ message: 'Failed to update project' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectToMongo().catch(console.error);
});
